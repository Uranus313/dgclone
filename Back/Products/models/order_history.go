package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type OrderHistory struct {
	ID               primitive.ObjectID   `json:"_id,omitempty" bson:"_id,omitempty"`
	UserID           primitive.ObjectID   `json:"user_id" bson:"user_id"`
	OrdersList       []primitive.ObjectID `json:"orders_list" bson:"orders_list"`
	OrderHistoryDate time.Time            `json:"orderhistory_date" bson:"orderhistory_date"`
	ReceiveDate      time.Time            `json:"receive_date,omitempty" bson:"receive_date,omitempty"`
	State            StateType            `json:"state" bson:"state"`
	TotalPrice       int                  `json:"total_price" bson:"total_price"`
	TotalDisscount   int                  `json:"total_disscount" bson:"total_disscount"`
	Address          map[string]any       `json:"address" bson:"address"`
}
