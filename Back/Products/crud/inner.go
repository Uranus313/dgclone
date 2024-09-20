package crud

import (
	"context"
	"dg-kala-sample/database"
	"dg-kala-sample/models"
	"fmt"
	"net/http"

	"github.com/gofiber/fiber/v2"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func InnerProductMapAssign(c *fiber.Ctx) error {

	/* Product Inner:

	- takes an object from input => map[productID]null
	and assigns the product object in front of its keys and returns it

	*/

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
