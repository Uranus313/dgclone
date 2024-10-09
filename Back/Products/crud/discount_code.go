package crud

import (
	"context"
	"dg-kala-sample/database"
	"dg-kala-sample/models"
	"errors"
	"net/http"
	"strings"

	"github.com/gofiber/fiber/v2"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

func AddDiscountCode(c *fiber.Ctx) error {

	// token = ??????

	var lowercaseChars = []rune{'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'z', 'x', 'c', 'v', 'b', 'n', 'm'}
	var uppercaseChars = []rune{'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Z', 'X', 'C', 'V', 'B', 'N', 'M'}
	var numbers = []rune{'1', '2', '3', '4', '5', '6', '7', '8', '9', '0'}
	var symbols = []rune{'!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '_', '-', '=', '+', '[', ']', '{', '}', ';', ':', '/', '?', '<', '>', ',', '.', '~', '|', '\\'}

	var containsLowercase bool = false
	var containsUppercase bool = false
	var containsNumber bool = false
	var containsSymbol bool = false

	var discountCode models.DiscountCode

	if err := c.BodyParser(&discountCode); err != nil {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{"error": "Invalid request body"})
	}

	if len(discountCode.Code) != 8 {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{"error": "discount code must be 8 chars long"})
	}

	for _, char := range lowercaseChars {
		if strings.ContainsRune(discountCode.Code, char) {
			containsLowercase = true
			break
		}
	}
	for _, char := range uppercaseChars {
		if strings.ContainsRune(discountCode.Code, char) {
			containsUppercase = true
			break
		}
	}
	for _, char := range numbers {
		if strings.ContainsRune(discountCode.Code, char) {
			containsNumber = true
			break
		}
	}
	for _, char := range symbols {
		if strings.ContainsRune(discountCode.Code, char) {
			containsSymbol = true
			break
		}
	}

	if !containsLowercase || !containsUppercase || !containsNumber {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{"error": "discount code must contain lowercase, uppercase and numbers"})
	}

	if containsSymbol {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{"error": "discount code can not contain symbols"})
	}

	insertResult, err := database.DiscountCodeCollection.InsertOne(context.Background(), discountCode)

	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
			"message": "Failed to add discountCode",
			"error":   err.Error(),
		})
	}

	discountCode.ID = insertResult.InsertedID.(primitive.ObjectID)

	return c.Status(http.StatusCreated).JSON(discountCode)
}

func CheckUserDiscountCode(c *fiber.Ctx) error {

	DCode := c.Query("DCode")

	userIDString := c.Query("UserID")

	userID, err := primitive.ObjectIDFromHex(userIDString)

	if err != nil {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{"error while fetching user id from query": err.Error()})
	}

	var discount_code models.DiscountCode

	filter := bson.M{"code": DCode}

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
			// discount_code.DiscountUsers[i].Is_used = true
			break
		}
	}

	if !userfound {
		return c.Status(http.StatusBadRequest).SendString("user id not found")
	}

	// update := bson.M{"$set": discount_code}

	// updateResult, err := database.DiscountCodeCollection.UpdateOne(context.TODO(), filter, update)

	// if err != nil {
	// 	return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
	// 		"message": "error while updating discount code module",
	// 		"error":   err.Error(),
	// 	})
	// }

	// if updateResult.MatchedCount == 0 {
	// 	return c.Status(fiber.StatusNotFound).SendString("No document found with the given ID")
	// }

	// if updateResult.ModifiedCount == 0 {
	// 	return c.Status(http.StatusExpectationFailed).SendString("discount code was not modified as expected")
	// }

	return c.Status(http.StatusOK).JSON(discount_code)
}

func UpdateUserDiscountCode(DCode string, userID primitive.ObjectID) (int, int, error) {

	// DCode := c.Query("DCode")

	// userIDString := c.Query("UserID")

	// userID, err := primitive.ObjectIDFromHex(userIDString)

	// if err != nil {
	// 	return c.Status(http.StatusBadRequest).JSON(fiber.Map{"error while fetching user id from query": err.Error()})
	// }

	var discount_code models.DiscountCode

	filter := bson.M{"code": DCode}

	err := database.DiscountCodeCollection.FindOne(context.Background(), filter).Decode(&discount_code)

	if err != nil {
		if err == mongo.ErrNoDocuments {
			// return c.Status(http.StatusNotFound).JSON(fiber.Map{"error": "discount code not found"})
			return 0, http.StatusNotFound, errors.New("discount code not found")
		}
		// return c.Status(http.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
		return 0, http.StatusInternalServerError, err
	}

	var userfound bool = false

	for i, discountUser := range discount_code.DiscountUsers {

		if discountUser.UserID == userID {
			userfound = true
			if discount_code.DiscountUsers[i].Is_used {
				// return 0, c.Status(http.StatusBadRequest).JSON(fiber.Map{"error": "user already used their discount code"})
				return 0, http.StatusBadRequest, errors.New("user already used their discount code")
			}
			discount_code.DiscountUsers[i].Is_used = true
			break
		}
	}

	if !userfound {
		// return 0, c.Status(http.StatusBadRequest).SendString("user id not found")
		return 0, http.StatusBadRequest, errors.New("user id not found")
	}

	update := bson.M{"$set": discount_code}

	updateResult, err := database.DiscountCodeCollection.UpdateOne(context.TODO(), filter, update)

	if err != nil {
		// return 0, c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
		// 	"message": "error while updating discount code module",
		// 	"error":   err.Error(),
		// })
		return 0, http.StatusInternalServerError, err
	}

	if updateResult.MatchedCount == 0 {
		// return 0, c.Status(fiber.StatusNotFound).SendString("No document found with the given ID")
		return 0, http.StatusNotFound, errors.New("no document found with the given ID")
	}

	if updateResult.ModifiedCount == 0 {
		// return 0, c.Status(http.StatusExpectationFailed).SendString("discount code was not modified as expected")
		return 0, http.StatusExpectationFailed, errors.New("discount code was not modified as expected")
	}

	// return 0, c.Status(http.StatusOK).JSON(fiber.Map{
	// 	"message":       "discount code user updated succesfully",
	// 	"discount_code": discount_code,
	// })
	return discount_code.Value, http.StatusOK, nil
}
