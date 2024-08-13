package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type SaleDiscount struct {
	ID       primitive.ObjectID `json:"_id,omitempty" bson:"_id,omitempty"`
	ProdID   primitive.ObjectID `json:"prod_id" bson:"prod_id"`
	NewPrice int                `json:"new_price" bson:"new_price"`
	EndDate  time.Time          `json:"end_date" bson:"end_date"`
}
