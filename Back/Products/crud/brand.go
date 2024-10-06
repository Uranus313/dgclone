package crud

import (
	"context"
	// "dg-kala-sample/auth"
	"dg-kala-sample/database"
	"dg-kala-sample/models"
	"net/http"

	"github.com/gofiber/fiber/v2"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

func AddBrand(c *fiber.Ctx) error {

	// token = admin ???

	// token := c.Cookies("x-auth-token")

	// ent,err,isErrInternal := auth.AuthenticateToken(token)

	// if err != nil {
	// 	if isErrInternal {
	// 		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{"error":err.Error()})
	// 	}
	// 	return c.Status(http.StatusUnauthorized).JSON(fiber.Map{"error":err.Error()})
	// }

	// if ent.status == "admin" {}

	var brand models.Brand

	if err := c.BodyParser(&brand); err != nil {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{"error": "Invalid request body"})
	}

	insertResult, err := database.BrandCollection.InsertOne(context.Background(), brand)

	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to add brand"})
	}

	brand.ID = insertResult.InsertedID.(primitive.ObjectID)

	return c.Status(http.StatusCreated).JSON(brand)
}

func GetBrandByID(c *fiber.Ctx) error {

	var brand models.Brand

	brandIDString := c.Params("BrandID")

	brandID, err := primitive.ObjectIDFromHex(brandIDString)

	if err != nil {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{"error while fetching brand id from params": err.Error()})
	}

	filter := bson.M{"_id": brandID}

	err = database.BrandCollection.FindOne(context.Background(), filter).Decode(&brand)

	if err != nil {
		if err == mongo.ErrNoDocuments {
			return c.Status(http.StatusNotFound).JSON(fiber.Map{"error": "brand not found"})
		}
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	return c.Status(http.StatusOK).JSON(brand)
}

func DeleteBrandByID(c *fiber.Ctx) error {

	// token = admin ???

	brandIDString := c.Params("BrandID")

	brandID, err := primitive.ObjectIDFromHex(brandIDString)

	if err != nil {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{"error while fetching brand id from params": err.Error()})
	}

	filter := bson.M{"_id": brandID}

	deleteResult, err := database.BrandCollection.DeleteOne(context.Background(), filter)

	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{"error while deleting brand": err.Error()})
	}

	if deleteResult.DeletedCount == 0 {
		return c.Status(http.StatusNotFound).JSON(fiber.Map{"error": "brand not found"})
	}

	return c.Status(http.StatusOK).JSON(fiber.Map{"message": "brand deleted sussefully"})
}

func GetAllBrands(c *fiber.Ctx) error {

	var allBrands []models.Brand

	cursor, err := database.BrandCollection.Find(context.Background(), bson.M{})

	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{"error while fetching brands from database: ": err.Error()})
	}

	defer cursor.Close(context.Background())

	if err := cursor.All(context.Background(), &allBrands); err != nil {
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{"error while decoding cursor": err.Error()})
	}

	return c.Status(http.StatusOK).JSON(allBrands)
}
