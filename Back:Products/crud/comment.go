package crud

import (
	"context"
	"dg-kala-sample/database"
	"dg-kala-sample/models"
	"net/http"
	"time"

	"github.com/gofiber/fiber/v2"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

func GetCommentsByProductID(c *fiber.Ctx) error {

	var ProdComments []models.Comment

	prodIDString := c.Params("ProdID")

	prodID, err := primitive.ObjectIDFromHex(prodIDString)

	if err != nil {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{"error while fetching prod id from params": err.Error()})
	}

	filter := bson.M{"product_id": prodID}

	cursor, errr := database.CommentCollection.Find(context.Background(), filter)

	if errr != nil {
		if errr == mongo.ErrNoDocuments {
			return c.Status(http.StatusNotFound).JSON(fiber.Map{"error": "product not found"})
		}
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{"error": errr.Error()})
	}

	defer cursor.Close(context.Background())

	for cursor.Next(context.Background()) {
		var comment models.Comment
		if err := cursor.Decode(&comment); err != nil {
			return c.Status(http.StatusInternalServerError).JSON(fiber.Map{"error while decoding cursor": err.Error()})
		}
		ProdComments = append(ProdComments, comment)
	}

	return c.Status(http.StatusOK).JSON(ProdComments)
}

func PostComment(c *fiber.Ctx) error {

	var comment models.Comment

	// token := "?????"

	if err := c.BodyParser(&comment); err != nil {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{"error": "Invalid request body"})
	}

	if comment.CommentType.String() != "Comment" {
		// if len(comment.Pictures) > 0 {
		// 	return c.Status(http.StatusConflict).JSON(fiber.Map{"error: ": "non regular comments can not have pictures"})
		// }
		// if len(comment.Videos) > 0 {
		// 	return c.Status(http.StatusConflict).JSON(fiber.Map{"error: ": "non regular comments can not have videos"})
		// }
		if comment.OrderID != primitive.NilObjectID {
			return c.Status(http.StatusConflict).JSON(fiber.Map{"error: ": "non regular comments do not contain an order id field"})
		}
	}

	if comment.CommentType.String() != "Answer" {
		if comment.AnswersTo != primitive.NilObjectID {
			return c.Status(http.StatusConflict).JSON(fiber.Map{"error: ": "non answer comments do not contain an answer to field"})
		}
	}

	comment.DateSent = time.Now()

	return c.Status(http.StatusCreated).JSON(comment)
}

func UpdateCommentScore(c *fiber.Ctx) error {

	// token := "????"

	var likeOrDisslike models.LikeOrDisslike

	if err := c.BodyParser(&likeOrDisslike); err != nil {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{"error": "Invalid request body: " + err.Error()})
	}

	// likeOrDisslike.UserID = token.UserID

	commentIDString := c.Params("CommentID")

	commentID, err := primitive.ObjectIDFromHex(commentIDString)

	if err != nil {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{"error while fetching comment id from params": err.Error()})
	}

	filter := bson.M{"_id": commentID}
	update := bson.M{"$push": bson.M{"likes&disslikes": likeOrDisslike}}

	updateResult, err := database.CommentCollection.UpdateOne(context.Background(), filter, update)

	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to update comment"})
	}

	if updateResult.MatchedCount == 0 {
		return c.Status(http.StatusNotFound).JSON(fiber.Map{"error": "Comment not found"})
	}

	if updateResult.ModifiedCount == 0 {
		return c.Status(http.StatusExpectationFailed).JSON(fiber.Map{"error": "Comment was not modified"})
	}

	return c.Status(http.StatusOK).JSON(fiber.Map{"message": "Successfully added like/dislike"})
}
