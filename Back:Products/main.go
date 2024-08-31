package main

import (
	"context"
	"dg-kala-sample/crud"
	"dg-kala-sample/database"
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

	app := fiber.New()

	app.Use(cors.New(cors.Config{
		AllowOrigins: "http://localhost:5173, http://localhost:3000",
		AllowHeaders: "Origin,Content-Type,Accept,Authorization",
		AllowMethods: "*",
	}))
	app.Use(logger.New())

	app.Get("/products/comments/:ProdID", crud.GetCommentsByProductID)

	app.Post("/products/comments", crud.PostComment)

	app.Patch("/products/comments/:CommentID", crud.UpdateCommentScore)

	// app.Get("/products/products", crud.GetAllProducts)

	app.Get("/products/products/:ProdID", crud.GetProductByID)

	app.Post("/products/products", crud.AddProduct)

	app.Post("/products/order", crud.AddOrder)

	app.Get("/products/order/orderhistory/:OHID")

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

	log.Fatal(app.Listen(":8080"))

}
