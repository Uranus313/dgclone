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
	user := c.Locals("ent").(map[string]interface{})

	var order models.Order

	if err := c.BodyParser(&order); err != nil {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{"error": "Invalid request body: " + err.Error()})
	}

	order.State = models.Pending
	userID, _ := primitive.ObjectIDFromHex(user["_id"].(string))
	order.UserID = userID

	insertResult, err := database.OrderCollection.InsertOne(context.Background(), order)

	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to add order"})
	}

	order.ID = insertResult.InsertedID.(primitive.ObjectID)

	_, statusCode, err := InnerRequest(PUT, "/shopingCart", nil, map[string]string{
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

	queryParams := c.Queries()

	var orderStates []int
	for i := 0; ; i++ {
		key := fmt.Sprintf("OrderStates[%d]", i)
		if value, ok := queryParams[key]; ok {
			orderState, err := strconv.Atoi(value)
			if err != nil {
				return c.Status(http.StatusBadRequest).JSON(fiber.Map{"error while converting order state": err.Error()})
			}
			if orderState < 1 || orderState > 5 {
				errMessage := fmt.Sprintf("order state %v is not valid", orderState)
				return c.Status(http.StatusBadRequest).JSON(fiber.Map{"error": "Invalid order state entry - " + errMessage})
			}
			orderStates = append(orderStates, orderState)
		} else {
			break
		}
	}

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
		filter = bson.M{
			"product.title": prodTitle,
			"state":         bson.M{"$in": orderStates},
		}
	} else {
		filter = bson.M{"state": bson.M{"$in": orderStates}}
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

func GetOrderListTotalPrice(c *fiber.Ctx) error {

	type requestBody struct {
		OrdersList []primitive.ObjectID `json:"orders_list"`
	}

	var reqBody requestBody

	if err := c.BodyParser(&reqBody); err != nil {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{"error": "Invalid request body"})
	}

	totalPrice, statusCode, err := CalculateTotalOrderListPrice(reqBody.OrdersList)

	if err != nil {
		return c.Status(statusCode).JSON(fiber.Map{
			"message": "problem with order ids",
			"error":   err.Error(),
		})
	}

	return c.Status(http.StatusOK).JSON(fiber.Map{
		"totalPrice": totalPrice,
	})
}

type orderListPriceSeller struct {
	sellerID primitive.ObjectID
	income   int
}

type orderListPrice struct {
	totalPrice int
	sellers    []orderListPriceSeller
}

func CalculateTotalOrderListPrice(orderIDList []primitive.ObjectID) (orderListPrice, int, error) {

	var totalPrice int = 0
	var sellers []orderListPriceSeller

	for _, orderID := range orderIDList {
		var order models.Order
		filter := bson.M{"_id": orderID}
		err := database.OrderCollection.FindOne(context.Background(), filter).Decode(&order)
		if err != nil {
			if err == mongo.ErrNoDocuments {
				return orderListPrice{}, http.StatusNotFound, err
			}
			return orderListPrice{}, http.StatusInternalServerError, err
		}
		totalPrice += order.Product.Price * order.Quantity
		var seller = orderListPriceSeller{
			sellerID: order.Product.SellerID,
			income:   order.Product.Price * order.Quantity,
		}
		sellers = append(sellers, seller)
	}

	return orderListPrice{
		totalPrice: totalPrice,
		sellers:    sellers,
	}, http.StatusOK, nil
}

func UpdateOrderState(c *fiber.Ctx) error {

	orderIDString := c.Query("OrderID")

	orderID, err := primitive.ObjectIDFromHex(orderIDString)

	if err != nil {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{
			"message": "error while fetching order id from params",
			"error":   err.Error(),
		})
	}

	stateString := c.Query("State")

	state, err := strconv.Atoi(stateString)

	if err != nil {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{
			"message": "error while fetching validation state from query",
			"error":   err.Error(),
		})
	}

	if state < 1 || state > 5 {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{
			"error": "invalid state",
			"valid requests": fiber.Map{
				"1": "delivered",
				"2": "pending",
				"3": "canceled",
				"4": "returned",
				"5": "recievedInWareHouse",
			},
		})
	}

	update := bson.M{"$set": bson.M{"state": state}}

	updateResult, err := database.OrderCollection.UpdateByID(context.Background(), orderID, update)

	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
			"message": "error while updating order",
			"error":   err.Error(),
		})
	}

	if updateResult.MatchedCount == 0 {
		return c.Status(http.StatusNotFound).JSON(fiber.Map{"error": "order not found"})
	}

	if updateResult.ModifiedCount == 0 {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{"error": "order was not modified"})
	}

	// _, statusCode, err := InnerRequest(POST,"/notification",map[string]string{

	// },nil)

	// if err != nil {
	// 	return c.Status(statusCode).JSON(fiber.Map{
	// 		"message": "Inner API Error",
	// 		"error":   err.Error(),
	// 	})
	// }

	return c.Status(http.StatusOK).JSON(fiber.Map{"message": "order state updated succesfully"})
}

func GetOrdersByUserID(c *fiber.Ctx) error {

	user := c.Locals("ent").(map[string]interface{})

	var ordersList []models.Order

	userID, err := primitive.ObjectIDFromHex(user["_id"].(string))

	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	filter := bson.M{"user_id": userID}

	cursor, err := database.OrderCollection.Find(context.Background(), filter)

	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
			"message": "error while fetching from orders collection",
			"error":   err.Error(),
		})
	}

	defer cursor.Close(context.Background())

	if err := cursor.All(context.Background(), &ordersList); err != nil {
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
			"message": "error while fetching decoding cursor",
			"error":   err.Error(),
		})
	}

	return c.Status(http.StatusOK).JSON(ordersList)
}

func DeleteOrder(c *fiber.Ctx) error {

	orderIDString := c.Query("OrderID")

	orderID, err := primitive.ObjectIDFromHex(orderIDString)

	if err != nil {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{
			"message": "error while fetching order id from params",
			"error":   err.Error(),
		})
	}

	filter := bson.M{"_id": orderID}

	var order models.Order

	err = database.OrderCollection.FindOne(context.Background(), filter).Decode(&order)

	if err != nil {
		if err == mongo.ErrNoDocuments {
			return c.Status(http.StatusNotFound).JSON(fiber.Map{"error": "order not found"})
		}
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	deleteResult, err := database.OrderCollection.DeleteOne(context.Background(), filter)

	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	if deleteResult.DeletedCount == 0 {
		return c.Status(http.StatusNotFound).JSON(fiber.Map{"error": "order not found"})
	}

	_, statusCode, err := InnerRequest(PATCH, "/shoppingCartDelete", nil, map[string]string{
		"orderID": order.ID.Hex(),
		"userID":  order.UserID.Hex(),
	})

	if err != nil {
		return c.Status(statusCode).JSON(fiber.Map{
			"message": "Inner API Error",
			"error":   err.Error(),
		})
	}

	return c.Status(http.StatusOK).JSON(order)
}
