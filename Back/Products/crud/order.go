package crud

import (
	"context"
	"dg-kala-sample/database"
	"dg-kala-sample/models"
	"fmt"
	"net/http"
	"strconv"
	"time"

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

func GetAllOrders(c *fiber.Ctx) error {

	// token = admin ????

	var orders_list []models.Order

	filter := bson.M{}

	cursor, err := database.OrderCollection.Find(context.Background(), filter)

	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{"error while fetching orders from database: ": err.Error()})
	}

	defer cursor.Close(context.Background())

	if err := cursor.All(context.Background(), &orders_list); err != nil {
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{"error while decoding cursor": err.Error()})
	}

	return c.Status(http.StatusOK).JSON(orders_list)
}

func SellerIncomeChart(c *fiber.Ctx) error {

	sellerIDString := c.Query("SellerID")

	sellerID, err := primitive.ObjectIDFromHex(sellerIDString)

	if err != nil {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{"error while fetching seller id from params": err.Error()})
	}

	sDateHistoryString := c.Query("sDateHistory", "0")

	sDateHistory, err := strconv.Atoi(sDateHistoryString)

	if err != nil {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{"error while fetching sDateHistory from query": err.Error()})
	}

	if sDateHistory < 1 || sDateHistory > 3 {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{
			"error": "invalid sDateHistory",
			"valid sDateHistory": fiber.Map{
				"1": "last week",
				"2": "last month",
				"3": "last 2 months",
			},
		})
	}

	var sellerOrders []models.Order

	filter := bson.M{"product.seller_id": sellerID}

	cursor, err := database.OrderCollection.Find(context.Background(), filter)

	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
			"messaage": "something went wrong while fetching data from database",
			"error":    err.Error(),
		})
	}

	defer cursor.Close(context.Background())

	if err := cursor.All(context.Background(), &sellerOrders); err != nil {
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
			"messaage": "error while decoding cursor",
			"error":    err.Error(),
		})
	}

	type recentSaleChart struct {
		income int
		date   time.Time
	}

	var recentSaleChartList []recentSaleChart

	sellerIncomeInDuration := func(t1, t2 time.Time) int {
		var income int = 0
		isBetween := func(t, start, end time.Time) bool {
			return t.After(start) && t.Before(end) || t.Equal(start) || t.Equal(end)
		}
		for _, order := range sellerOrders {
			if isBetween(order.OrderDate, t1, t2) {
				income += order.Product.Price
			}
		}
		return income
	}

	var startDateYear int
	var startDateMonth time.Month
	var startDateDay int

	switch sDateHistory {
	case 1:
		startDateYear, startDateMonth, startDateDay = time.Now().Add(time.Hour * -24 * 7).Date()
	case 2:
		startDateYear, startDateMonth, startDateDay = time.Now().Add(time.Hour * -24 * 30).Date()
	case 3:
		startDateYear, startDateMonth, startDateDay = time.Now().Add(time.Hour * -24 * 60).Date()
	default:
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{
			"error": "invalid sDateHistory",
			"valid sDateHistory": fiber.Map{
				"1": "last week",
				"2": "last month",
				"3": "last 2 months",
			},
		})
	}

	startDate := time.Date(startDateYear, startDateMonth, startDateDay, 0, 0, 0, 0, time.UTC)

	for i := 0; i < 1000; i++ {
		if startDate.After(time.Now()) {
			break
		}
		income := sellerIncomeInDuration(startDate, startDate.Add(time.Hour*24))
		var chart = recentSaleChart{
			income: income,
			date:   startDate,
		}
		recentSaleChartList = append(recentSaleChartList, chart)
		startDate = startDate.Add(time.Hour * 24)
	}

	return c.Status(http.StatusOK).JSON(recentSaleChartList)
}
