package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type discountProd struct {
	ProdID        primitive.ObjectID `json:"prod_id" bson:"prod_id"`
	OriginalPrice int                `json:"original_price" bson:"original_price"`
}

type SaleDiscount struct {
	ID       primitive.ObjectID `json:"_id,omitempty" bson:"_id,omitempty"`
	Prod     discountProd       `json:"prod" bson:"prod"`
	NewPrice int                `json:"new_price" bson:"new_price"`
	EndDate  time.Time          `json:"end_date" bson:"end_date"`
}
