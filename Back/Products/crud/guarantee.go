package crud

import (
	"context"
	"dg-kala-sample/database"
	"dg-kala-sample/models"
	"net/http"

	"github.com/gofiber/fiber/v2"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func AddGuarantee(c *fiber.Ctx) error {

	// token = admin ????

	var guarantee models.Guarantee

	if err := c.BodyParser(&guarantee); err != nil {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{
			"message": "invalid request body",
			"error":   err.Error(),
		})
	}

	insertResult, err := database.GuaranteeCollection.InsertOne(context.Background(), guarantee)

	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
			"message": "error while inserting guarantee",
			"error":   err.Error(),
		})
	}

	guarantee.ID = insertResult.InsertedID.(primitive.ObjectID)

	return c.Status(http.StatusCreated).JSON(guarantee)
}

func GetAllGuarantee(c *fiber.Ctx) error {

	var guaranteeList []models.Guarantee

	cursor, err := database.GuaranteeCollection.Find(context.Background(), bson.M{})

	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
			"message": "error while fetching guarantee from database",
			"error":   err.Error(),
		})
	}

	defer cursor.Close(context.Background())

	if err := cursor.All(context.Background(), &guaranteeList); err != nil {
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
			"message": "error while decoding cursor",
			"error":   err.Error(),
		})
	}

	return c.Status(http.StatusOK).JSON(guaranteeList)
}
