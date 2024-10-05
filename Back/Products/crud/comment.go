package crud

import (
	"context"
	"dg-kala-sample/database"
	"dg-kala-sample/models"
	"net/http"
	"strconv"
	"time"

	"github.com/gofiber/fiber/v2"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func GetCommentsByProductID(c *fiber.Ctx) error {

	limitString := c.Query("limit", "10")

	limit, err := strconv.Atoi(limitString)

	if err != nil {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{"error while fetching limit from query": err.Error()})
	}

	offsetString := c.Query("offset", "0")

	offset, err := strconv.Atoi(offsetString)

	if err != nil {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{"error while fetching offset from query": err.Error()})
	}

	prodIDString := c.Query("ProdID")

	prodID, err := primitive.ObjectIDFromHex(prodIDString)

	if err != nil {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{"error while fetching prod id from params": err.Error()})
	}

	findOptions := options.Find()

	findOptions.SetSort(bson.D{{Key: "date_sent", Value: -1}})
	findOptions.SetLimit(int64(limit))
	findOptions.SetSkip(int64(offset))

	filter := bson.M{
		"product_id":       prodID,
		"comment_type":     models.RegularComment,
		"validation_state": models.Validated,
	}

	cursor, errr := database.CommentCollection.Find(context.Background(), filter, findOptions)

	if errr != nil {
		// if errr == mongo.ErrNoDocuments {
		// 	return c.Status(http.StatusNotFound).JSON(fiber.Map{"error": "product not found"})
		// }
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{"error": errr.Error()})
	}

	defer cursor.Close(context.Background())

	// var ProdComments []models.Comment

	type Response struct {
		Comment    models.Comment
		Score      int
		HasOrdered bool
	}

	var Responses []Response

	for cursor.Next(context.Background()) {
		var comment models.Comment
		if err := cursor.Decode(&comment); err != nil {
			return c.Status(http.StatusInternalServerError).JSON(fiber.Map{"error while decoding cursor": err.Error()})
		}
		// ProdComments = append(ProdComments, comment)
		var commentScore int = 0

		for _, likeOrDislike := range comment.LikesAndDisslikes {
			if likeOrDislike.Liked {
				commentScore++
			} else {
				commentScore--
			}
		}

		var hasOrdered bool

		if comment.OrderID.IsZero() {
			hasOrdered = false
		} else {
			hasOrdered = true
		}

		var response = Response{
			Comment:    comment,
			Score:      commentScore,
			HasOrdered: hasOrdered,
		}

		Responses = append(Responses, response)
	}

	var hasMore bool = false

	if len(Responses) == limit {

		findOptions.SetSkip(int64(limit) + int64(offset)).SetLimit(1)
		var nextDocs []models.Comment
		nextDocsCursor, err := database.CommentCollection.Find(context.Background(), filter, findOptions)

		if err != nil {
			return c.Status(http.StatusInternalServerError).JSON(fiber.Map{"error while fetching comments from database: ": err.Error()})
		}

		defer nextDocsCursor.Close(context.Background())

		if err := nextDocsCursor.All(context.Background(), &nextDocs); err != nil {
			return c.Status(http.StatusInternalServerError).JSON(fiber.Map{"error while decoding next doc cursor": err.Error()})
		}

		if len(nextDocs) > 0 {
			hasMore = true
		}

	}

	return c.Status(http.StatusOK).JSON(fiber.Map{
		"comments": Responses,
		"hasMore":  hasMore,
	})
}

func PostComment(c *fiber.Ctx) error {

	// token := "?????"

	var comment models.Comment

	if err := c.BodyParser(&comment); err != nil {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{"error": "Invalid request body"})
	}

	if comment.CommentType.String() != "Comment" {
		if comment.OrderID != primitive.NilObjectID {
			return c.Status(http.StatusConflict).JSON(fiber.Map{"error: ": "non regular comments do not contain an order id field"})
		}
	}

	if comment.CommentType.String() != "Answer" {
		if comment.AnswersTo != primitive.NilObjectID {
			return c.Status(http.StatusConflict).JSON(fiber.Map{"error: ": "non answer comments do not contain an answer to field"})
		}
	}

	if !comment.OrderID.IsZero() {
		var order models.Order
		filter := bson.M{"_id": comment.OrderID}
		err := database.OrderCollection.FindOne(context.Background(), filter).Decode(&order)
		if err != nil {
			if err == mongo.ErrNoDocuments {
				return c.Status(http.StatusForbidden).JSON(fiber.Map{"error": "Invalid Order ID, Order Not Found"})
			}
			return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
				"message": "something went wrong while fetching data from orders collection",
				"error":   err.Error(),
			})
		}
		if order.UserID != comment.UserID {
			return c.Status(http.StatusBadRequest).JSON(fiber.Map{"error": "Inconsisteny! the provided user id does not match the user id in the submited order"})
		}
		if order.Product.ProdID != comment.ProductID {
			return c.Status(http.StatusBadRequest).JSON(fiber.Map{"error": "Inconsisteny! the provided product id does not match the product id in the submited order"})
		}
	}

	var prod models.Product

	filter := bson.M{"_id": comment.ProductID}

	err := database.ProductCollection.FindOne(context.Background(), filter).Decode(&prod)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return c.Status(http.StatusBadRequest).JSON(fiber.Map{"error": "Invalid Prod ID, Product Not Found"})
		}
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
			"message": "something went wrong while fetching data from product collection",
			"error":   err.Error(),
		})
	}

	if len(comment.LikesAndDisslikes) > 0 {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{"error": "the new comment does not have any likes or disslikes"})
	}

	// Inner API => takes userID as input and returns a bool showcasing wether the user exists or not
	// smaple_func := func(userID primitive.ObjectID) bool {
	// 	return userID.IsZero()
	// }
	// var userExist bool = smaple_func(comment.UserID)
	_, statusCode, err := InnerRequest(GET, "/url/"+comment.UserID.String())

	if err != nil {
		return c.Status(statusCode).JSON(fiber.Map{
			"message": "Problem With User ID",
			"error":   err.Error(),
		})
	}

	comment.DateSent = time.Now()
	comment.ValidationState = models.PendingValidation

	insertResult, err := database.CommentCollection.InsertOne(context.Background(), comment)

	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
			"message": "something went wrong while adding comment to collection",
			"error":   err.Error(),
		})
	}

	comment.ID = insertResult.InsertedID.(primitive.ObjectID)

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

func GetProductQuestions(c *fiber.Ctx) error {

	limitString := c.Query("limit", "10")

	limit, err := strconv.Atoi(limitString)

	if err != nil {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{"error while fetching limit from query": err.Error()})
	}

	offsetString := c.Query("offset", "0")

	offset, err := strconv.Atoi(offsetString)

	if err != nil {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{"error while fetching offset from query": err.Error()})
	}

	prodIDString := c.Query("ProdID")

	prodID, err := primitive.ObjectIDFromHex(prodIDString)

	if err != nil {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{"error while fetching prod id from params": err.Error()})
	}

	findOptions := options.Find()

	findOptions.SetSort(bson.D{{Key: "date_sent", Value: -1}})
	findOptions.SetLimit(int64(limit))
	findOptions.SetSkip(int64(offset))

	filter := bson.M{
		"product_id":       prodID,
		"comment_type":     3,
		"validation_state": 2,
	}

	cursor, errr := database.CommentCollection.Find(context.Background(), filter, findOptions)

	if errr != nil {
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{"error": errr.Error()})
	}

	defer cursor.Close(context.Background())

	type Response struct {
		Question models.Comment
		Answers  []models.Comment
	}

	var Responses []Response

	for cursor.Next(context.Background()) {

		var question models.Comment

		if err := cursor.Decode(&question); err != nil {
			return c.Status(http.StatusInternalServerError).JSON(fiber.Map{"error while decoding cursor": err.Error()})
		}

		var answer_list []models.Comment

		answerFindOpts := options.Find().SetSort(bson.D{{Key: "date_sent", Value: -1}})

		filter = bson.M{
			"comment_type":     2,
			"answers_to":       question.ID,
			"validation_state": 2,
		}

		answer_cursor, err := database.CommentCollection.Find(context.Background(), filter, answerFindOpts)

		if err != nil {
			return c.Status(http.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
		}

		defer answer_cursor.Close(context.Background())

		if err := cursor.All(context.Background(), &answer_list); err != nil {
			return c.Status(http.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
		}

		var response = Response{
			Question: question,
			Answers:  answer_list,
		}

		Responses = append(Responses, response)
	}

	var hasMore bool = false

	if len(Responses) == limit {

		findOptions.SetSkip(int64(limit) + int64(offset)).SetLimit(1)
		var nextDocs []models.Comment
		nextDocsCursor, err := database.CommentCollection.Find(context.Background(), filter, findOptions)

		if err != nil {
			return c.Status(http.StatusInternalServerError).JSON(fiber.Map{"error while fetching questions from database: ": err.Error()})
		}

		defer nextDocsCursor.Close(context.Background())

		if err := nextDocsCursor.All(context.Background(), &nextDocs); err != nil {
			return c.Status(http.StatusInternalServerError).JSON(fiber.Map{"error while decoding next doc cursor": err.Error()})
		}

		if len(nextDocs) > 0 {
			hasMore = true
		}

	}

	return c.Status(http.StatusOK).JSON(fiber.Map{
		"comments": Responses,
		"hasMore":  hasMore,
	})
}

func GetPendingComments(c *fiber.Ctx) error {

	// token = admin ???

	limitString := c.Query("limit", "10")

	limit, err := strconv.Atoi(limitString)

	if err != nil {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{"error while fetching limit from query": err.Error()})
	}

	offsetString := c.Query("offset", "0")

	offset, err := strconv.Atoi(offsetString)

	if err != nil {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{"error while fetching offset from query": err.Error()})
	}

	var pendingComments []models.Comment

	findOpts := options.Find()

	findOpts.SetLimit(int64(limit))
	findOpts.SetSkip(int64(offset))

	filter := bson.M{"validation_state": 1}

	cursor, err := database.CommentCollection.Find(context.Background(), filter, findOpts)

	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
			"message": "something went wrong while fetching pending comments",
			"error":   err.Error(),
		})
	}

	defer cursor.Close(context.Background())

	if err := cursor.All(context.Background(), &pendingComments); err != nil {
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
			"message": "error while deconding cursor",
			"error":   err.Error(),
		})
	}

	var hasMore bool = false

	if len(pendingComments) == limit {

		findOpts.SetSkip(int64(limit) + int64(offset)).SetLimit(1)
		var nextDocs []models.Comment
		nextDocsCursor, err := database.CommentCollection.Find(context.Background(), filter, findOpts)

		if err != nil {
			return c.Status(http.StatusInternalServerError).JSON(fiber.Map{"error while fetching comments from database: ": err.Error()})
		}

		defer nextDocsCursor.Close(context.Background())

		if err := nextDocsCursor.All(context.Background(), &nextDocs); err != nil {
			return c.Status(http.StatusInternalServerError).JSON(fiber.Map{"error while decoding next doc cursor": err.Error()})
		}

		if len(nextDocs) > 0 {
			hasMore = true
		}
	}

	return c.Status(http.StatusOK).JSON(fiber.Map{
		"pendingComments": pendingComments,
		"hasMore":         hasMore,
	})
}

func UpdateCommentValidationState(c *fiber.Ctx) error {

	commentIDString := c.Query("CommentID")

	commentID, err := primitive.ObjectIDFromHex(commentIDString)

	if err != nil {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{
			"message": "error while fetching comment id from params",
			"error":   err.Error(),
		})
	}

	validationStateString := c.Query("ValidationState")

	validationState, err := strconv.Atoi(validationStateString)

	if err != nil {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{
			"message": "error while fetching validation state from query",
			"error":   err.Error(),
		})
	}

	if validationState != 2 && validationState != 3 {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{
			"error": "invalid validation state",
			"valid requests": fiber.Map{
				"2": "Validated",
				"3": "Banned",
			},
		})
	}

	update := bson.M{"$set": bson.M{"validation_state": validationState}}

	updateResult, err := database.CommentCollection.UpdateByID(context.Background(), commentID, update)

	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
			"message": "error while updating comment",
			"error":   err.Error(),
		})
	}

	if updateResult.MatchedCount == 0 {
		return c.Status(http.StatusNotFound).JSON(fiber.Map{"error": "comment not found"})
	}

	if updateResult.ModifiedCount == 0 {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{"error": "comment was not modified"})
	}

	return c.Status(http.StatusOK).JSON(fiber.Map{"message": "comment validation state updated succesfully"})
}
