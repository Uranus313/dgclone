package crud

import (
	"context"
	"dg-kala-sample/database"
	"dg-kala-sample/models"
	"fmt"
	"net/http"
	"sort"
	"strconv"
	"time"

	"github.com/gofiber/fiber/v2"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func GetMostDiscounts(c *fiber.Ctx) error {

	// pipeline := mongo.Pipeline{
	// 	{{Key: "$addFields", Value: bson.D{
	// 		{Key: "discount_percentage", Value: bson.D{
	// 			{Key: "$multiply", Value: bson.A{
	// 				bson.D{{Key: "$subtract", Value: bson.A{1, bson.D{{Key: "$divide", Value: bson.A{"$new_price", "$prod.original_price"}}}}}},
	// 				100,
	// 			}},
	// 		}},
	// 	}}},
	// 	{{Key: "$sort", Value: bson.D{{Key: "discount_percentage", Value: -1}}}},
	// 	{{Key: "$limit", Value: 10}},
	// }

	// cursor, err := database.SaleDiscountCollection.Aggregate(context.Background(),pipeline)

	// if err != nil {
	// 	return c.Status(http.StatusInternalServerError).JSON(fiber.Map{"error while fetching discounts from database: ": err.Error()})
	// }

	// defer cursor.Close(context.Background())

	// var TopDiscounts []models.SaleDiscount

	// if err = cursor.All(context.Background(), &TopDiscounts); err != nil {
	// 	return c.Status(http.StatusInternalServerError).JSON(fiber.Map{"error while decoding cursor": err.Error()})
	// }

	cateIDString := c.Params("CateID", primitive.NilObjectID.Hex())

	cateID, err := primitive.ObjectIDFromHex(cateIDString)

	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	var discounts []models.SaleDiscount

	var filter primitive.M

	if cateID == primitive.NilObjectID {
		filter = bson.M{
			"end_date": bson.M{"$gt": time.Now()},
		}
	} else {
		filter = bson.M{
			"end_date":         bson.M{"$gt": time.Now()},
			"prod.category_id": cateID,
		}
	}

	cursor, err := database.SaleDiscountCollection.Find(context.Background(), filter)

	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{"error while fetching discounts from database: ": err.Error()})
	}

	defer cursor.Close(context.Background())

	if err := cursor.All(context.Background(), &discounts); err != nil {
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{"error while decoding cursor": err.Error()})
	}

	sort.Slice(discounts, func(i, j int) bool {
		discountI := (1 - float64(discounts[i].NewPrice)/float64(discounts[i].Prod.OriginalPrice)) * 100
		discountJ := (1 - float64(discounts[j].NewPrice)/float64(discounts[j].Prod.OriginalPrice)) * 100
		return discountI > discountJ
	})

	// Limit to top 30
	if len(discounts) > 30 {
		discounts = discounts[:30]
	}

	type Response struct {
		Discount   models.SaleDiscount `json:"discount"`
		Percenrage float64             `json:"percenrage"`
		Product    models.ProductCard  `json:"product"`
	}

	var responses []Response

	for _, discount := range discounts {
		var response Response
		response.Discount = discount
		response.Percenrage = (1 - float64(discount.NewPrice)/float64(discount.Prod.OriginalPrice)) * 100
		var prod models.Product
		filter := bson.M{"_id": discount.Prod.ProdID}
		err = database.ProductCollection.FindOne(context.Background(), filter).Decode(&prod)
		if err != nil {
			if err == mongo.ErrNoDocuments {
				err_text := fmt.Sprintf("inconsistency! product id %v in discount id %v is not valid", discount.Prod.ProdID, discount.ID)
				return c.Status(http.StatusNotFound).JSON(fiber.Map{"error": err_text})
			}
			return c.Status(http.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
		}
		var prodCard models.ProductCard = CreateProdCard(prod)
		response.Product = prodCard
		responses = append(responses, response)
	}

	prodFindOpts := options.Find().SetSort(bson.D{{Key: "sell_count", Value: -1}}).SetLimit(30)

	if cateID == primitive.NilObjectID {
		filter = bson.M{}
	} else {
		filter = bson.M{"category_id": cateID}
	}

	cursor2, err := database.ProductCollection.Find(context.Background(), filter, prodFindOpts)

	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	var bestSaleProds []models.ProductCard

	// if err := cursor2.All(context.Background(), &bestSaleProds); err != nil {
	// 	return c.Status(http.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	// }
	for cursor2.Next(context.Background()) {
		var product models.Product
		if err := cursor2.Decode(&product); err != nil {
			return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
				"message": "error while decoding cursor",
				"error":   err.Error(),
			})
		}

		var productCard models.ProductCard = CreateProdCard(product)

		bestSaleProds = append(bestSaleProds, productCard)
	}

	return c.Status(http.StatusOK).JSON(fiber.Map{
		"best_discounts": responses,
		"best_sales":     bestSaleProds,
	})
}

func AddSaleDiscount(c *fiber.Ctx) error {

	prodIDString := c.Query("ProdID")

	prodID, err := primitive.ObjectIDFromHex(prodIDString)

	if err != nil {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{
			"message": "error while fetching prod id from params",
			"error":   err.Error(),
		})
	}

	sellerIDString := c.Query("SellerID")

	sellerID, err := primitive.ObjectIDFromHex(sellerIDString)

	if err != nil {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{
			"message": "error while fetching seller id from params",
			"err":     err.Error(),
		})
	}

	endDateString := c.Query("EndDate")

	dateLayout := "2006-01-02 15:04:05"

	endDate, err := time.Parse(dateLayout, endDateString)

	if err != nil {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{
			"message":        "problem with the date time entry",
			"correct_layout": dateLayout,
			"error":          err.Error(),
		})
	}

	newPriceString := c.Query("NewPrice")

	newPrice, err := strconv.Atoi(newPriceString)

	if err != nil {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{
			"message": "error while fetching New Price from query",
			"error":   err.Error(),
		})
	}

	var prod models.Product

	filter := bson.M{"_id": prodID}

	err = database.ProductCollection.FindOne(context.Background(), filter).Decode(&prod)

	if err != nil {
		if err == mongo.ErrNoDocuments {
			return c.Status(http.StatusNotFound).JSON(fiber.Map{"error": "product not found"})
		}
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	var sellerFound bool = false
	var sellerIndex int

	for index, seller := range prod.Sellers {
		if seller.SellerID == sellerID {
			sellerFound = true
			sellerIndex = index
			break
		}
	}

	if !sellerFound {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{"error": "the provided seller id is not found in the product sellers list"})
	}

	if newPrice >= prod.Sellers[sellerIndex].Price {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{"error": "the new price can not be less than the original price "})
	}

	var salediscount = models.SaleDiscount{
		NewPrice: newPrice,
		EndDate:  endDate,
		Prod: models.DiscountProd{
			ProdID:        prodID,
			SellerID:      sellerID,
			OriginalPrice: prod.Sellers[sellerIndex].Price,
			CategoryID:    prod.CategoryID,
		},
	}

	insertResult, err := database.SaleDiscountCollection.InsertOne(context.Background(), salediscount)

	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
			"message": "something went wrong while adding sale discount to collection",
			"error":   err.Error(),
		})
	}

	salediscount.ID = insertResult.InsertedID.(primitive.ObjectID)

	prod.Sellers[sellerIndex].DiscountID = salediscount.ID

	update := bson.M{
		"$set": bson.M{
			"sellers": prod.Sellers,
		},
	}

	_, err = database.ProductCollection.UpdateByID(context.Background(), prodID, update)

	if err != nil {
		_, err2 := database.SaleDiscountCollection.DeleteOne(context.Background(), bson.M{"_id": salediscount.ID})
		if err2 != nil {
			return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
				"message": "error while updating product seller and error while deleting inserted sale discount documnet (shit is bad)",
				"error":   err2.Error(),
			})
		}
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
			"message": "error while updating product seller",
			"err":     err.Error(),
		})
	}

	return c.Status(http.StatusCreated).JSON(salediscount)
}
