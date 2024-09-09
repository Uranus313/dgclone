package crud

import (
	"context"
	"dg-kala-sample/database"
	"dg-kala-sample/models"
	"net/http"

	"github.com/gofiber/fiber/v2"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

func AddDiscountCode(c *fiber.Ctx) error {

	// token = ??????

	var discountCode models.DiscountCode

	if err := c.BodyParser(&discountCode); err != nil {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{"error": "Invalid request body"})
	}

	insertResult, err := database.DiscountCodeCollection.InsertOne(context.Background(), discountCode)

	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to add discountCode"})
	}

	discountCode.ID = insertResult.InsertedID.(primitive.ObjectID)

	return c.Status(http.StatusCreated).JSON(discountCode)
}

func UpdateUserDiscountCode(c *fiber.Ctx) error {

	DCodeIDString := c.Query("DCodeID")

	DCodeID, err := primitive.ObjectIDFromHex(DCodeIDString)

	if err != nil {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{"error while fetching Discount Code id from query": err.Error()})
	}

	userIDString := c.Query("UserID")

	userID, err := primitive.ObjectIDFromHex(userIDString)

	if err != nil {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{"error while fetching user id from query": err.Error()})
	}

	var discount_code models.DiscountCode

	filter := bson.M{"_id": DCodeID}

	err = database.DiscountCodeCollection.FindOne(context.Background(), filter).Decode(&discount_code)

	if err != nil {
		if err == mongo.ErrNoDocuments {
			return c.Status(http.StatusNotFound).JSON(fiber.Map{"error": "discount code not found"})
		}
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	var userfound bool = false

	for i, discountUser := range discount_code.DiscountUsers {

		if discountUser.UserID == userID {
			userfound = true
			if discount_code.DiscountUsers[i].Is_used {
				return c.Status(http.StatusBadRequest).JSON(fiber.Map{"error": "user already used their discount code"})
			}
			discount_code.DiscountUsers[i].Is_used = true
			break
		}
	}

	if !userfound {
		return c.Status(http.StatusBadRequest).SendString("user id not found")
	}

	update := bson.M{"$set": discount_code}

	updateResult, err := database.DiscountCodeCollection.UpdateOne(context.TODO(), filter, update)

	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error while updating discount code module": err.Error()})
	}

	if updateResult.MatchedCount == 0 {
		return c.Status(fiber.StatusNotFound).SendString("No document found with the given ID")
	}

	if updateResult.ModifiedCount == 0 {
		return c.Status(http.StatusExpectationFailed).SendString("discount code was not modified as expected")
	}

	return c.Status(http.StatusOK).SendString("discount code user updated succesfully")
}
