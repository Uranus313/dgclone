package crud

import (
	"context"
	"dg-kala-sample/database"
	"dg-kala-sample/models"

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

// func GetAllProducts(c *fiber.Ctx) error {

// 	var product_list []models.Product

// 	cursor, err := database.ProductCollection.Find(context.Background(), bson.M{})

// 	if err != nil {
// 		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{"error while fetching products from database: ": err.Error()})
// 	}

// 	defer cursor.Close(context.Background())

// 	for cursor.Next(context.Background()) {
// 		var product models.Product
// 		if err := cursor.Decode(&product); err != nil {
// 			return c.Status(http.StatusInternalServerError).JSON(fiber.Map{"error while decoding cursor": err.Error()})
// 		}
// 		product_list = append(product_list, product)
// 	}

// 	return c.Status(http.StatusOK).JSON(product_list)

// }

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

	// return last 20 comments
	filter = bson.M{
		"product_id":   prodID,
		"comment_type": 1,
	}
	comment_opts := options.Find().SetSort(bson.D{{Key: "date_sent", Value: -1}}).SetLimit(20)

	cursor, err := database.CommentCollection.Find(context.Background(), filter, comment_opts)

	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{"error while fetching product comments": err.Error()})
	}

	defer cursor.Close(context.Background())

	var prodComments []models.Comment
	for cursor.Next(context.Background()) {
		var comment models.Comment
		if err := cursor.Decode(&comment); err != nil {
			return c.Status(http.StatusInternalServerError).JSON(fiber.Map{"error while decoding cursor": err.Error()})
		}
		prodComments = append(prodComments, comment)
	}

	return c.Status(http.StatusOK).JSON(fiber.Map{
		"product":  product,
		"comments": prodComments,
	})

}

func AddProduct(c *fiber.Ctx) error {

	var product models.Product

	// token := "?????"

	if err := c.BodyParser(&product); err != nil {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{"error": "Invalid request body"})
	}

	// adding defualt guarantee for sellers
	for _, seller := range product.Sellers {

		if len(seller.Guarantees) == 0 {

			defualt_guarantee := models.Guarantee{Title: "گارانتی اصالت و سلامت فیزیکی کالا", Desc: ""}

			seller.Guarantees = append(seller.Guarantees, defualt_guarantee)
		}
	}

	product.DateAdded = time.Now()

	insertResult, err := database.ProductCollection.InsertOne(context.Background(), product)

	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
			"message": "Failed to add product",
			"error":   err.Error(),
		})
	}

	product.ID = insertResult.InsertedID.(primitive.ObjectID)

	return c.Status(http.StatusCreated).JSON(product)

}

func AddSellerToProduct(c *fiber.Ctx) error {

	// token = ????

	sellerIDString := c.Query("SellerID")

	sellerID, err := primitive.ObjectIDFromHex(sellerIDString)

	if err != nil {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{"error while fetching seller id from query": err.Error()})
	}

	// INNER USERS API => input:sellerID, output: seller_cart
	type API_Response struct {
		seller_cart models.SellerCart
		err         error
		status      int
		message     string
	}
	sample_func := func(sellerID primitive.ObjectID) API_Response {
		// function logic
		var seller_cart = models.SellerCart{SellerID: sellerID}
		return API_Response{
			seller_cart: seller_cart,
			err:         nil,
			status:      200,
			message:     "everything is fine",
		}
	}
	var api_response API_Response = sample_func(sellerID)

	if api_response.err != nil {
		return c.Status(api_response.status).JSON(fiber.Map{"error from inner user api": api_response.message})
	}

	prodIDString := c.Query("ProdID")

	prodID, err := primitive.ObjectIDFromHex(prodIDString)

	if err != nil {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{"error while fetching product id from query": err.Error()})
	}

	update := bson.M{"$push": bson.M{"sellers": api_response.seller_cart}}

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

	return c.Status(http.StatusOK).JSON(fiber.Map{"message": "seller cart added to product succesfully"})
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

	for index, seller := range product.Sellers {
		if seller.SellerID == sellerID {
			sellerFound = true
			product.Sellers[index].SellerQuantity.Quantity = quantity
		}
	}

	if !sellerFound {
		return c.Status(http.StatusNotFound).JSON(fiber.Map{"error": "seller not found"})
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
			"pros&cons":   updatable_fields.ProsNCons,
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

	/*
		valid_sort_methods = {
			1: "most visited",
			2: "least expensive",
			3: "most expensive",
			4: "recently added",
		}
	*/

	findOptions := options.Find()

	findOptions.SetLimit(int64(limit))
	findOptions.SetSkip(int64(offset))

	var filter primitive.M
	var pipeline mongo.Pipeline

	switch sortMethod {
	case 1:
		findOptions.SetSort(bson.D{{Key: "visit_count", Value: -1}})
		filter = bson.M{"category_id": cateID}
	case 2:
		pipeline = mongo.Pipeline{
			{{Key: "$match", Value: bson.D{
				{Key: "category_id", Value: cateID},
			}}},
			{{Key: "$addFields", Value: bson.D{
				{Key: "minPrice", Value: bson.D{{Key: "$min", Value: "$sellers.price"}}},
			}}},
			{{Key: "$sort", Value: bson.D{
				{Key: "minPrice", Value: 1}, // Ascending order
			}}},
		}
	case 3:
		pipeline = mongo.Pipeline{
			{{Key: "$match", Value: bson.D{
				{Key: "category_id", Value: cateID},
			}}},
			{{Key: "$addFields", Value: bson.D{
				{Key: "minPrice", Value: bson.D{{Key: "$min", Value: "$sellers.price"}}},
			}}},
			{{Key: "$sort", Value: bson.D{
				{Key: "minPrice", Value: -1}, // Descending order
			}}},
		}
	case 4:
		findOptions.SetSort(bson.D{{Key: "date_added", Value: -1}})
		filter = bson.M{"category_id": cateID}
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

	var cursor *mongo.Cursor

	if sortMethod == 1 || sortMethod == 4 {
		cursor, err = database.ProductCollection.Find(context.Background(), filter, findOptions)
	} else {
		cursor, err = database.ProductCollection.Aggregate(context.Background(), pipeline)
	}

	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{"error while fetching from database": err.Error()})
	}

	defer cursor.Close(context.Background())

	type ProductCard struct {
		ID         primitive.ObjectID
		Title      string
		Price      int
		Picture    string
		DiscountID primitive.ObjectID
	}

	var product_list []ProductCard

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
		var minPriceSellerIndex int = 0
		var minPrice int = product.Sellers[0].Price
		for index, seller := range product.Sellers {
			if seller.Price < minPrice {
				minPriceSellerIndex = index
			}
		}
		var productCard = ProductCard{
			ID:         product.ID,
			Title:      product.Title,
			Price:      product.Sellers[minPriceSellerIndex].Price,
			Picture:    product.Images[0],
			DiscountID: product.Sellers[minPriceSellerIndex].DiscountID,
		}

		product_list = append(product_list, productCard)
	}

	return c.Status(http.StatusOK).JSON(product_list)
}

// Get => incredible products

// ----------done------------
// Patch => Add seller to product
// Patch => update rating
// Patch => update quantity
// Delete => delete product by id
// Patch => edit product -> title, desc, images, details, dimentions, weight, pros&cons
// Get => most disscount products
// Get => Infinite scroll products -> query params = limit, offset, categoryID
