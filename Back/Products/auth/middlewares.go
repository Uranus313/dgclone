package auth

import "github.com/gofiber/fiber/v2"

func AuthMiddleware(mode string) fiber.Handler {

	return func(c *fiber.Ctx) error {

		token := c.Cookies("x-auth-token")

		body, statusCode, err := AuthenticateToken(token)

		if err != nil || statusCode != 200 {
			return c.Status(statusCode).JSON(fiber.Map{
				"message": "Authentication Failed",
				"error":   err.Error(),
			})
		}

		if body["status"].(string) != mode {
			return c.Status(403).JSON(fiber.Map{"error": "you do not have access to this method"})
		}

		c.Locals("ent", body)

		return c.Next()
	}
}

// func UserAuthMiddleware(c *fiber.Ctx) error {

// 	token := c.Cookies("x-auth-token")

// 	body, statusCode, err := AuthenticateToken(token)

// 	if err != nil || statusCode != 200 {
// 		return c.Status(statusCode).JSON(fiber.Map{
// 			"message": "Authentication Failed",
// 			"error":   err.Error(),
// 		})
// 	}

// 	if body["status"].(string) != "user" {
// 		return c.Status(403).JSON(fiber.Map{"error": "you do not have access to this method"})
// 	}

// 	c.Locals("ent", body)

// 	return c.Next()
// }

// func SellerAuthMiddleware(c *fiber.Ctx) error {

// 	token := c.Cookies("x-auth-token")

// 	body, statusCode, err := AuthenticateToken(token)

// 	if err != nil || statusCode != 200 {
// 		return c.Status(statusCode).JSON(fiber.Map{
// 			"message": "Authentication Failed",
// 			"error":   err.Error(),
// 		})
// 	}

// 	if body["status"].(string) != "seller" {
// 		return c.Status(403).JSON(fiber.Map{"error": "you do not have access to this method"})
// 	}

// 	c.Locals("ent", body)

// 	return c.Next()
// }

// func AdminAuthMiddleware(c *fiber.Ctx) error {

// 	token := c.Cookies("x-auth-token")

// 	body, statusCode, err := AuthenticateToken(token)

// 	if err != nil || statusCode != 200 {
// 		return c.Status(statusCode).JSON(fiber.Map{
// 			"message": "Authentication Failed",
// 			"error":   err.Error(),
// 		})
// 	}

// 	if body["status"].(string) != "admin" {
// 		return c.Status(403).JSON(fiber.Map{"error": "you do not have access to this method"})
// 	}

// 	c.Locals("ent", body)

// 	return c.Next()
// }

// func EmployeeAuthMiddleware(c *fiber.Ctx) error {

// 	token := c.Cookies("x-auth-token")

// 	body, statusCode, err := AuthenticateToken(token)

// 	if err != nil || statusCode != 200 {
// 		return c.Status(statusCode).JSON(fiber.Map{
// 			"message": "Authentication Failed",
// 			"error":   err.Error(),
// 		})
// 	}

// 	if body["status"].(string) != "employee" {
// 		return c.Status(403).JSON(fiber.Map{"error": "you do not have access to this method"})
// 	}

// 	c.Locals("ent", body)

// 	return c.Next()
// }
