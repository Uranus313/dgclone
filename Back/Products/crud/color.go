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

func AddColor(c *fiber.Ctx) error {

	// token = admin ????

	var color models.Color

	if err := c.BodyParser(&color); err != nil {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{
			"message": "invalid request body",
			"error":   err.Error(),
		})
	}

	insertResult, err := database.ColorCollection.InsertOne(context.Background(), color)

	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
			"message": "error while inserting color",
			"error":   err.Error(),
		})
	}

	color.ID = insertResult.InsertedID.(primitive.ObjectID)

	return c.Status(http.StatusCreated).JSON(color)
}

func GetAllColors(c *fiber.Ctx) error {

	var colorList []models.Color

	cursor, err := database.ColorCollection.Find(context.Background(), bson.M{})

	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
			"message": "error while fetching colors from database",
			"error":   err.Error(),
		})
	}

	defer cursor.Close(context.Background())

	if err := cursor.All(context.Background(), &colorList); err != nil {
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
			"message": "error while decoding cursor",
			"error":   err.Error(),
		})
	}

	return c.Status(http.StatusOK).JSON(colorList)
}
