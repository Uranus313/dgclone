package auth

import (
	"encoding/json"
	"errors"
	"io"
	"net/http"
	"os"
	// "go.mongodb.org/mongo-driver/bson"
	// "go.mongodb.org/mongo-driver/bson/primitive"
)

// adding different methods for different entities ???

func AuthenticateToken(token string) (map[string]interface{}, int, error) {

	innerPass := os.Getenv("")

	// const API_URI string = "http://userapi/users/general/checkToken"
	const API_URI string = "http://localhost:3005/users/general/checkToken"

	req, err := http.NewRequest("GET", API_URI, nil)

	if err != nil {
		return nil, 500, err
	}

	req.Header.Add("x-auth-token", token)
	req.Header.Add("", innerPass)

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

	if res.StatusCode != 200 {
		return nil, res.StatusCode, errors.New(responseBody["err_message"].(string))
	}

	return responseBody, 200, nil
}
