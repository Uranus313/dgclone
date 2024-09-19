package database

import (
	// "context"

	"log"

	// "go.mongodb.org/mongo-driver/bson"

	"go.mongodb.org/mongo-driver/mongo"
	// "go.mongodb.org/mongo-driver/mongo/options"
)

var ProductCollection *mongo.Collection
var CategoryCollection *mongo.Collection
var CommentCollection *mongo.Collection
var OrderCollection *mongo.Collection
var OrderHistoryCollection *mongo.Collection
var BrandCollection *mongo.Collection
var DiscountCodeCollection *mongo.Collection
var SaleDiscountCollection *mongo.Collection

func DeployCollections() {

	Connect_Client()

	ProductCollection = Client.Database("dg-kala-sample").Collection("products")
	CategoryCollection = Client.Database("dg-kala-sample").Collection("categories")
	CommentCollection = Client.Database("dg-kala-sample").Collection("comments")
	OrderCollection = Client.Database("dg-kala-sample").Collection("orders")
	OrderHistoryCollection = Client.Database("dg-kala-sample").Collection("orders_history")
	BrandCollection = Client.Database("dg-kala-sample").Collection("brands")
	DiscountCodeCollection = Client.Database("dg-kala-sample").Collection("discount_codes")
	SaleDiscountCollection = Client.Database("dg-kala-sample").Collection("sale_discounts")

	log.Println("Collections Deployed Succesfully")

}

// -- making code unique in discount code collection --
// indexModel := mongo.IndexModel{
// 	Keys:    bson.M{"code": 1},
// 	Options: options.Index().SetUnique(true),
// }
// _, err := DiscountCodeCollection.Indexes().CreateOne(context.Background(), indexModel)
// if err != nil {
// 	log.Fatal("error while adding index: ", err)
// }
// log.Println("unique index added to discount code collection")
