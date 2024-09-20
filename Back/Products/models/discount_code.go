package models

import (
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type DiscountUser struct {
	UserID  primitive.ObjectID
	Is_used bool
}

type DiscountCode struct {
	ID            primitive.ObjectID `json:"_id,omitempty" bson:"_id,omitempty"`
	Code          string             `json:"code" bson:"code"`
	FloorPrice    int                `json:"floor_price" bson:"floor_price"`
	DiscountUsers []DiscountUser     `json:"discount_users" bson:"discount_users"`
	Value         int                `json:"value" bson:"value"`
}
