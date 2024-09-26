package crud

import (
	"context"
	"dg-kala-sample/database"
	"dg-kala-sample/models"
	"fmt"
	"net/http"

	// "time"

	"github.com/gofiber/fiber/v2"
	// "go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	// "go.mongodb.org/mongo-driver/mongo/options"
)

func AddOrder(c *fiber.Ctx) error {

	// token := "????"

	var order models.Order

	if err := c.BodyParser(&order); err != nil {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{"error": "Invalid request body"})
	}

	order.State = models.Pending

	insertResult, err := database.OrderCollection.InsertOne(context.Background(), order)

	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to add order"})
	}

	order.ID = insertResult.InsertedID.(primitive.ObjectID)

	return c.Status(http.StatusCreated).JSON(order)

}

func GetOrdersInOrdersHistory(c *fiber.Ctx) error {

	// token := "????"

	var orderHistory models.OrderHistory

	orderHistoryIdString := c.Params("OHID")

	orderHistoryId, err := primitive.ObjectIDFromHex(orderHistoryIdString)

	if err != nil {
		c.Status(http.StatusBadRequest).JSON(fiber.Map{"error while fetching order history id from params": err.Error()})
	}

	filter := bson.M{"_id": orderHistoryId}

	errr := database.OrderCollection.FindOne(context.Background(), filter).Decode(&orderHistory)

	if errr != nil {
		if err == mongo.ErrNoDocuments {
			return c.Status(http.StatusNotFound).JSON(fiber.Map{"error": "order history not found"})
		}
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	var orderList []models.Order

	for _, orderid := range orderHistory.OrdersList {

		var order models.Order

		filter = bson.M{"_id": orderid}

		err2 := database.OrderCollection.FindOne(context.Background(), filter).Decode(&order)

		if err2 != nil {
			if err == mongo.ErrNoDocuments {
				err_text := fmt.Sprintf("problem with id %v", orderid)
				return c.Status(http.StatusNotFound).JSON(fiber.Map{err_text: "order not found"})
			}
			return c.Status(http.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
		}

		orderList = append(orderList, order)

	}

	return c.Status(http.StatusOK).JSON(orderList)

}
