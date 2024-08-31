package crud

import (
	"context"
	"dg-kala-sample/database"
	"dg-kala-sample/models"
	"fmt"
	"net/http"
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

	return c.Status(http.StatusOK).JSON(product)

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

	insertResult, err := database.ProductCollection.InsertOne(context.Background(), product)

	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to add product"})
	}

	product.ID = insertResult.InsertedID.(primitive.ObjectID)

	return c.Status(http.StatusCreated).JSON(product)

}

// Patch => Add seller to product

// Get => Infinite scroll products -> query params = limit, offset, categoryID

// Get => incredible products

// Get => most disscount products

// Delete => delete product by id

// Patch => update rating

// Patch => update quantity

// Patch => edit product -> title, desc, images, details, dimentions, weight, pros&cons

/*  INNER:

- takes an object from input => map[productID]null
and assigns the product object in front of its keys and returns it


*/

func InnerProductMapAssign(c *fiber.Ctx) error {

	var productsMap = make(map[string]*models.Product) // map[primitive.ObjectID]*models.Product

	if err := c.BodyParser(&productsMap); err != nil {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{"error": "Invalid request body"})
	}

	for key := range productsMap {

		var product models.Product

		prodID, err := primitive.ObjectIDFromHex(key)

		if err != nil {
			return c.Status(http.StatusBadRequest).JSON(fiber.Map{"error while fetching prod id from params": err.Error()})
		}

		filter := bson.M{"_id": prodID}

		err = database.ProductCollection.FindOne(context.Background(), filter).Decode(&product)

		if err != nil {

			err_text := fmt.Sprintf("error happend while fetching object %v from database", key)

			return c.Status(http.StatusInternalServerError).JSON(fiber.Map{"error": err_text})
		}

		productsMap[key] = &product
	}

	return c.Status(http.StatusOK).JSON(productsMap)

}
