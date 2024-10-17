package crud

import (
	"context"
	"dg-kala-sample/database"
	"dg-kala-sample/models"
	"errors"
	"fmt"

	// "fmt"
	"net/http"
	// "sort"
	"strconv"
	"time"

	"github.com/gofiber/fiber/v2"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func GetAllProducts(c *fiber.Ctx) error {

	// token = admin ????

	limitString := c.Query("limit", "8")

	limit, err := strconv.Atoi(limitString)

	if err != nil {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{"error while fetching limit from query": err.Error()})
	}

	offsetString := c.Query("offset", "0")

	offset, err := strconv.Atoi(offsetString)

	if err != nil {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{"error while fetching offset from query": err.Error()})
	}

	sortMethodString := c.Query("SortMethod", "1")

	sortMethod, err := strconv.Atoi(sortMethodString)

	if err != nil {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{"error while fetching sort method from query": err.Error()})
	}

	prodTitle := c.Query("prodTitle", "")

	/*
		valid_sort_methods = {
			1: "title",
			2: "brand",
			3: "rating",
		}
	*/

	var product_list []models.Product
	var filter primitive.M

	if prodTitle != "" {

		filter = bson.M{
			"$or": []bson.M{
				{"validation_state": models.Validated},
				{"validation_state": models.Banned},
			},
			"title": prodTitle,
		}

		cursor, err := database.ProductCollection.Find(context.Background(), filter)

		if err != nil {
			if err == mongo.ErrNoDocuments {
				return c.Status(http.StatusNotFound).JSON(fiber.Map{"error": "product not found"})
			}
			return c.Status(http.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
		}

		if err := cursor.All(context.Background(), &product_list); err != nil {
			return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
				"message": "error while decoding cursor",
				"error":   err.Error(),
			})
		}

		return c.Status(http.StatusOK).JSON(fiber.Map{
			"products": product_list,
			"hasMore":  false,
		})
	}

	filter = bson.M{"$or": []bson.M{
		{"validation_state": models.Validated},
		{"validation_state": models.Banned},
	}}

	findOpts := options.Find().SetSkip(int64(offset)).SetLimit(int64(limit))

	switch sortMethod {
	case 1:
		findOpts.SetSort(bson.D{{Key: "title", Value: 1}})
	case 2:
		findOpts.SetSort(bson.D{{Key: "brand_id", Value: 1}})
	case 3:
		findOpts.SetSort(bson.D{{Key: "rating.rate", Value: -1}})
	default:
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid Sort Method",
			"valid_sort_methods": fiber.Map{
				"1": "title",
				"2": "brand",
				"3": "rating",
			},
		})
	}

	cursor, err := database.ProductCollection.Find(context.Background(), filter, findOpts)

	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{"error while fetching products from database: ": err.Error()})
	}

	defer cursor.Close(context.Background())

	for cursor.Next(context.Background()) {
		var product models.Product
		if err := cursor.Decode(&product); err != nil {
			return c.Status(http.StatusInternalServerError).JSON(fiber.Map{"error while decoding cursor": err.Error()})
		}
		product_list = append(product_list, product)
	}

	var hasMore bool = false

	if len(product_list) == limit {

		findOpts.SetSkip(int64(limit) + int64(offset)).SetLimit(1)
		var nextDocs []models.Product
		nextDocsCursor, err := database.ProductCollection.Find(context.Background(), filter, findOpts)

		if err != nil {
			return c.Status(http.StatusInternalServerError).JSON(fiber.Map{"error while fetching products from database: ": err.Error()})
		}

		defer nextDocsCursor.Close(context.Background())

		if err := nextDocsCursor.All(context.Background(), &nextDocs); err != nil {
			return c.Status(http.StatusInternalServerError).JSON(fiber.Map{"error while decoding next doc cursor": err.Error()})
		}

		if len(nextDocs) > 0 {
			hasMore = true
		}

	}

	return c.Status(http.StatusOK).JSON(fiber.Map{
		"products": product_list,
		"hasMore":  hasMore,
	})
}

func GetAllPendingProds(c *fiber.Ctx) error {

	// token = admin ????

	limitString := c.Query("limit", "20")

	limit, err := strconv.Atoi(limitString)

	if err != nil {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{"error while fetching limit from query": err.Error()})
	}

	offsetString := c.Query("offset", "0")

	offset, err := strconv.Atoi(offsetString)

	if err != nil {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{"error while fetching offset from query": err.Error()})
	}

	var product_list []models.Product

	findOpts := options.Find().SetSkip(int64(offset)).SetLimit(int64(limit))

	filter := bson.M{"validation_state": models.PendingValidation}

	cursor, err := database.ProductCollection.Find(context.Background(), filter, findOpts)

	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{"error while fetching products from database:": err.Error()})
	}

	defer cursor.Close(context.Background())

	if err := cursor.All(context.Background(), &product_list); err != nil {
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{"error while decoding cursor": err.Error()})
	}

	var hasMore bool = false

	if len(product_list) == limit {

		findOpts.SetSkip(int64(limit) + int64(offset)).SetLimit(1)
		var nextDocs []models.Product
		nextDocsCursor, err := database.ProductCollection.Find(context.Background(), filter, findOpts)

		if err != nil {
			return c.Status(http.StatusInternalServerError).JSON(fiber.Map{"error while fetching products from database:": err.Error()})
		}

		defer nextDocsCursor.Close(context.Background())

		if err := nextDocsCursor.All(context.Background(), &nextDocs); err != nil {
			return c.Status(http.StatusInternalServerError).JSON(fiber.Map{"error while decoding next doc cursor": err.Error()})
		}

		if len(nextDocs) > 0 {
			hasMore = true
		}

	}

	return c.Status(http.StatusOK).JSON(fiber.Map{
		"products": product_list,
		"hasMore":  hasMore,
	})
}

func UpdateProdValidationState(c *fiber.Ctx) error {

	prodIDString := c.Query("ProdID")

	prodID, err := primitive.ObjectIDFromHex(prodIDString)

	if err != nil {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{
			"message": "error while fetching prod id from params",
			"error":   err.Error(),
		})
	}

	validationStateString := c.Query("ValidationState")

	validationState, err := strconv.Atoi(validationStateString)

	if err != nil {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{
			"message": "error while fetching validation state from query",
			"error":   err.Error(),
		})
	}

	if validationState != 2 && validationState != 3 {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{
			"error": "invalid validation state",
			"valid requests": fiber.Map{
				"2": "Validated",
				"3": "Banned",
			},
		})
	}

	update := bson.M{"$set": bson.M{"validation_state": validationState}}

	updateResult, err := database.ProductCollection.UpdateByID(context.Background(), prodID, update)

	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
			"message": "error while updating product",
			"error":   err.Error(),
		})
	}

	if updateResult.MatchedCount == 0 {
		return c.Status(http.StatusNotFound).JSON(fiber.Map{"error": "product not found"})
	}

	if updateResult.ModifiedCount == 0 {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{"error": "product was not modified"})
	}

	return c.Status(http.StatusOK).JSON(fiber.Map{"message": "product validation state updated succesfully"})
}

func GetProductByID(c *fiber.Ctx) error {

	var product models.Product

	prodIDString := c.Params("ProdID")

	prodID, err := primitive.ObjectIDFromHex(prodIDString)

	if err != nil {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{"error while fetching prod id from params": err.Error()})
	}

	visit_time := time.Now()

	filter := bson.M{"_id": prodID}
	update := bson.M{
		"$push": bson.M{"visits": visit_time},
		"$inc":  bson.M{"visit_count": 1},
	}
	opts := options.FindOneAndUpdate().SetReturnDocument(options.After)

	err = database.ProductCollection.FindOneAndUpdate(context.Background(), filter, update, opts).Decode(&product)

	if err != nil {
		if err == mongo.ErrNoDocuments {
			return c.Status(http.StatusNotFound).JSON(fiber.Map{"error": "product not found"})
		}
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	if product.ValidationState.String() == "PendingValidation" || product.ValidationState.String() == "Banned" {
		return c.Status(http.StatusForbidden).JSON(fiber.Map{
			"error":            "product is not validated",
			"validation state": product.ValidationState.String(),
		})
	}

	// return last 20 comments
	filter = bson.M{
		"product_id":       prodID,
		"comment_type":     models.RegularComment,
		"validation_state": models.Validated,
	}
	comment_opts := options.Find().SetSort(bson.D{{Key: "date_sent", Value: -1}}).SetLimit(20)

	cursor, err := database.CommentCollection.Find(context.Background(), filter, comment_opts)

	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{"error while fetching product comments": err.Error()})
	}

	defer cursor.Close(context.Background())

	type CommentResponse struct {
		Comment    models.Comment
		Score      int
		HasOrdered bool
	}

	var commentResponse []CommentResponse

	// var prodComments []models.Comment
	for cursor.Next(context.Background()) {
		var comment models.Comment
		if err := cursor.Decode(&comment); err != nil {
			return c.Status(http.StatusInternalServerError).JSON(fiber.Map{"error while decoding cursor": err.Error()})
		}
		var commentScore int = 0

		for _, likeOrDislike := range comment.LikesAndDisslikes {
			if likeOrDislike.Liked {
				commentScore++
			} else {
				commentScore--
			}
		}

		var hasOrdered bool

		if comment.OrderID.IsZero() {
			hasOrdered = false
		} else {
			hasOrdered = true
		}

		var response = CommentResponse{
			Comment:    comment,
			Score:      commentScore,
			HasOrdered: hasOrdered,
		}

		commentResponse = append(commentResponse, response)
	}

	return c.Status(http.StatusOK).JSON(fiber.Map{
		"product":  product,
		"comments": commentResponse,
	})

}

func AddProduct(c *fiber.Ctx) error {

	seller := c.Locals("ent").(map[string]interface{})

	var product models.Product

	// token := "?????"

	if err := c.BodyParser(&product); err != nil {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{"error": "Invalid request body"})
	}

	// adding defualt guarantee for sellers
	// for _, seller := range product.Sellers {

	// 	if len(seller.Guarantees) == 0 {

	// 		defualt_guarantee := models.Guarantee{Title: "گارانتی اصالت و سلامت فیزیکی کالا", Desc: ""}

	// 		seller.Guarantees = append(seller.Guarantees, defualt_guarantee)
	// 	}
	// }

	// Patch(add product to seller prods)
	if product.Title == "" ||
		product.Description == "" ||
		len(product.Details) == 0 ||
		product.CategoryID.IsZero() ||
		product.BrandID.IsZero() ||
		product.Dimentions.Height == 0 ||
		product.Dimentions.Length == 0 ||
		product.Dimentions.Width == 0 ||
		len(product.Images) == 0 {

		return c.Status(http.StatusBadRequest).JSON(fiber.Map{"error": "all necessory fields must be field"})
	}

	product.DateAdded = time.Now()
	product.ValidationState = models.PendingValidation
	product.SellCount = 0
	product.VisitCount = 0
	product.Vists = []time.Time{}
	product.Rating = models.Rating{
		Rate:    0,
		RateNum: 0,
	}

	var sellerCart models.SellerCart = CreateSellerCart(seller)

	product.Sellers = append(product.Sellers, sellerCart)

	insertResult, err := database.ProductCollection.InsertOne(context.Background(), product)

	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
			"message": "Failed to add product",
			"error":   err.Error(),
		})
	}

	product.ID = insertResult.InsertedID.(primitive.ObjectID)

	_, statusCode, err := InnerRequest(PUT, "/sellerProduct", nil, map[string]string{
		"sellerID":  seller["_id"].(string),
		"productID": product.ID.Hex(),
	})

	if err != nil {
		return c.Status(statusCode).JSON(fiber.Map{
			"message": "Inner API Error",
			"error":   err.Error(),
		})
	}

	return c.Status(http.StatusCreated).JSON(product)

}

func CreateSellerCart(seller map[string]interface{}) models.SellerCart {
	sellerID, _ := primitive.ObjectIDFromHex(seller["_id"].(string))

	return models.SellerCart{
		SellerID:       sellerID,
		SellerTitle:    seller["storeInfo"].(map[string]interface{})["commercialName"].(string),
		SellerRating:   seller["rate"].(float64),
		SellerQuantity: []models.SellerQuantity{},
		ShipmentMethod: models.Digi_Kala,
		DiscountID:     primitive.NilObjectID,
		Price:          0,
	}
}

func AddSellerToProduct(c *fiber.Ctx) error {

	// token = ????
	// var seller map[string]interface{}
	seller := c.Locals("ent").(map[string]interface{})

	// sellerIDString := c.Query("SellerID")

	// sellerID, err := primitive.ObjectIDFromHex(sellerIDString)

	// if err != nil {
	// 	return c.Status(http.StatusBadRequest).JSON(fiber.Map{"error while fetching seller id from query": err.Error()})
	// }
	// sellerID := seller["_id"].(primitive.ObjectID)

	// if err := c.BodyParser(&sellerCart); err != nil {
	// 	return c.Status(http.StatusBadRequest).JSON(fiber.Map{"error": "Invalid request body"})
	// }

	// INNER USERS API => input:sellerID, output: seller_cart
	// type API_Response struct {
	// 	title  string
	// 	rating float32
	// 	err    string
	// }
	// sample_func := func(sellerID primitive.ObjectID) API_Response {
	// 	// function logic
	// 	// var seller_cart = models.SellerCart{SellerID: sellerID}
	// 	return API_Response{
	// 		title:  sellerID.Hex(),
	// 		rating: 5,
	// 		// err:         nil,
	// 		// status:      200,
	// 		err: "",
	// 	}
	// }
	// var api_response API_Response = sample_func(sellerID)

	// if api_response.err != nil {
	// 	return c.Status(api_response.status).JSON(fiber.Map{"error from inner user api": api_response.message})
	// }

	// sellerID, _ := primitive.ObjectIDFromHex(seller["_id"].(string))

	// var sellerCart = models.SellerCart{
	// 	SellerID:       sellerID,
	// 	SellerTitle:    seller["title"].(string),
	// 	SellerRating:   seller["rating"].(float32),
	// 	SellerQuantity: []models.SellerQuantity{},
	// 	ShipmentMethod: models.Digi_Kala,
	// 	DiscountID:     primitive.NilObjectID,
	// 	Price:          0,
	// }
	var sellerCart models.SellerCart = CreateSellerCart(seller)

	// sellerCart.SellerID = seller["_id"].(primitive.ObjectID)
	// sellerCart.SellerTitle =
	// sellerCart.SellerRating =

	prodIDString := c.Params("ProdID")

	prodID, err := primitive.ObjectIDFromHex(prodIDString)

	if err != nil {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{"error while fetching product id from query": err.Error()})
	}

	filter := bson.M{"_id": prodID}
	var prod models.Product

	err = database.ProductCollection.FindOne(context.Background(), filter).Decode(&prod)

	if err != nil {
		if err == mongo.ErrNoDocuments {
			return c.Status(http.StatusNotFound).JSON(fiber.Map{"error": "product not found"})
		}
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	sellerFound := false

	for _, prodSellerCart := range prod.Sellers {
		if prodSellerCart.SellerID == sellerCart.SellerID {
			sellerFound = true
			break
		}
	}

	if sellerFound {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{"error": "duplicate! seller already found in product seller list"})
	}

	update := bson.M{"$push": bson.M{"sellers": sellerCart}}

	updateResult, err := database.ProductCollection.UpdateByID(context.Background(), prodID, update)

	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{"error while adding seller cart to product": err.Error()})
	}

	if updateResult.MatchedCount == 0 {
		return c.Status(http.StatusNotFound).JSON(fiber.Map{"error": "product not found"})
	}

	if updateResult.ModifiedCount == 0 {
		return c.Status(http.StatusExpectationFailed).JSON(fiber.Map{"error": "product was not modified"})
	}

	_, statusCode, err := InnerRequest(PUT, "/sellerProduct", nil, map[string]string{
		"sellerID":  seller["_id"].(string),
		"productID": prodIDString,
	})

	if err != nil {
		return c.Status(statusCode).JSON(fiber.Map{
			"message": "Inner API Error",
			"error":   err.Error(),
		})
	}

	return c.Status(http.StatusOK).JSON(fiber.Map{"message": "seller cart added to product succesfully"})
}

func AddVariantToSeller(c *fiber.Ctx) error {

	seller := c.Locals("ent").(map[string]interface{})

	prodIDString := c.Query("prodID")

	prodID, err := primitive.ObjectIDFromHex(prodIDString)

	if err != nil {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{"error while fetching product id from query": err.Error()})
	}

	// sellerIDString := c.Query("SellerID")

	sellerID, err := primitive.ObjectIDFromHex(seller["_id"].(string))

	if err != nil {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{"error while fetching seller id from query": err.Error()})
	}

	var variants []models.SellerQuantity

	if err := c.BodyParser(&variants); err != nil {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{"error": "invalid request body"})
	}

	// variant.VariantID = primitive.NewObjectID()

	var product models.Product

	filter := bson.M{"_id": prodID}

	err = database.ProductCollection.FindOne(context.Background(), filter).Decode(&product)

	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
			"message": "error while fetching product from database",
			"error":   err.Error(),
		})
	}

	var sellerFound bool = false

	for index, seller := range product.Sellers {
		if seller.SellerID == sellerID {
			sellerFound = true
			// for _, variant := range variants {
			// 	variant.ValidationState = models.PendingValidation
			// 	for _, quantity := range seller.SellerQuantity {
			// 		if variant.Color.ID == quantity.Color.ID {
			// 			errMessage := fmt.Sprintf("duplicate varient/color: %#v", variant.Color.Title)
			// 			return c.Status(http.StatusBadRequest).JSON(fiber.Map{"error": errMessage})
			// 		}
			// 	}
			// 	product.Sellers[index].SellerQuantity = append(product.Sellers[index].SellerQuantity, variant)
			// }
			for i, _ := range variants {
				for j := i + 1; j < len(variants); j++ {
					if variants[i].Color.ID == variants[j].Color.ID {
						errMessage := fmt.Sprintf("duplicate varient/color: %#v", variants[i].Color.Title)
						return c.Status(http.StatusBadRequest).JSON(fiber.Map{"error": errMessage})
					}
				}
			}
			product.Sellers[index].SellerQuantity = variants
			break
		}
	}

	if !sellerFound {
		// return c.Status(http.StatusNotFound).JSON(fiber.Map{"error": "seller not found"})
		return AddSellerToProduct(c)
	}

	update := bson.M{"$set": bson.M{"sellers": product.Sellers}}

	_, err = database.ProductCollection.UpdateByID(context.Background(), prodID, update)

	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
			"message": "error while updating product",
			"error":   err.Error(),
		})
	}

	return c.Status(http.StatusOK).JSON(fiber.Map{"message": "varient added to seller succesfully"})
}

func GetAllPendingVariants(c *fiber.Ctx) error {

	// token = admin ????

	limitString := c.Query("limit", "20")

	limit, err := strconv.Atoi(limitString)

	if err != nil {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{"error while fetching limit from query": err.Error()})
	}

	offsetString := c.Query("offset", "0")

	offset, err := strconv.Atoi(offsetString)

	if err != nil {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{"error while fetching offset from query": err.Error()})
	}

	var hasMore bool = false
	addlimit := limit + 1

	pipeline := mongo.Pipeline{
		{{Key: "$skip", Value: offset}},
		{{Key: "$limit", Value: addlimit}},
		{{Key: "$unwind", Value: bson.D{{Key: "path", Value: "$sellers"}}}},
		{{Key: "$unwind", Value: bson.D{{Key: "path", Value: "$sellers.seller_quantity"}}}},
		{{Key: "$match", Value: bson.D{{Key: "sellers.seller_quantity.validation_state", Value: models.PendingValidation}}}},
		{
			{Key: "$project", Value: bson.D{
				{Key: "seller_id", Value: "$sellers.seller_id"},
				{Key: "seller_title", Value: "$sellers.seller_title"},
				{Key: "seller_rating", Value: "$sellers.seller_rating"},
				{Key: "seller_quantity", Value: "$sellers.seller_quantity"},
				{Key: "shipment_method", Value: "$sellers.shipment_method"},
				{Key: "price", Value: "$sellers.price"},
				{Key: "discount_id", Value: "$sellers.discount_id"},
				{Key: "_id", Value: "$_id"},
				{Key: "category_id", Value: "category_id"},
			}},
		},
	}

	cursor, err := database.ProductCollection.Aggregate(context.Background(), pipeline)

	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{"error while fetching data from database: ": err.Error()})
	}

	defer cursor.Close(context.Background())

	var variants []bson.M

	if err := cursor.All(context.Background(), &variants); err != nil {
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{"error while decoding cursor": err.Error()})
	}

	if len(variants) > limit {
		hasMore = true
		variants = variants[:limit]
	}

	return c.Status(http.StatusOK).JSON(fiber.Map{
		"variants": variants,
		"hasMore":  hasMore,
	})
}

func UpdateVariantValidationState(c *fiber.Ctx) error {

	prodIDString := c.Query("prodID")

	prodID, err := primitive.ObjectIDFromHex(prodIDString)

	if err != nil {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{"error while fetching product id from query": err.Error()})
	}

	sellerIDString := c.Query("SellerID")

	sellerID, err := primitive.ObjectIDFromHex(sellerIDString)

	if err != nil {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{"error while fetching seller id from query": err.Error()})
	}

	colorIDString := c.Query("ColorID")

	colorID, err := primitive.ObjectIDFromHex(colorIDString)

	if err != nil {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{"error while fetching color id from query": err.Error()})
	}

	validationStateString := c.Query("ValidationState")

	validationState, err := strconv.Atoi(validationStateString)

	if err != nil {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{
			"message": "error while fetching validation state from query",
			"error":   err.Error(),
		})
	}

	if validationState != 2 && validationState != 3 {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{
			"error": "invalid validation state",
			"valid requests": fiber.Map{
				"2": "Validated",
				"3": "Banned",
			},
		})
	}

	var product models.Product

	filter := bson.M{"_id": prodID}

	err = database.ProductCollection.FindOne(context.Background(), filter).Decode(&product)

	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
			"message": "error while fetching product from database",
			"error":   err.Error(),
		})
	}

	var sellerFound bool = false
	var quantityFound bool = false

	for index, seller := range product.Sellers {
		if seller.SellerID == sellerID {
			sellerFound = true
			for cindex, quantity := range seller.SellerQuantity {
				if colorID == quantity.Color.ID {
					quantityFound = true
					product.Sellers[index].SellerQuantity[cindex].ValidationState = models.ValidationState(validationState)
					break
				}
			}
			break
		}
	}

	if !sellerFound {
		return c.Status(http.StatusNotFound).JSON(fiber.Map{"error": "seller not found"})
	}

	if !quantityFound {
		return c.Status(http.StatusNotFound).JSON(fiber.Map{"error": "varient not found"})
	}

	update := bson.M{"$set": bson.M{"sellers": product.Sellers}}

	updateResult, err := database.ProductCollection.UpdateByID(context.Background(), prodID, update)

	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
			"message": "error while updating product",
			"error":   err.Error(),
		})
	}

	if updateResult.ModifiedCount == 0 {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{"error": "no new update entry"})
	}

	return c.Status(http.StatusOK).JSON(fiber.Map{"message": "varient added to seller succesfully"})
}

func UpdateProductRating(c *fiber.Ctx) error {

	productIDString := c.Query("ProductID")

	productID, err := primitive.ObjectIDFromHex(productIDString)

	if err != nil {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{"error while fetching product id from query": err.Error()})
	}

	ratingString := c.Query("Rating")

	rating, err := strconv.Atoi(ratingString)

	if err != nil {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{"error while fetching rating from query": err.Error()})
	}

	if rating > 5 || rating < 1 {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{"error": "invalid rating entry"})
	}

	var product models.Product
	filter := bson.M{"_id": productID}

	err = database.ProductCollection.FindOne(context.Background(), filter).Decode(&product)

	if err != nil {
		if err == mongo.ErrNoDocuments {
			return c.Status(http.StatusNotFound).JSON(fiber.Map{"error": "product not found"})
		}
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	var newRating float32 = (product.Rating.Rate*float32(product.Rating.RateNum) + float32(rating)) / (float32(product.Rating.RateNum) + 1)

	var newProdRating = models.Rating{Rate: newRating, RateNum: product.Rating.RateNum + 1}
	update := bson.M{"$set": bson.M{"rating": newProdRating}}

	_, err = database.ProductCollection.UpdateOne(context.Background(), filter, update)

	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{"error while updating product rating": err.Error()})
	}

	return c.Status(http.StatusOK).JSON(fiber.Map{"message": "product rating updated succesfully"})
}

func UpdateProdQuantity(c *fiber.Ctx) error {

	productIDString := c.Query("ProductID")

	productID, err := primitive.ObjectIDFromHex(productIDString)

	if err != nil {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{"error while fetching product id from query": err.Error()})
	}

	sellerIDString := c.Query("SellerID")

	sellerID, err := primitive.ObjectIDFromHex(sellerIDString)

	if err != nil {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{"error while fetching seller id from query": err.Error()})
	}

	quantityString := c.Query("Quantity")

	quantity, err := strconv.Atoi(quantityString)

	if err != nil {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{"error while fetching quantity from query": err.Error()})
	}

	color := c.Query("Color")

	if quantity < 0 {
		return c.Status(http.StatusBadRequest).SendString("quantity can't be negative")
	}

	var product models.Product
	filter := bson.M{"_id": productID}

	err = database.ProductCollection.FindOne(context.Background(), filter).Decode(&product)

	if err != nil {
		if err == mongo.ErrNoDocuments {
			return c.Status(http.StatusNotFound).JSON(fiber.Map{"error": "product not found"})
		}
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	var sellerFound bool = false
	var colorFound bool = false

	for index, seller := range product.Sellers {
		if seller.SellerID == sellerID {
			sellerFound = true
			for colorindex, value := range product.Sellers[index].SellerQuantity {
				if value.Color.Title == color {
					colorFound = true
					product.Sellers[index].SellerQuantity[colorindex].Quantity = quantity
					break
				}
			}
			break
			// product.Sellers[index].SellerQuantity.Quantity = quantity
		}
	}

	if !sellerFound {
		return c.Status(http.StatusNotFound).JSON(fiber.Map{"error": "seller not found"})
	}

	if !colorFound {
		return c.Status(http.StatusNotFound).JSON(fiber.Map{"error": "color not found"})
	}

	update := bson.M{"$set": bson.M{"sellers": product.Sellers}}
	_, err = database.ProductCollection.UpdateOne(context.Background(), filter, update)

	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{"error while updating product sellers list": err.Error()})
	}

	return c.Status(http.StatusOK).JSON(fiber.Map{"message": "product sellers list updated succesfully"})
}

func DeleteProductByID(c *fiber.Ctx) error {

	productIDString := c.Params("ProdID")

	productID, err := primitive.ObjectIDFromHex(productIDString)

	if err != nil {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{"error while fetching product id from params": err.Error()})
	}

	filter := bson.M{"_id": productID}

	deleteResult, err := database.ProductCollection.DeleteOne(context.Background(), filter)

	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{"error while deleting product": err.Error()})
	}

	if deleteResult.DeletedCount == 0 {
		return c.Status(http.StatusNotFound).JSON(fiber.Map{"error": "product not found"})
	}

	return c.Status(http.StatusOK).JSON(fiber.Map{"message": "product deleted sussefully"})

}

func EditProduct(c *fiber.Ctx) error {

	var updatable_fields models.UpdatableProd

	if err := c.BodyParser(&updatable_fields); err != nil {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{"error with request body": err.Error()})
	}

	filter := bson.M{"_id": updatable_fields.ID}

	update := bson.M{
		"$set": bson.M{
			"title":       updatable_fields.Title,
			"description": updatable_fields.Description,
			"images":      updatable_fields.Images,
			"details":     updatable_fields.Details,
			"dimentions":  updatable_fields.Dimentions,
			"weight_KG":   updatable_fields.Weight_KG,
			// "pros&cons":   updatable_fields.ProsNCons,
		},
	}
	// update := bson.M{"$set":updatable_fields}

	updateResult, err := database.ProductCollection.UpdateOne(context.Background(), filter, update)

	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to update product - " + err.Error()})
	}

	if updateResult.MatchedCount == 0 {
		return c.Status(http.StatusNotFound).JSON(fiber.Map{"error": "product not found"})
	}

	if updateResult.ModifiedCount == 0 {
		return c.Status(http.StatusExpectationFailed).JSON(fiber.Map{"error": "product was not modified"})
	}

	return c.Status(http.StatusOK).JSON(fiber.Map{"message": "Product Updated Successfully"})
}

func findCateIDs(cateID primitive.ObjectID, cateIDList *[]primitive.ObjectID) (int, error) {

	cateFilter := bson.M{"_id": cateID}

	var cate models.Category

	*cateIDList = append(*cateIDList, cateID)

	err := database.CategoryCollection.FindOne(context.Background(), cateFilter).Decode(&cate)

	if err != nil {
		if err == mongo.ErrNoDocuments {
			errMessage := fmt.Sprintf("category %#v not found", cateID)
			return http.StatusBadRequest, errors.New(errMessage)
		}
		return http.StatusInternalServerError, err
	}

	for _, childID := range cate.Childs {

		statusCode, err := findCateIDs(childID, cateIDList)

		if err != nil {
			return statusCode, err
		}
	}

	return http.StatusOK, nil
}

func InfiniteScrolProds(c *fiber.Ctx) error {

	limitString := c.Query("limit", "20")

	limit, err := strconv.Atoi(limitString)

	if err != nil {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{"error while fetching limit from query": err.Error()})
	}

	offsetString := c.Query("offset", "0")

	offset, err := strconv.Atoi(offsetString)

	if err != nil {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{"error while fetching offset from query": err.Error()})
	}

	cateIDString := c.Query("CateID")

	cateID, err := primitive.ObjectIDFromHex(cateIDString)

	if err != nil {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{"error while fetching category id from query": err.Error()})
	}

	sortMethodString := c.Query("SortMethod", "1")

	sortMethod, err := strconv.Atoi(sortMethodString)

	if err != nil {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{"error while fetching sort method from query": err.Error()})
	}

	minPriceFilterString := c.Query("MinPriceFilter", "0")

	minPriceFilter, err := strconv.Atoi(minPriceFilterString)

	if err != nil {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{"error while fetching min price from query": err.Error()})
	}

	maxPriceFilterString := c.Query("MaxPriceFilter", "99999999999")

	maxPriceFilter, err := strconv.Atoi(maxPriceFilterString)

	if err != nil {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{"error while fetching max price from query": err.Error()})
	}

	isAvailableString := c.Query("IsAvailable", "false")

	var isAvailable bool

	if isAvailableString == "false" {
		isAvailable = false
	} else if isAvailableString == "true" {
		isAvailable = true
	} else {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{"error": `invalid "IsAvailable" entry`})
	}

	/*
		valid_sort_methods = {
			1: "most visited",
			2: "least expensive",
			3: "most expensive",
			4: "recently added",
		}
	*/

	// filter => brand, price (min,max), is available

	queryParams := c.Queries()

	var brandFilters []primitive.ObjectID

	for i := 0; ; i++ {
		key := fmt.Sprintf("brandFilters[%d]", i)
		if value, ok := queryParams[key]; ok {
			brandFilter, err := primitive.ObjectIDFromHex(value)
			if err != nil {
				return c.Status(http.StatusBadRequest).JSON(fiber.Map{"error while converting brand filter": err.Error()})
			}
			brandFilters = append(brandFilters, brandFilter)
		} else {
			break
		}
	}

	var cateIDs []primitive.ObjectID

	statusCode, err := findCateIDs(cateID, &cateIDs)

	if err != nil {
		return c.Status(statusCode).JSON(fiber.Map{
			"message": "error while fetching from categories collection",
			"error":   err.Error(),
		})
	}

	// findOptions := options.Find()

	// findOptions.SetLimit(int64(limit))
	// findOptions.SetSkip(int64(offset))

	var pipeline mongo.Pipeline

	fmt.Println("cate id list:", cateIDs)
	fmt.Println("bramd id list:", brandFilters)

	switch sortMethod {
	case 1:
		// findOptions.SetSort(bson.D{{Key: "visit_count", Value: -1}})
		if len(brandFilters) != 0 {
			pipeline = mongo.Pipeline{
				{{Key: "$addFields", Value: bson.D{
					{Key: "minPrice", Value: bson.D{{Key: "$min", Value: "$sellers.price"}}},
				}}},
				{{Key: "$sort", Value: bson.D{
					{Key: "visit_count", Value: -1},
				}}},
				{{Key: "$match", Value: bson.D{
					// {Key: "category_id", Value: cateID},
					{Key: "category_id", Value: bson.D{{Key: "$in", Value: cateIDs}}},
					{Key: "minPrice", Value: bson.D{{Key: "$gt", Value: minPriceFilter}}},
					{Key: "minPrice", Value: bson.D{{Key: "$lt", Value: maxPriceFilter}}},
					{Key: "brand_id", Value: bson.D{{Key: "$in", Value: brandFilters}}},
				}}},
				{{Key: "$limit", Value: limit}},
				{{Key: "$skip", Value: offset}},
			}
		} else {
			pipeline = mongo.Pipeline{
				{{Key: "$addFields", Value: bson.D{
					{Key: "minPrice", Value: bson.D{{Key: "$min", Value: "$sellers.price"}}},
				}}},
				{{Key: "$sort", Value: bson.D{
					{Key: "visit_count", Value: -1},
				}}},
				{{Key: "$match", Value: bson.D{
					// {Key: "category_id", Value: cateID},
					{Key: "category_id", Value: bson.D{{Key: "$in", Value: cateIDs}}},
					{Key: "minPrice", Value: bson.D{{Key: "$gt", Value: minPriceFilter}}},
					{Key: "minPrice", Value: bson.D{{Key: "$lt", Value: maxPriceFilter}}},
				}}},
				{{Key: "$limit", Value: limit}},
				{{Key: "$skip", Value: offset}},
			}
		}
	case 2:
		if len(brandFilters) != 0 {
			pipeline = mongo.Pipeline{
				{{Key: "$addFields", Value: bson.D{
					{Key: "minPrice", Value: bson.D{{Key: "$min", Value: "$sellers.price"}}},
				}}},
				{{Key: "$sort", Value: bson.D{
					{Key: "minPrice", Value: 1}, // Ascending order
				}}},
				{{Key: "$match", Value: bson.D{
					// {Key: "category_id", Value: cateID},
					{Key: "category_id", Value: bson.D{{Key: "$in", Value: cateIDs}}},
					{Key: "minPrice", Value: bson.D{{Key: "$gt", Value: minPriceFilter}}},
					{Key: "minPrice", Value: bson.D{{Key: "$lt", Value: maxPriceFilter}}},
					{Key: "brand_id", Value: bson.D{{Key: "$in", Value: brandFilters}}},
				}}},
				{{Key: "$limit", Value: limit}},
				{{Key: "$skip", Value: offset}},
			}
		} else {
			pipeline = mongo.Pipeline{
				{{Key: "$addFields", Value: bson.D{
					{Key: "minPrice", Value: bson.D{{Key: "$min", Value: "$sellers.price"}}},
				}}},
				{{Key: "$sort", Value: bson.D{
					{Key: "minPrice", Value: 1}, // Ascending order
				}}},
				{{Key: "$match", Value: bson.D{
					// {Key: "category_id", Value: cateID},
					{Key: "category_id", Value: bson.D{{Key: "$in", Value: cateIDs}}},
					{Key: "minPrice", Value: bson.D{{Key: "$gt", Value: minPriceFilter}}},
					{Key: "minPrice", Value: bson.D{{Key: "$lt", Value: maxPriceFilter}}},
				}}},
				{{Key: "$limit", Value: limit}},
				{{Key: "$skip", Value: offset}},
			}
		}
	case 3:
		if len(brandFilters) != 0 {
			pipeline = mongo.Pipeline{
				{{Key: "$addFields", Value: bson.D{
					{Key: "minPrice", Value: bson.D{{Key: "$min", Value: "$sellers.price"}}},
				}}},
				{{Key: "$sort", Value: bson.D{
					{Key: "minPrice", Value: -1}, // Descending order
				}}},
				{{Key: "$match", Value: bson.D{
					// {Key: "category_id", Value: cateID},
					{Key: "category_id", Value: bson.D{{Key: "$in", Value: cateIDs}}},
					{Key: "minPrice", Value: bson.D{{Key: "$gt", Value: minPriceFilter}}},
					{Key: "minPrice", Value: bson.D{{Key: "$lt", Value: maxPriceFilter}}},
					{Key: "brand_id", Value: bson.D{{Key: "$in", Value: brandFilters}}},
				}}},
				{{Key: "$limit", Value: limit}},
				{{Key: "$skip", Value: offset}},
			}
		} else {
			pipeline = mongo.Pipeline{
				{{Key: "$addFields", Value: bson.D{
					{Key: "minPrice", Value: bson.D{{Key: "$min", Value: "$sellers.price"}}},
				}}},
				{{Key: "$sort", Value: bson.D{
					{Key: "minPrice", Value: -1}, // Descending order
				}}},
				{{Key: "$match", Value: bson.D{
					// {Key: "category_id", Value: cateID},
					{Key: "category_id", Value: bson.D{{Key: "$in", Value: cateIDs}}},
					{Key: "minPrice", Value: bson.D{{Key: "$gt", Value: minPriceFilter}}},
					{Key: "minPrice", Value: bson.D{{Key: "$lt", Value: maxPriceFilter}}},
				}}},
				{{Key: "$limit", Value: limit}},
				{{Key: "$skip", Value: offset}},
			}
		}
	case 4:
		// findOptions.SetSort(bson.D{{Key: "date_added", Value: -1}})
		if len(brandFilters) == 0 {
			pipeline = mongo.Pipeline{
				{{Key: "$addFields", Value: bson.D{
					{Key: "minPrice", Value: bson.D{{Key: "$min", Value: "$sellers.price"}}},
				}}},
				{{Key: "$sort", Value: bson.D{
					{Key: "date_added", Value: -1},
				}}},
				{{Key: "$match", Value: bson.D{
					// {Key: "category_id", Value: cateID},
					{Key: "category_id", Value: bson.D{{Key: "$in", Value: cateIDs}}},
					{Key: "minPrice", Value: bson.D{{Key: "$gt", Value: minPriceFilter}}},
					{Key: "minPrice", Value: bson.D{{Key: "$lt", Value: maxPriceFilter}}},
				}}},
				{{Key: "$limit", Value: limit}},
				{{Key: "$skip", Value: offset}},
			}
		} else {
			pipeline = mongo.Pipeline{
				{{Key: "$addFields", Value: bson.D{
					{Key: "minPrice", Value: bson.D{{Key: "$min", Value: "$sellers.price"}}},
				}}},
				{{Key: "$sort", Value: bson.D{
					{Key: "date_added", Value: -1},
				}}},
				{{Key: "$match", Value: bson.D{
					// {Key: "category_id", Value: cateID},
					{Key: "category_id", Value: bson.D{{Key: "$in", Value: cateIDs}}},
					{Key: "minPrice", Value: bson.D{{Key: "$gt", Value: minPriceFilter}}},
					{Key: "minPrice", Value: bson.D{{Key: "$lt", Value: maxPriceFilter}}},
					{Key: "brand_id", Value: bson.D{{Key: "$in", Value: brandFilters}}},
				}}},
				{{Key: "$limit", Value: limit}},
				{{Key: "$skip", Value: offset}},
			}
		}
	default:
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid Sort Method",
			"valid_sort_methods": fiber.Map{
				"1": "most visited",
				"2": "least expensive",
				"3": "most expensive",
				"4": "recently added",
			},
		})
	}

	// var cursor *mongo.Cursor
	// var filter = bson.M{}

	// if sortMethod == 1 || sortMethod == 4 {

	// 	filter["category_id"] = bson.M{"$in": cateIDs}

	// 	if len(brandFilters) != 0 {
	// 		filter["brand_id"] = bson.M{"$in": brandFilters}
	// 	}

	// 	// filter[""]

	// 	cursor, err = database.ProductCollection.Find(context.Background(), filter, findOptions)
	// } else {
	// 	cursor, err = database.ProductCollection.Aggregate(context.Background(), pipeline)
	// }
	cursor, err := database.ProductCollection.Aggregate(context.Background(), pipeline)

	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{"error while fetching from database": err.Error()})
	}

	defer cursor.Close(context.Background())

	var product_list []models.ProductCard

	// if err := cursor.All(context.Background(), &product_list); err != nil {
	// 	return c.Status(http.StatusInternalServerError).JSON(fiber.Map{"error while fetching cursor": err.Error()})
	// }

	for cursor.Next(context.Background()) {
		var product models.Product
		if err := cursor.Decode(&product); err != nil {
			return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
				"message": "error while decoding cursor",
				"error":   err.Error(),
			})
		}
		if isAvailable {
			prodIsAvailable := false
			for _, prodSeller := range product.Sellers {
				for _, sellerQuantity := range prodSeller.SellerQuantity {
					if sellerQuantity.Quantity > 0 {
						prodIsAvailable = true
						break
					}
				}
			}
			if prodIsAvailable {
				var productCard models.ProductCard = CreateProdCard(product)
				product_list = append(product_list, productCard)
			}
		} else {
			var productCard models.ProductCard = CreateProdCard(product)
			product_list = append(product_list, productCard)
		}
	}

	var hasMore bool = false

	if len(product_list) == limit {

		// findOptions.SetSkip(int64(limit) + int64(offset)).SetLimit(1)

		pipeline = mongo.Pipeline{
			{{Key: "$addFields", Value: bson.D{
				{Key: "minPrice", Value: bson.D{{Key: "$min", Value: "$sellers.price"}}},
			}}},
			{{Key: "$sort", Value: bson.D{
				{Key: "date_added", Value: -1},
			}}},
			{{Key: "$match", Value: bson.D{
				// {Key: "category_id", Value: cateID},
				{Key: "category_id", Value: bson.D{{Key: "$in", Value: cateIDs}}},
				{Key: "minPrice", Value: bson.D{{Key: "$gt", Value: minPriceFilter}}},
				{Key: "minPrice", Value: bson.D{{Key: "$lt", Value: maxPriceFilter}}},
			}}},
			{{Key: "$limit", Value: 1}},
			{{Key: "$skip", Value: limit + offset}},
		}

		var nextDocs []models.Product
		// nextDocsCursor, err := database.ProductCollection.Find(context.Background(), filter, findOptions)
		nextDocsCursor, err := database.ProductCollection.Aggregate(context.Background(), pipeline)

		if err != nil {
			return c.Status(http.StatusInternalServerError).JSON(fiber.Map{"error while fetching products from database:": err.Error()})
		}

		defer nextDocsCursor.Close(context.Background())

		if err := nextDocsCursor.All(context.Background(), &nextDocs); err != nil {
			return c.Status(http.StatusInternalServerError).JSON(fiber.Map{"error while decoding next doc cursor": err.Error()})
		}

		if len(nextDocs) > 0 {
			hasMore = true
		}

	}

	return c.Status(http.StatusOK).JSON(fiber.Map{
		"products": product_list,
		"hasMore":  hasMore,
	})
}

func CreateProdCard(product models.Product) models.ProductCard {

	var minPriceSellerIndex int = 0

	var minPrice int = product.Sellers[0].Price

	for index, seller := range product.Sellers {
		if seller.Price < minPrice {
			minPriceSellerIndex = index
		}
	}

	var prodCate models.Category

	err := database.CategoryCollection.FindOne(context.Background(), bson.M{"_id": product.CategoryID}).Decode(&prodCate)

	if err != nil {
		panic(err)
	}

	return models.ProductCard{
		ID:          product.ID,
		Title:       product.Title,
		Price:       product.Sellers[minPriceSellerIndex].Price,
		Picture:     product.Images[0],
		DiscountID:  product.Sellers[minPriceSellerIndex].DiscountID,
		SellerCount: len(product.Sellers),
		UrbanPrice:  product.Sellers[0].Price,
		Commission:  prodCate.CommisionPercentage,
		CategoryID:  product.CategoryID,
	}
}

func GetProdsAndOrdersCount(c *fiber.Ctx) error {

	// token = admin ????

	// var prodsCount int64
	// var ordersCount int64

	prodFilter := bson.M{"validation_state": models.Validated}

	prodsCount, err := database.ProductCollection.CountDocuments(context.Background(), prodFilter)

	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
			"message": "error while counting documents from products collection",
			"error":   err.Error(),
		})
	}

	orderFilter := bson.M{}

	ordersCount, err := database.OrderCollection.CountDocuments(context.Background(), orderFilter)

	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
			"message": "error while counting documents from orders collection",
			"error":   err.Error(),
		})
	}

	return c.Status(http.StatusOK).JSON(fiber.Map{
		"prods_count":  prodsCount,
		"orders_count": ordersCount,
	})
}

func GetSellerProducts(c *fiber.Ctx) error {

	seller := c.Locals("ent").(map[string]interface{})

	// limitString := c.Query("limit", "20")

	// limit, err := strconv.Atoi(limitString)

	// if err != nil {
	// 	return c.Status(http.StatusBadRequest).JSON(fiber.Map{"error while fetching limit from query": err.Error()})
	// }

	// offsetString := c.Query("offset", "0")

	// offset, err := strconv.Atoi(offsetString)

	// if err != nil {
	// 	return c.Status(http.StatusBadRequest).JSON(fiber.Map{"error while fetching offset from query": err.Error()})
	// }

	type ProductSellerCard struct {
		Title          string                 `json:"title"`
		CategoryTitle  string                 `json:"categoryTitle"`
		CategoryID     primitive.ObjectID     `json:"categoryID"`
		ProductID      primitive.ObjectID     `json:"productID"`
		Brand          string                 `json:"brand"`
		State          models.ValidationState `json:"state"`
		VarientCount   int                    `json:"varientCount"`
		Picture        string                 `json:"picture"`
		TotalSellPrice int                    `json:"totalSellPrice"`
		TotalSellCount int                    `json:"totalSellCount"`
		ViewCount      int                    `json:"viewCount"`
		SellerCart     models.SellerCart      `json:"sellerCart"`
	}

	var sellerProds []ProductSellerCard

	createProductSellerCard := func(product models.Product, sellerID primitive.ObjectID) (*ProductSellerCard, error) {

		var prodCate models.Category

		filter := bson.M{"_id": product.CategoryID}

		database.CategoryCollection.FindOne(context.Background(), filter).Decode(&prodCate)

		var prodBrand models.Brand

		filter = bson.M{"_id": product.BrandID}

		// err := database.BrandCollection.FindOne(context.Background(), filter).Decode(&prodBrand)

		// if err != nil {
		// 	return nil, errors.New("error while fetching brand: " + err.Error())
		// }
		prodBrand.Title = "some random brand"

		sellerFound := false
		sellerIndex := 0

		for index, sellerCart := range product.Sellers {
			if sellerCart.SellerID == sellerID {
				sellerIndex = index
				sellerFound = true
				break
			}
		}

		if !sellerFound {
			return nil, errors.New("inconsistency error! seller was not found in product seller cards list")
		}

		var prodOrders []models.Order

		filter = bson.M{
			"product.prod_id": product.ID,
			"state":           models.Delivered,
		}

		cursor, err := database.OrderCollection.Find(context.Background(), filter)

		if err != nil {
			return nil, errors.New("error while fetching orders: " + err.Error())
		}

		defer cursor.Close(context.Background())

		if err := cursor.All(context.Background(), &prodOrders); err != nil {
			return nil, errors.New("error while decoding orders cursor: " + err.Error())
		}

		sumSellPrice := 0

		for _, order := range prodOrders {
			sumSellPrice += order.Product.Price * order.Quantity
		}

		var prodImage string

		if len(product.Images) > 0 {
			prodImage = product.Images[0]
		} else {
			prodImage = ""
		}

		return &ProductSellerCard{
			Title:          product.Title,
			CategoryTitle:  prodCate.Title,
			CategoryID:     product.CategoryID,
			ProductID:      product.ID,
			Brand:          prodBrand.Title,
			State:          product.ValidationState,
			VarientCount:   len(product.Sellers[sellerIndex].SellerQuantity),
			Picture:        prodImage,
			TotalSellPrice: sumSellPrice,
			TotalSellCount: len(prodOrders),
			ViewCount:      product.VisitCount,
			SellerCart:     product.Sellers[sellerIndex],
		}, nil
	}

	// nefkrlgne
	// var prfmdsk []models.Product

	for _, prodIDInterface := range seller["productList"].([]interface{}) {

		prodID, _ := primitive.ObjectIDFromHex(prodIDInterface.(string))

		var product models.Product

		filter := bson.M{"_id": prodID}

		err := database.ProductCollection.FindOne(context.Background(), filter).Decode(&product)

		if err != nil {
			if err == mongo.ErrNoDocuments {
				errMessage := fmt.Sprintf("Inconsistency! prod id %#v in seller prod list not found", prodID)
				return c.Status(http.StatusNotFound).JSON(fiber.Map{"error": errMessage})
			}
			return c.Status(http.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
		}

		sellerID, _ := primitive.ObjectIDFromHex(seller["_id"].(string))

		prodCard, err := createProductSellerCard(product, sellerID)

		if err != nil {
			return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
				"message": "error while creating product seller card",
				"error":   err.Error(),
			})
		}

		sellerProds = append(sellerProds, *prodCard)
		// prfmdsk = append(prfmdsk, product)
		fmt.Println("prod seller card:", *prodCard)
		fmt.Println()

	}

	fmt.Println("prod cards: ", sellerProds)
	// fmt.Println("\n\nprods: ", prfmdsk)

	return c.Status(http.StatusOK).JSON(sellerProds)
}

func ChangeSellerPrice(c *fiber.Ctx) error {

	prodIDString := c.Query("prodID")

	prodID, err := primitive.ObjectIDFromHex(prodIDString)

	if err != nil {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{"error while fetching product id from query": err.Error()})
	}

	sellerIDString := c.Query("SellerID")

	sellerID, err := primitive.ObjectIDFromHex(sellerIDString)

	if err != nil {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{"error while fetching seller id from query": err.Error()})
	}

	newPriceString := c.Query("NewPrice")

	newPrice, err := strconv.Atoi(newPriceString)

	if err != nil {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{"error while fetching new price from query": err.Error()})
	}

	var product models.Product

	filter := bson.M{"_id": prodID}

	err = database.ProductCollection.FindOne(context.Background(), filter).Decode(&product)

	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
			"message": "error while fetching product from database",
			"error":   err.Error(),
		})
	}

	var sellerFound bool = false

	for index, seller := range product.Sellers {
		if seller.SellerID == sellerID {
			sellerFound = true
			if product.Sellers[index].Price == newPrice {
				return c.Status(http.StatusBadRequest).JSON(fiber.Map{"error": "new price is equal to old price"})
			}
			product.Sellers[index].Price = newPrice
			break
		}
	}

	if !sellerFound {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{"error": "Seller not found in product seller list"})
	}

	update := bson.M{"$set": bson.M{"sellers": product.Sellers}}

	_, err = database.ProductCollection.UpdateByID(context.Background(), prodID, update)

	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	return c.Status(http.StatusOK).JSON(fiber.Map{"message": "new price set succesfully"})
}

func GetProductInList(c *fiber.Ctx) error {

	queryParams := c.Queries()

	var productIDs []primitive.ObjectID
	for i := 0; ; i++ {
		key := fmt.Sprintf("ProductIDs[%d]", i)
		if value, ok := queryParams[key]; ok {
			productID, err := primitive.ObjectIDFromHex(value)
			if err != nil {
				return c.Status(http.StatusBadRequest).JSON(fiber.Map{"error while converting product id": err.Error()})
			}
			productIDs = append(productIDs, productID)
		} else {
			break
		}
	}

	var products []models.ProductCard

	for _, productID := range productIDs {

		var product models.Product

		filter := bson.M{"_id": productID}

		err := database.ProductCollection.FindOne(context.Background(), filter).Decode(&product)

		if err != nil {
			if err == mongo.ErrNoDocuments {
				errMessage := fmt.Sprintf("product id %#v not found", productID)
				return c.Status(http.StatusBadRequest).JSON(fiber.Map{"error": errMessage})
			}
			return c.Status(http.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
		}

		productCard := CreateProdCard(product)

		products = append(products, productCard)
	}

	return c.Status(http.StatusOK).JSON(products)
}
