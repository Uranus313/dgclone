package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type DiscountProd struct {
	ProdID        primitive.ObjectID `json:"prod_id" bson:"prod_id"`
	SellerID      primitive.ObjectID `json:"seller_id" bson:"seller_id"`
	OriginalPrice int                `json:"original_price" bson:"original_price"`
}

type SaleDiscount struct {
	ID       primitive.ObjectID `json:"_id,omitempty" bson:"_id,omitempty"`
	Prod     DiscountProd       `json:"prod" bson:"prod"`
	NewPrice int                `json:"new_price" bson:"new_price"`
	EndDate  time.Time          `json:"end_date" bson:"end_date"`
}
