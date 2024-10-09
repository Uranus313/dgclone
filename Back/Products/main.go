package main

import (
	"context"
	// "dg-kala-sample/auth"
	"dg-kala-sample/auth"
	"dg-kala-sample/crud"
	"dg-kala-sample/database"

	// fakerdata "dg-kala-sample/fakerData"

	"log"
	"strings"

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

	app := fiber.New()

	app.Use(cors.New(cors.Config{
		AllowOrigins:     "http://localhost:5173, http://localhost:3000, http://localhost:3005, http://myapp.local",
		AllowHeaders:     "Origin,Content-Type,Accept,Authorization",
		AllowMethods:     "*",
		AllowCredentials: true,
	}))
	app.Get("/metrics", monitor.New())
	app.Use(logger.New())

	// ------------comemnts------------

	app.Get("/products/comments", auth.AuthMiddleware("user"), crud.GetCommentsByProductID) // query params => limit, offset, ProdID

	app.Post("/products/comments", auth.AuthMiddleware("user"), crud.PostComment) // --unchecked (request body)

	app.Patch("/products/comments/:CommentID", auth.AuthMiddleware("user"), crud.UpdateCommentScore) // (request body)

	app.Get("/products/questions", auth.AuthMiddleware("user"), crud.GetProductQuestions) // query params => limit, offset, ProdID

	app.Get("/products/comments/pending", auth.AuthMiddleware("admin"), crud.GetPendingComments) // query params => limit, offset

	app.Patch("/products/validate-comments", auth.AuthMiddleware("admin"), crud.UpdateCommentValidationState) // query params => CommentID, ValidationState -> {2: validated, 3: banned}

	// ------------products-------------

	app.Get("/products/product/:ProdID", crud.GetProductByID)

	app.Post("/products/product", crud.AddProduct) // (request body)

	app.Patch("/products/product/AddSeller/:ProdID", crud.AddSellerToProduct) // --unchecked (request body)

	app.Patch("/products/product/UpdateRating", crud.UpdateProductRating) // query params => ProductID, Rating

	app.Patch("/products/product/UpdateQuantity", crud.UpdateProdQuantity) // query params => ProductID, SellerID, Quantity, Color --unchecked

	app.Delete("/products/product/:ProdID", crud.DeleteProductByID)

	app.Patch("/products/product", crud.EditProduct) // (request body)

	app.Get("/products/product", crud.InfiniteScrolProds) // query params => limit, offset, CateID

	app.Get("/products/prodAndOrdersCount", crud.GetProdsAndOrdersCount)

	app.Get("/products/allProducts", crud.GetAllProducts) //query params => limit, offset, SortMethod, BrandID

	app.Get("/products/allPendingProducts", crud.GetAllPendingProds) //query params => limit, offset

	app.Patch("/products/validate-prods", crud.UpdateProdValidationState) //query params => ProdID, ValidationState -> {2: validated, 3: banned}

	app.Patch("/products/seller/addVariant", crud.AddVariantToSeller) //query params => prodID, SellerID ... and body

	app.Get("/products/seller/pendingVariants", crud.GetAllPendingVariants) // query params => limit, offset

	app.Patch("/products/validate-variant", crud.UpdateVariantValidationState) // query params => prodID, SellerID, ColorID, ValidationState -> {2: validated, 3: banned}

	app.Get("/products/seller/allProds", crud.GetSellerProducts)

	app.Patch("/products/seller/setNewPrice", crud.ChangeSellerPrice) // query params => prodID, SellerID, NewPrice

	// --------------category-----------------

	app.Post("/products/category", crud.AddCategory) // (request body)

	app.Get("/products/category", crud.GetAllCategories)

	app.Get("/products/category/:CateID", crud.GetCategoryByID)

	app.Patch("/products/category/:CateID", crud.EditCategory) // (request body)

	// -------------brand---------------

	app.Post("/products/brand", crud.AddBrand) // (request body)

	app.Get("/products/brand/:BrandID", crud.GetBrandByID)

	app.Delete("/products/brand/:BrandID", crud.DeleteBrandByID)

	app.Get("/products/brand", crud.GetAllBrands)

	// ------------discount code-----------

	app.Post("/products/discountcode", crud.AddDiscountCode) // (request body)

	app.Put("/products/discountcode", crud.UpdateUserDiscountCode) // query params => DCode, UserID

	// ------------sale discount-----------

	app.Get("/products/salediscount/MostDiscounts", crud.GetMostDiscounts) // query params => CateID

	app.Post("/products/salediscount", crud.AddSaleDiscount) // query params => ProdID, SellerID, EndDate, NewPrice | note. EndDate layout must be "yyyy-mm-dd 15:04:05" format

	// -------------colors---------------

	app.Post("/products/color", crud.AddColor) // (request body)

	app.Get("products/color", crud.GetAllColors)

	// -------------guarantees---------------

	app.Post("/products/guarantee", crud.AddGuarantee) // (request body)

	app.Get("products/guarantee", crud.GetAllGuarantee)

	// -------------orders--------------

	app.Post("/products/order", crud.AddOrder) // (request body)

	app.Get("/products/order/orderhistory/:OHID", crud.GetOrdersInOrdersHistory)

	app.Get("/products/order/sellerIncomeChart", crud.SellerIncomeChart) // query params => SellerID, sDateHistory

	app.Get("/products/order", crud.GetAllOrders) // query params => limit, offset, SortMethod, ProdTitle

	// -------------inner--------------

	app.Get("/products/inner/ProductMapAssign", crud.InnerProductMapAssign)

	app.Get("/products/inner/order/:orderID", crud.InnerGetOrderByID)

	app.Get("/products/inner/orderHistory/:orderHistoryID", crud.InnerGetOrderHistoryByID)

	app.Get("/products/inner/product/:ProdID", crud.InnerGetOrderByID)

	app.Get("/products/inner/sellerSaleInfo/:SellerID", crud.InnerSellerBS)

	// ------------tests-------------

	app.Post("/products/addpost", func(c *fiber.Ctx) error {
		// Get the Authorization header
		authHeader := c.Get("Authorization")

		// Check if the header is not empty and contains the Bearer token
		if authHeader == "" || !strings.HasPrefix(authHeader, "Bearer ") {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
				"error": "Unauthorized",
			})
		}

		// Extract the token from the header (remove "Bearer " prefix)
		token := strings.TrimPrefix(authHeader, "Bearer ")

		// Now you can use the token as needed
		log.Println("Token:", token)

		// Continue processing
		return c.Next()

	})

	app.Get("/products/query-parameters", func(c *fiber.Ctx) error {
		// Retrieve query parameters
		category := c.Query("category") // "electronics"
		sort := c.Query("sort")         // "price"

		// You can also provide a default value if the parameter is not present
		limit := c.Query("limit", "10") // if limit is not provided, it will default to "10"

		// Output for demonstration purposes
		// fmt.Printf("Category: %s, Sort: %s, Limit: %s\n", category, sort, limit)
		log.Printf("Category: %s, Sort: %s, Limit: %s\n", category, sort, limit)

		// Return a response
		return c.SendString("Query parameters received")
	})

	log.Fatal(app.ListenTLS(":8080", "./cert.pem", "./key.pem"))
}
