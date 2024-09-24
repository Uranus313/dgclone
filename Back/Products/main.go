package main

import (
	"context"
	"dg-kala-sample/crud"
	"dg-kala-sample/database"

	// fakerdata "dg-kala-sample/fakerData"

	"log"
	"strings"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/joho/godotenv"
)

func main() {

	err := godotenv.Load(".env")

	if err != nil {
		log.Fatal("error while loading .env file:", err)
	}

	database.DeployCollections()

	defer database.Client.Disconnect(context.Background())

	// fakerdata.InsertDummyBrands()
	// fakerdata.InsertDummyCategories()
	// fakerdata.ModifyCategory()
	// fakerdata.InsertDummyProducts()
	// fakerdata.InsertDummyComments()
	// fakerdata.InsertDummyDiscountCode()
	// fakerdata.InsertDummySaleDiscount()

	app := fiber.New()

	app.Use(cors.New(cors.Config{
		AllowOrigins: "http://localhost:5173, http://localhost:3000",
		AllowHeaders: "Origin,Content-Type,Accept,Authorization",
		AllowMethods: "*",
	}))
	app.Use(logger.New())

	// ------------comemnts------------

	app.Get("/products/comments", crud.GetCommentsByProductID) // query params => limit, offset, ProdID

	app.Post("/products/comments", crud.PostComment) // --unchecked

	app.Patch("/products/comments/:CommentID", crud.UpdateCommentScore)

	app.Get("/products/questions", crud.GetProductQuestions) // query params => limit, offset, ProdID

	app.Get("/products/comments/pending", crud.GetPendingComments) // query params => limit, offset

	app.Patch("/products/validate-comments", crud.UpdateCommentValidationState) // query params => CommentID, ValidationState

	// ------------products-------------

	// app.Get("/products/product", crud.GetAllProducts)

	app.Get("/products/product/:ProdID", crud.GetProductByID)

	app.Post("/products/product", crud.AddProduct)

	app.Patch("/products/product/AddSeller", crud.AddSellerToProduct) // query params => SellerID, ProdID --unchecked

	app.Patch("/products/product/UpdateRating", crud.UpdateProductRating) // query params => ProductID, Rating

	app.Patch("/products/product/UpdateQuantity", crud.UpdateProdQuantity) // query params => ProductID, SellerID, Quantity, Color --unchecked

	app.Delete("/products/product/:ProdID", crud.DeleteProductByID)

	app.Patch("/products/product", crud.EditProduct)

	app.Get("/products/product", crud.InfiniteScrolProds) // query params => limit, offset, CateID

	// --------------category-----------------

	app.Post("/products/category", crud.AddCategory)

	app.Get("/products/category", crud.GetAllCategories)

	app.Get("/products/category/:CateID", crud.GetCategoryByID)

	app.Patch("/products/category/:CateID", crud.EditCategory)

	// -------------brand---------------

	app.Post("/products/brand", crud.AddBrand)

	app.Get("/products/brand/:BrandID", crud.GetBrandByID)

	app.Delete("/products/brand/:BrandID", crud.DeleteBrandByID)

	// ------------discount code-----------

	app.Post("/products/discountcode", crud.AddDiscountCode)

	app.Put("/products/discountcode", crud.UpdateUserDiscountCode) // query params => DCode, UserID

	// ------------sale discount-----------

	app.Get("/products/salediscount/MostDiscounts", crud.GetMostDiscounts) // query params => CateID

	app.Post("/products/salediscount", crud.AddSaleDiscount) // query params => ProdID, SellerID, EndDate, NewPrice | note. EndDate layout must be "yyyy-mm-dd 15:04:05" format

	// -------------orders--------------

	app.Post("/products/order", crud.AddOrder)

	app.Get("/products/order/orderhistory/:OHID", crud.GetOrdersInOrdersHistory)

	// -------------inner--------------

	app.Get("/products/inner/ProductMapAssign", crud.InnerProductMapAssign)

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

	log.Fatal(app.Listen(":8080"))

}
