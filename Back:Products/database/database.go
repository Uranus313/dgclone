package database

import (
	"context"
	"log"
	"os"

	// "github.com/joho/godotenv"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var Client *mongo.Client

func Connect_Client() {

	log.Println("Initilizing Connection")

	// err := godotenv.Load(".env")

	// if err != nil {
	// 	log.Fatal("error while loading .env file:", err)
	// }

	var MongoDB_URI string = os.Getenv("MongoDB_URI")

	// log.Println(MongoDB_URI)

	var err error

	clientOptions := options.Client().ApplyURI(MongoDB_URI)
	Client, err = mongo.Connect(context.Background(), clientOptions)

	if err != nil {
		log.Fatal(err)
	}

	// defer Client.Disconnect(context.Background())

	err = Client.Ping(context.Background(), nil)

	if err != nil {
		log.Fatal(err)
	}

	log.Println("Database Connection Succesfull")
}
