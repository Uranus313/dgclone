package crud

import (
	"context"
	"dg-kala-sample/database"
	"dg-kala-sample/models"
	"errors"
	"fmt"
	"net/http"

	"github.com/gofiber/fiber/v2"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

func AddCategory(c *fiber.Ctx) error {

	// token := "?????" admin

	var category models.Category

	if err := c.BodyParser(&category); err != nil {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{"error": "Invalid request body"})
	}

	// if len(category.Childs) > 0 {
	// 	return c.Status(http.StatusBadRequest).JSON(fiber.Map{"error": "the new category can not contain children"})
	// }
	if category.Title == "" {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{"error": "category title can not be empty"})
	}
	category.Childs = []primitive.ObjectID{}

	insertResult, err := database.CategoryCollection.InsertOne(context.Background(), category)

	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
			"message": "Failed to add category",
			"error":   err.Error(),
		})
	}

	category.ID = insertResult.InsertedID.(primitive.ObjectID)

	if category.ParentID != primitive.NilObjectID {
		// filter := bson.M{"_id":category.ParentID}
		update := bson.M{"$push": bson.M{"childs": category.ID}}

		updateResult, err := database.CategoryCollection.UpdateByID(context.Background(), category.ParentID, update)

		if err != nil {
			filter := bson.M{"_id": category.ID}
			_, err = database.CategoryCollection.DeleteOne(context.Background(), filter)

			if err != nil {
				return c.Status(http.StatusInternalServerError).JSON(fiber.Map{"error": "failed to update parent cateory and also failed to delete the inserted category (shit is bad), C1"})
			}

			return c.Status(http.StatusInternalServerError).JSON(fiber.Map{"error": "failed to update parent category"})
		}

		if updateResult.MatchedCount == 0 {
			filter := bson.M{"_id": category.ID}
			_, err = database.CategoryCollection.DeleteOne(context.Background(), filter)

			if err != nil {
				return c.Status(http.StatusInternalServerError).JSON(fiber.Map{"error": "failed to update parent cateory and also failed to delete the inserted category (shit is bad), C2"})
			}

			return c.Status(http.StatusBadRequest).JSON(fiber.Map{"error": "Invalid ParentID, Parent Category Not Found"})
		}

		if updateResult.ModifiedCount == 0 {
			filter := bson.M{"_id": category.ID}
			_, err = database.CategoryCollection.DeleteOne(context.Background(), filter)

			if err != nil {
				return c.Status(http.StatusInternalServerError).JSON(fiber.Map{"error": "failed to update parent cateory and also failed to delete the inserted category (shit is bad), C3"})
			}

			return c.Status(http.StatusExpectationFailed).JSON(fiber.Map{"error": "Parent Category was not Updated as Expected"})
		}
	}

	return c.Status(http.StatusCreated).JSON(category)
}

type modifiedCategory struct {
	ID                  primitive.ObjectID
	Title               string
	ParentID            primitive.ObjectID
	Childs              []*modifiedCategory
	Detail              []models.Detail
	Pictures            []string
	Description         string
	Link                string
	Theme               string
	CommisionPercentage int
}

func modifyCategory(cat models.Category) *modifiedCategory {
	return &modifiedCategory{
		ID:                  cat.ID,
		Title:               cat.Title,
		ParentID:            cat.ParentID,
		Childs:              []*modifiedCategory{}, // Initialize as an empty slice
		Detail:              cat.Detail,
		Pictures:            cat.Pictures,
		Description:         cat.Description,
		Link:                cat.Link,
		Theme:               cat.Theme,
		CommisionPercentage: cat.CommisionPercentage,
	}
}

func treefy(category_list []models.Category, modifiedCategories *[]*modifiedCategory) error {

	for _, category := range category_list {

		var CateChilds []models.Category
		var modCate *modifiedCategory = modifyCategory(category)

		// var modChildren []modifiedCategory

		*modifiedCategories = append(*modifiedCategories, modCate)

		for _, childID := range category.Childs {

			var child models.Category
			filter := bson.M{"_id": childID}

			err := database.CategoryCollection.FindOne(context.Background(), filter).Decode(&child)

			if err != nil {
				err_text := fmt.Sprintf("error while decoding category %v from mongo: %v", childID, err.Error())
				// return c.Status(http.StatusInternalServerError).JSON(fiber.Map{"error":err_text})
				return errors.New(err_text)
			}

			CateChilds = append(CateChilds, child)
			// modChildren = append(modChildren, modifyCategory(child))
		}
		// category.Childs = nil
		// category.Childs = append(category.Childs, CateChilds...)
		// modCate.Childs = append(modCate.Childs, modChildren...)

		err := treefy(CateChilds, &modCate.Childs)

		if err != nil {
			return err
		}

	}

	return nil
}

func GetAllCategories(c *fiber.Ctx) error {

	var allCategories []models.Category

	// selecting first layer of categories

	layer1Filter := bson.M{"parent_id": primitive.NilObjectID}

	cursor, err := database.CategoryCollection.Find(context.Background(), layer1Filter)

	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{"error while fetching categories from database: ": err.Error()})
	}

	defer cursor.Close(context.Background())

	for cursor.Next(context.Background()) {
		var layer1Category models.Category
		if err := cursor.Decode(&layer1Category); err != nil {
			return c.Status(http.StatusInternalServerError).JSON(fiber.Map{"error while decoding cursor": err.Error()})
		}
		allCategories = append(allCategories, layer1Category)
	}

	// fmt.Println("l1 cates:", allCategories)

	var modifiedCategories []*modifiedCategory

	err = treefy(allCategories, &modifiedCategories)

	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	return c.Status(http.StatusOK).JSON(modifiedCategories)

}

func GetCategoryByID(c *fiber.Ctx) error {

	var category models.Category

	cateIDString := c.Params("CateID")

	cateID, err := primitive.ObjectIDFromHex(cateIDString)

	if err != nil {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{"error while fetching cate id from params": err.Error()})
	}

	filter := bson.M{"_id": cateID}

	err = database.CategoryCollection.FindOne(context.Background(), filter).Decode(&category)

	if err != nil {
		if err == mongo.ErrNoDocuments {
			return c.Status(http.StatusNotFound).JSON(fiber.Map{"error": "category not found"})
		}
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	return c.Status(http.StatusOK).JSON(category)

}

func EditCategory(c *fiber.Ctx) error {

	// token = ????

	var updatable models.UpdatableCategory

	if err := c.BodyParser(&updatable); err != nil {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{"error": "Invalid request body"})
	}

	cateIDString := c.Params("CateID")

	cateID, err := primitive.ObjectIDFromHex(cateIDString)

	if err != nil {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{"error while fetching cate id from params": err.Error()})
	}

	filter := bson.M{"_id": cateID}
	update := bson.M{"$set": bson.M{
		"title":                updatable.Title,
		"pictures":             updatable.Pictures,
		"description":          updatable.Description,
		"link":                 updatable.Link,
		"theme":                updatable.Theme,
		"details":              updatable.Details,
		"commision_percentage": updatable.CommisionPercentage,
	},
	}

	updateResult, err := database.CategoryCollection.UpdateOne(context.Background(), filter, update)

	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
			"message": "Failed to update category",
			"error":   err.Error(),
		})
	}

	if updateResult.MatchedCount == 0 {
		return c.Status(http.StatusNotFound).JSON(fiber.Map{"error": "category not found"})
	}

	if updateResult.ModifiedCount == 0 {
		return c.Status(http.StatusExpectationFailed).JSON(fiber.Map{"error": "category was not modified"})
	}

	return c.Status(http.StatusOK).JSON(fiber.Map{"message": "category updated suseefully"})
}

func GetFirstLayerCates(c *fiber.Ctx) error {

	var layer1Cates []models.Category

	filter := bson.M{"parent_id": primitive.NilObjectID}

	cursor, err := database.CategoryCollection.Find(context.Background(), filter)

	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
			"message": "error while fetching from categories collection",
			"error":   err.Error(),
		})
	}

	defer cursor.Close(context.Background())

	if err := cursor.All(context.Background(), &layer1Cates); err != nil {
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
			"message": "error while decoding cursor",
			"error":   err.Error(),
		})
	}

	return c.Status(http.StatusOK).JSON(layer1Cates)
}

func GetCateChildren(c *fiber.Ctx) error {

	cateIDString := c.Params("CateID")

	cateID, err := primitive.ObjectIDFromHex(cateIDString)

	if err != nil {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{
			"message": "error while fetching cate id from params",
			"error":   err.Error(),
		})
	}

	var category models.Category

	filter := bson.M{"_id": cateID}

	err = database.CategoryCollection.FindOne(context.Background(), filter).Decode(&category)

	if err != nil {
		if err == mongo.ErrNoDocuments {
			return c.Status(http.StatusNotFound).JSON(fiber.Map{"error": "category not found"})
		}
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
			"message": "error while fetching from categories collection",
			"error":   err.Error(),
		})
	}

	var cateChildren []models.Category

	for _, childID := range category.Childs {

		var child models.Category

		filter = bson.M{"_id": childID}

		err = database.CategoryCollection.FindOne(context.Background(), filter).Decode(&child)

		if err != nil {
			if err == mongo.ErrNoDocuments {
				errMessage := fmt.Sprintf("Inconsistency error! child id %#v in category not found", childID)
				return c.Status(http.StatusNotFound).JSON(fiber.Map{"error": errMessage})
			}
			return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
				"message": "error while fetching from categories collection",
				"error":   err.Error(),
			})
		}

		cateChildren = append(cateChildren, child)
	}

	return c.Status(http.StatusOK).JSON(cateChildren)
}

// Json Crack extension
