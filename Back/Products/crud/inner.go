package crud

import (
	"context"
	"dg-kala-sample/auth"
	"dg-kala-sample/database"
	"dg-kala-sample/models"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"

	"time"

	"github.com/gofiber/fiber/v2"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func InnerProductMapAssign(c *fiber.Ctx) error {

	/*

		- takes an object from input => map[productID]null
		and assigns the product object in front of its keys and returns it

	*/

	if c.Get("inner-secret") != auth.InnerPass {
		return c.Status(http.StatusForbidden).JSON(fiber.Map{"error": "Invalid Inner Password"})
	}

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

func InnerGetOrderByID(c *fiber.Ctx) error {

	if c.Get("inner-secret") != auth.InnerPass {
		return c.Status(http.StatusForbidden).JSON(fiber.Map{"error": "Invalid Inner Password"})
	}

	orderIDString := c.Params("orderID")

	orderID, err := primitive.ObjectIDFromHex(orderIDString)

	if err != nil {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{"error while fetching order id from params": err.Error()})
	}

	var order models.Order

	filter := bson.M{"_id": orderID}

	err = database.OrderCollection.FindOne(context.Background(), filter).Decode(&order)

	if err != nil {
		if err == mongo.ErrNoDocuments {
			return c.Status(http.StatusNotFound).JSON(fiber.Map{"error": "order not found"})
		}
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	return c.Status(http.StatusOK).JSON(order)
}

func InnerGetOrderHistoryByID(c *fiber.Ctx) error {

	if c.Get("inner-secret") != auth.InnerPass {
		return c.Status(http.StatusForbidden).JSON(fiber.Map{"error": "Invalid Inner Password"})
	}

	orderHistoryIDString := c.Params("orderHistoryID")

	orderHistoryID, err := primitive.ObjectIDFromHex(orderHistoryIDString)

	if err != nil {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{"error while fetching orderHistory id from params": err.Error()})
	}

	var orderHistory models.OrderHistory

	filter := bson.M{"_id": orderHistoryID}

	err = database.OrderHistoryCollection.FindOne(context.Background(), filter).Decode(&orderHistory)

	if err != nil {
		if err == mongo.ErrNoDocuments {
			return c.Status(http.StatusNotFound).JSON(fiber.Map{"error": "order history not found"})
		}
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	return c.Status(http.StatusOK).JSON(orderHistory)
}

func InnerGetProductByID(c *fiber.Ctx) error {

	if c.Get("inner-secret") != auth.InnerPass {
		return c.Status(http.StatusForbidden).JSON(fiber.Map{"error": "Invalid Inner Password"})
	}

	var product models.Product

	prodIDString := c.Params("ProdID")

	prodID, err := primitive.ObjectIDFromHex(prodIDString)

	if err != nil {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{"error while fetching prod id from params": err.Error()})
	}

	filter := bson.M{"_id": prodID}

	err = database.ProductCollection.FindOne(context.Background(), filter).Decode(&product)

	if err != nil {
		if err == mongo.ErrNoDocuments {
			return c.Status(http.StatusNotFound).JSON(fiber.Map{"error": "product not found"})
		}
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	if product.ValidationState.String() == "PendingValidation" || product.ValidationState.String() == "Banned" {
		return c.Status(http.StatusForbidden).JSON(fiber.Map{
			"error":            "product is not validated",
			"validation state": product.ValidationState.String(),
		})
	}

	return c.Status(http.StatusOK).JSON(product)
}

func InnerSellerBS(c *fiber.Ctx) error {

	if c.Get("inner-secret") != auth.InnerPass {
		return c.Status(http.StatusForbidden).JSON(fiber.Map{"error": "Invalid Inner Password"})
	}

	sellerIDString := c.Params("SellerID")

	sellerID, err := primitive.ObjectIDFromHex(sellerIDString)

	if err != nil {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{"error while fetching seller id from params": err.Error()})
	}

	// sDateHistoryString := c.Query("sDateHistory", "0")

	// sDateHistory, err := strconv.Atoi(sDateHistoryString)

	// if err != nil {
	// 	return c.Status(http.StatusBadRequest).JSON(fiber.Map{"error while fetching sDateHistory from query": err.Error()})
	// }

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

	var sellerOrders []models.Order

	filter := bson.M{"product.seller_id": sellerID}

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

	type SaleInfo struct {
		sold         int
		income       int
		productCount int
	}

	type OrderInfo struct {
		pastAndTodayShipmentComitment       int
		tomorrowAndFutureShipmentCommitment int
		todaysOrders                        int
		cancledOrders                       int
	}

	type recentSaleChart struct {
		income int
		date   time.Time
	}

	var sellerIncome int = 0
	var pastAndTodayShipmentComitment int = 0
	var tomorrowAndFutureShipmentCommitment int = 0
	var todaysOrders int = 0
	var cancledOrders int = 0

	isSameDay := func(t1, t2 time.Time) bool {
		return t1.Year() == t2.Year() && t1.Month() == t2.Month() && t1.Day() == t2.Day()
	}

	for _, order := range sellerOrders {
		sellerIncome += order.Product.Price
		if order.State == models.Pending {
			if order.ReceiveDate.Add(time.Hour * -24).Before(time.Now()) {
				pastAndTodayShipmentComitment++
			} else {
				tomorrowAndFutureShipmentCommitment++
			}
			if isSameDay(order.OrderDate, time.Now()) {
				todaysOrders++
			}
		} else if order.State == models.Canceled {
			cancledOrders++
		}

	}

	pipeline := mongo.Pipeline{
		{{Key: "$match", Value: bson.M{"product.seller_id": sellerID}}},
		{{Key: "$group", Value: bson.D{{Key: "_id", Value: "$product.prod_id"}}}},
		{{Key: "$count", Value: "distinctProdIDCount"}},
	}

	countCursor, err := database.OrderCollection.Aggregate(context.TODO(), pipeline)

	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
			"messaage": "something went wrong while fetching data from database",
			"error":    err.Error(),
		})
	}

	defer countCursor.Close(context.TODO())

	var countResult struct {
		DistinctProdIDCount int `bson:"distinctProdIDCount"`
	}

	if cursor.Next(context.TODO()) {
		err := cursor.Decode(&countResult)
		if err != nil {
			return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
				"messaage": "error while decoding cursor",
				"error":    err.Error(),
			})
		}
	}

	var saleInfo = SaleInfo{
		sold:         len(sellerOrders),
		income:       sellerIncome,
		productCount: countResult.DistinctProdIDCount,
	}

	var orderInfo = OrderInfo{
		pastAndTodayShipmentComitment:       pastAndTodayShipmentComitment,
		tomorrowAndFutureShipmentCommitment: tomorrowAndFutureShipmentCommitment,
		todaysOrders:                        todaysOrders,
		cancledOrders:                       cancledOrders,
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

	// var startDateYear int
	// var startDateMonth time.Month
	// var startDateDay int

	// switch sDateHistory {
	// case 1:
	startDateYear, startDateMonth, startDateDay := time.Now().Add(time.Hour * -24 * 7).Date()
	// case 2:
	// 	startDateYear, startDateMonth, startDateDay = time.Now().Add(time.Hour * -24 * 30).Date()
	// case 3:
	// 	startDateYear, startDateMonth, startDateDay = time.Now().Add(time.Hour * -24 * 60).Date()
	// default:
	// 	return c.Status(http.StatusBadRequest).JSON(fiber.Map{
	// 		"error": "invalid sDateHistory",
	// 		"valid sDateHistory": fiber.Map{
	// 			"1": "last week",
	// 			"2": "last month",
	// 			"3": "last 2 months",
	// 		},
	// 	})
	// }

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

	return c.Status(http.StatusOK).JSON(fiber.Map{
		"saleInfo":        saleInfo,
		"ordersInfo":      orderInfo,
		"recentSaleChart": recentSaleChartList,
	})

}

const (
	GET    = "GET"
	POST   = "POST"
	PATCH  = "PATCH"
	PUT    = "PUT"
	DELETE = "DELETE"
)

// returnes response body, status code, error
func InnerRequest(method string, url string) (map[string]interface{}, int, error) {

	const BASE_URL string = "http://localhost:3005/users/inner"

	req, err := http.NewRequest(method, BASE_URL+url, nil)

	if err != nil {
		return nil, 500, err
	}

	req.Header.Add("inner-secret", auth.InnerPass)

	res, err := http.DefaultClient.Do(req)

	if err != nil {
		return nil, 500, err
	}

	defer res.Body.Close()

	body, readErr := io.ReadAll(res.Body)

	if readErr != nil {
		return nil, 500, err
	}

	var responseBody map[string]interface{}

	json.Unmarshal(body, &responseBody)

	fmt.Println("res:", responseBody)

	if res.StatusCode != 200 {
		return nil, res.StatusCode, errors.New(responseBody["error"].(string))
	}

	return responseBody, 200, nil
}
