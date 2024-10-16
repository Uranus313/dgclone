package auth

import (
	"fmt"
	"net/http"

	"github.com/gofiber/fiber/v2"
)

func AuthMiddleware(modes []string) fiber.Handler {

	return func(c *fiber.Ctx) error {

		token := c.Cookies("x-auth-token")
		salam := c.Cookies("salam")

		fmt.Println("salam:", salam)

		fmt.Println("token:", token)

		body, statusCode, err := AuthenticateToken(token)

		if err != nil || statusCode != http.StatusOK {
			return c.Status(statusCode).JSON(fiber.Map{
				"message": "Authentication Failed",
				"error":   err.Error(),
			})
		}

		var modeApproved bool = false

		fmt.Println("body:",body)
		fmt.Println("\n\n\nstatus:"+body["status"].(string)+"-saal")
		for _, mode := range modes {
			if body["status"].(string) == mode {
				modeApproved = true
				break
			}
		}

		if !modeApproved {
			return c.Status(http.StatusForbidden).JSON(fiber.Map{"error": "you do not have access to this method"})
		}

		c.Locals("ent", body)

		return c.Next()
	}
}

func InnerAuth(c *fiber.Ctx) error {

	if c.Get("inner-secret") != InnerPass {
		return c.Status(http.StatusForbidden).JSON(fiber.Map{"error": "Invalid Inner Password"})
	}

	return c.Next()
}

type AccessLevel struct {
	level       string
	writeAccess bool
}

func EmployeeAccessLevel(accessLevels []AccessLevel) fiber.Handler {

	return func(c *fiber.Ctx) error {

		ent := c.Locals("ent").(map[string]interface{})

		if ent["status"].(string) != "employee" {
			return c.Next()
		}

		for _, accessLevel := range accessLevels {
			accessLevelFound := false
			for _, employeeAccessLevel := range ent["roleID"].(map[string]interface{})["accessLevels"].([]map[string]interface{}) {
				if accessLevel.level == employeeAccessLevel["level"].(string) {
					if accessLevel.writeAccess != employeeAccessLevel["writeAccess"].(bool) {
						return c.Status(http.StatusForbidden).JSON(fiber.Map{"error": "employee does not have write access to " + accessLevel.level})
					}
					accessLevelFound = true
					break
				}
			}
			if !accessLevelFound {
				return c.Status(http.StatusForbidden).JSON(fiber.Map{"error": "employee does not have access to " + accessLevel.level})
			}
		}

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
