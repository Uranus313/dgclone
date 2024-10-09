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
	"go.mongodb.org/mongo-driver/mongo/options"
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

	_, statusCode, err := InnerRequest(PUT, "/ShoppingCart", nil, map[string]string{
		"orderID": order.ID.Hex(),
		"userID":  order.UserID.Hex(),
	})

	if err != nil {
		return c.Status(statusCode).JSON(fiber.Map{
			"message": "Inner API Error",
			"error":   err.Error(),
		})
	}

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

	limitString := c.Query("limit", "20")

	limit, err := strconv.Atoi(limitString)

	if err != nil {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{"error while fetching limit from query": err.Error()})
	}

	offsetString := c.Query("offset", "0")

	offset, err := strconv.Atoi(offsetString)

	if err != nil {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{"error while fetching offset from query": err.Error()})
	}

	sortMethodString := c.Query("SortMethod", "1")

	sortMethod, err := strconv.Atoi(sortMethodString)

	if err != nil {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{"error while fetching sort method from query": err.Error()})
	}

	prodTitle := c.Query("ProdTitle", "")

	/*
		valid_sort_methods = {
			1: "product title",
			2: "rating",
			3: "date ordered",
		}
	*/

	var orders_list []models.Order

	findOpts := options.Find().SetSkip(int64(offset)).SetLimit(int64(limit))

	switch sortMethod {
	case 1:
		findOpts.SetSort(bson.D{{Key: "product.title", Value: 1}})
	case 2:
		findOpts.SetSort(bson.D{{Key: "rate", Value: -1}})
	case 3:
		findOpts.SetSort(bson.D{{Key: "order_date", Value: -1}})
	default:
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid Sort Method",
			"valid_sort_methods": fiber.Map{
				"1": "product title",
				"2": "rating",
				"3": "date ordered",
			},
		})
	}

	var filter primitive.M

	if prodTitle != "" {
		filter = bson.M{"product.title": prodTitle}
	} else {
		filter = bson.M{}
	}

	cursor, err := database.OrderCollection.Find(context.Background(), filter, findOpts)

	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{"error while fetching orders from database: ": err.Error()})
	}

	defer cursor.Close(context.Background())

	if err := cursor.All(context.Background(), &orders_list); err != nil {
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{"error while decoding cursor": err.Error()})
	}

	var hasMore bool = false

	if len(orders_list) == limit {

		findOpts.SetSkip(int64(limit) + int64(offset)).SetLimit(1)
		var nextDocs []models.Order
		nextDocsCursor, err := database.OrderCollection.Find(context.Background(), filter, findOpts)

		if err != nil {
			return c.Status(http.StatusInternalServerError).JSON(fiber.Map{"error while fetching orders from database:": err.Error()})
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
		"orders":  orders_list,
		"hasMore": hasMore,
	})
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

	// if sDateHistory < 1 || sDateHistory > 3 {
	// 	return c.Status(http.StatusBadRequest).JSON(fiber.Map{
	// 		"error": "invalid sDateHistory",
	// 		"valid sDateHistory": fiber.Map{
	// 			"1": "last week",
	// 			"2": "last month",
	// 			"3": "last 2 months",
	// 		},
	// 	})
	// }
	var startDateYear int
	var startDateMonth time.Month
	var startDateDay int

	var timeDuration time.Duration

	switch sDateHistory {
	case 1:
		timeDuration = time.Hour * 24 * 7
		// startDateYear, startDateMonth, startDateDay = time.Now().Add(time.Hour * -24 * 7*2).Date()
	case 2:
		timeDuration = time.Hour * 24 * 30
		// startDateYear, startDateMonth, startDateDay = time.Now().Add(time.Hour * -24 * 30*2).Date()
	case 3:
		timeDuration = time.Hour * 24 * 60
		// startDateYear, startDateMonth, startDateDay = time.Now().Add(time.Hour * -24 * 60*2).Date()
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

	startDateYear, startDateMonth, startDateDay = time.Now().Add(timeDuration * -2).Date()

	startDate := time.Date(startDateYear, startDateMonth, startDateDay, 0, 0, 0, 0, time.UTC)

	originDate := startDate.Add(timeDuration)

	var sellerOrders []models.Order

	filter := bson.M{
		"product.seller_id": sellerID,
		"order_date":        bson.M{"$gt": startDate},
	}

	findOpts := options.Find().SetSort(bson.D{{Key: "order_date", Value: 1}})

	cursor, err := database.OrderCollection.Find(context.Background(), filter, findOpts)

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

	isBetween := func(t, start, end time.Time) bool {
		return t.After(start) && t.Before(end) || t.Equal(start) || t.Equal(end)
	}

	sellerIncomeInDuration := func(t1, t2 time.Time) int {
		var income int = 0
		for _, order := range sellerOrders {
			if isBetween(order.OrderDate, t1, t2) {
				income += order.Product.Price
			}
		}
		return income
	}

	timePointer := startDate
	lastDurationIncome := 0
	durationIncome := 0

	// for startDate.Before(time.Now()) {
	for isBetween(timePointer, startDate, originDate) {

		lastDurationIncome += sellerIncomeInDuration(timePointer, timePointer.Add(time.Hour*24))

		timePointer = timePointer.Add(time.Hour * 24)
	}

	for isBetween(timePointer, originDate, time.Now()) {

		income := sellerIncomeInDuration(timePointer, timePointer.Add(time.Hour*24))
		durationIncome += income
		var chart = recentSaleChart{
			income: income,
			date:   timePointer,
		}
		recentSaleChartList = append(recentSaleChartList, chart)
		timePointer = timePointer.Add(time.Hour * 24)
	}

	var profit float32 = float32(durationIncome-lastDurationIncome) / float32(lastDurationIncome) * 100

	return c.Status(http.StatusOK).JSON(fiber.Map{
		"recentSaleChartList": recentSaleChartList,
		"profit":              profit,
	})
}
