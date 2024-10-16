package main

import (
	"context"
	"dg-kala-sample/auth"
	"dg-kala-sample/crud"
	"dg-kala-sample/database"
	"fmt"

	// fakerdata "dg-kala-sample/fakerData"
	"log"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/gofiber/fiber/v2/middleware/monitor"
	"github.com/joho/godotenv"
)

func main() {

	err := godotenv.Load(".env")

	if err != nil {
		log.Fatal("error while loading .env file:", err)
	}

	database.DeployCollections()
	auth.DeclareInnerPass()

	defer database.Client.Disconnect(context.Background())

	// fakerdata.InsertDummyBrands()
	// fakerdata.InsertDummyCategories()
	// fakerdata.ModifyCategory()
	// fakerdata.InsertDummyProducts()
	// fakerdata.InsertDummyComments()
	// fakerdata.InsertDummyDiscountCode()
	// fakerdata.InsertDummySaleDiscount()
	// fakerdata.ModProds()
	// fakerdata.ModComms()
	// fakerdata.ModBrand()
	// fakerdata.InsertDummyGuarantee()

	app := fiber.New()

	app.Use(cors.New(cors.Config{
		AllowOrigins:     "http://localhost:5173, http://localhost:3000, http://localhost:3005, http://myapp.local, https://localhost:3000",
		AllowHeaders:     "Origin,Content-Type,Accept,Authorization",
		AllowMethods:     "POST, PUT, GET, DELETE, PATCH",
		AllowCredentials: true,
	}))
	// app.Use(cors.New(cors.Config{}))

	app.Get("/metrics", monitor.New())
	app.Use(logger.New())

	// ------------comemnts------------

	app.Get("/products/comments", auth.AuthMiddleware([]string{"user"}), crud.GetCommentsByProductID) // query params => limit, offset, ProdID

	app.Post("/products/comments", auth.AuthMiddleware([]string{"user"}), crud.PostComment) // --unchecked (request body)

	app.Patch("/products/comments/:CommentID", auth.AuthMiddleware([]string{"user"}), crud.UpdateCommentScore) // (request body)

	app.Get("/products/questions", auth.AuthMiddleware([]string{"user"}), crud.GetProductQuestions) // query params => limit, offset, ProdID

	app.Get("/products/comments/pending", auth.AuthMiddleware([]string{"admin","employee"}), crud.GetPendingComments) // query params => limit, offset

	app.Patch("/products/validate-comments", auth.AuthMiddleware([]string{"admin","employee"}), crud.UpdateCommentValidationState) // query params => CommentID, ValidationState -> {2: validated, 3: banned}

	// ------------products-------------

	app.Get("/products/product/:ProdID", crud.GetProductByID)

	app.Post("/products/product", auth.AuthMiddleware([]string{"seller"}), crud.AddProduct) // (request body)

	app.Patch("/products/product/AddSeller/:ProdID", auth.AuthMiddleware([]string{"seller"}), crud.AddSellerToProduct) // --unchecked

	app.Patch("/products/product/UpdateRating", auth.AuthMiddleware([]string{"user"}), crud.UpdateProductRating) // query params => ProductID, Rating

	app.Patch("/products/product/UpdateQuantity", auth.AuthMiddleware([]string{"user", "seller"}), crud.UpdateProdQuantity) // query params => ProductID, SellerID, Quantity, Color --unchecked

	app.Delete("/products/product/:ProdID", auth.AuthMiddleware([]string{"admin","employee"}), crud.DeleteProductByID)

	app.Patch("/products/product", auth.AuthMiddleware([]string{"seller", "admin","employee"}), crud.EditProduct) // (request body)

	app.Get("/products/product", crud.InfiniteScrolProds) // query params => limit, offset, CateID

	app.Get("/products/prodAndOrdersCount", auth.AuthMiddleware([]string{"admin","employee"}), crud.GetProdsAndOrdersCount)

	app.Get("/products/allProducts", auth.AuthMiddleware([]string{"admin","employee"}), crud.GetAllProducts) //query params => limit, offset, SortMethod, prodTitle

	app.Get("/products/allPendingProducts", auth.AuthMiddleware([]string{"admin","employee"}), crud.GetAllPendingProds) //query params => limit, offset

	app.Patch("/products/validate-prods", auth.AuthMiddleware([]string{"admin","employee"}), crud.UpdateProdValidationState) //query params => ProdID, ValidationState -> {2: validated, 3: banned}

	app.Patch("/products/seller/addVariant", auth.AuthMiddleware([]string{"seller"}), crud.AddVariantToSeller) //query params => prodID, SellerID ... and body

	app.Get("/products/seller/pendingVariants", auth.AuthMiddleware([]string{"admin","employee"}), crud.GetAllPendingVariants) // query params => limit, offset

	app.Patch("/products/validate-variant", auth.AuthMiddleware([]string{"admin","employee"}), crud.UpdateVariantValidationState) // query params => prodID, SellerID, ColorID, ValidationState -> {2: validated, 3: banned}

	app.Get("/products/seller/allProds", auth.AuthMiddleware([]string{"seller"}), crud.GetSellerProducts)

	app.Patch("/products/seller/setNewPrice", auth.AuthMiddleware([]string{"seller"}), crud.ChangeSellerPrice) // query params => prodID, SellerID, NewPrice

	app.Get("/products/product/productsInList", auth.AuthMiddleware([]string{"user", "seller"}), crud.GetProductInList)

	app.Get("/products/ordersInList", auth.AuthMiddleware([]string{"user", "seller"}), crud.GetOrdersInList)
	// --------------category-----------------

	app.Post("/products/category", auth.AuthMiddleware([]string{"admin","employee"}), crud.AddCategory) // (request body)

	app.Get("/products/category", crud.GetAllCategories)

	app.Get("/products/category/:CateID", auth.AuthMiddleware([]string{"seller", "admin","employee"}), crud.GetCategoryByID)

	app.Patch("/products/category/:CateID", auth.AuthMiddleware([]string{"admin","employee"}), crud.EditCategory) // (request body)

	app.Get("products/layer1categories", auth.AuthMiddleware([]string{"admin","employee"}), crud.GetFirstLayerCates)

	app.Get("products/categoryChildren/:CateID", auth.AuthMiddleware([]string{"admin","employee"}), crud.GetCateChildren)

	// -------------brand---------------

	app.Post("/products/brand", auth.AuthMiddleware([]string{"admin", "employee"}), crud.AddBrand) // (request body)

	app.Get("/products/brand/:BrandID", crud.GetBrandByID)

	app.Delete("/products/brand/:BrandID", auth.AuthMiddleware([]string{"admin", "employee"}), crud.DeleteBrandByID)

	app.Get("/products/brand", crud.GetAllBrands)

	// ------------discount code-----------

	app.Post("/products/discountcode", auth.AuthMiddleware([]string{"admin", "employee"}), crud.AddDiscountCode) // (request body)

	app.Get("/products/discountcode", auth.AuthMiddleware([]string{"user"}), crud.CheckUserDiscountCode) // query params => DCode, UserID

	// ------------sale discount-----------

	app.Get("/products/salediscount/MostDiscounts", crud.GetMostDiscounts) // query params => CateID

	app.Post("/products/salediscount", auth.AuthMiddleware([]string{"seller"}), crud.AddSaleDiscount) // query params => ProdID, SellerID, EndDate, NewPrice | note. EndDate layout must be "yyyy-mm-dd 15:04:05" format

	// -------------colors---------------

	app.Post("/products/color", auth.AuthMiddleware([]string{"admin", "employee"}), crud.AddColor) // (request body)

	app.Get("products/color", crud.GetAllColors)

	// -------------guarantees---------------

	app.Post("/products/guarantee", auth.AuthMiddleware([]string{"seller", "admin", "employee"}), crud.AddGuarantee) // (request body)

	app.Get("products/guarantee", auth.AuthMiddleware([]string{"user", "seller", "admin", "employee"}), crud.GetAllGuarantee)

	// -------------orders--------------

	app.Post("/products/order", auth.AuthMiddleware([]string{"user"}), crud.AddOrder) // (request body)

	app.Get("/products/order/orderhistory/:OHID", auth.AuthMiddleware([]string{"user"}), crud.GetOrdersInOrdersHistory)

	app.Get("/products/order/sellerIncomeChart", auth.AuthMiddleware([]string{"admin", "employee"}), crud.SellerIncomeChart) // query params => SellerID, sDateHistory

	app.Get("/products/order", auth.AuthMiddleware([]string{"admin", "employee"}), crud.GetAllOrders) // query params => limit, offset, SortMethod, ProdTitle, OrderStates[]

	app.Post("products/order/orderListTotalPrice", auth.AuthMiddleware([]string{"user", "seller", "admin", "employee"}), crud.GetOrderListTotalPrice)

	app.Patch("/products/order", auth.AuthMiddleware([]string{"admin", "employee"}), crud.UpdateOrderState) // query params => OrderID, State

	app.Get("/products/order/userOrders", auth.AuthMiddleware([]string{"user"}), crud.GetOrdersByUserID)

	app.Delete("/products/order", auth.AuthMiddleware([]string{"user"}), crud.DeleteOrder)

	// -------------inner--------------

	app.Get("/products/inner/ProductMapAssign", auth.InnerAuth, crud.InnerProductMapAssign)

	app.Get("/products/inner/order/:orderID", auth.InnerAuth, crud.InnerGetOrderByID)

	app.Get("/products/inner/orderHistory/:orderHistoryID", auth.InnerAuth, crud.InnerGetOrderHistoryByID)

	app.Get("/products/inner/product/:ProdID", auth.InnerAuth, crud.InnerGetProductByID)

	app.Get("/products/inner/sellerSaleInfo/:SellerID", auth.InnerAuth, crud.InnerSellerBS)

	app.Post("/products/inner/orderHistory", auth.InnerAuth, crud.InnerAddOrderHistory)

	app.Get("/products/inner/orderListTotalPrice", auth.InnerAuth, crud.GetOrderListTotalPrice)

	app.Get("/test", func(c *fiber.Ctx) error {
		queries := c.Queries()
		// tt = tt.(slices)

		var list []string
		for i := 0; ; i++ {
			key := fmt.Sprintf("List[%d]", i)
			if value, ok := queries[key]; ok {
				list = append(list, value)
			} else {
				break
			}
		}
		return c.JSON(fiber.Map{
			"1": list,
			"2": queries["bo"],
		})
	})

	app.Get("/checkEnt", auth.AuthMiddleware([]string{"user", "admin", "seller", "employee"}), func(c *fiber.Ctx) error {

		ent := c.Locals("ent")

		return c.Status(200).JSON(ent)
	})

	log.Fatal(app.ListenTLS(":8080", "./cert.pem", "./key.pem"))
}
