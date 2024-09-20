package crud

import (
	"context"
	"dg-kala-sample/database"
	"dg-kala-sample/models"
	"fmt"
	"net/http"
	"sort"
	"time"

	"github.com/gofiber/fiber/v2"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
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

	var discounts []models.SaleDiscount

	filter := bson.M{"end_date": bson.M{"$gt": time.Now()}}

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

	// Limit to top 10
	if len(discounts) > 10 {
		discounts = discounts[:10]
	}

	type Response struct {
		Discount   models.SaleDiscount `json:"discount"`
		Percenrage float64             `json:"percenrage"`
		Product    models.Product      `json:"product"`
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
		response.Product = prod
		responses = append(responses, response)
	}

	return c.Status(http.StatusOK).JSON(responses)
}
