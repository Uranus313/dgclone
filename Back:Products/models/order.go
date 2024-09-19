package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type order_product struct {
	ProdID    primitive.ObjectID
	Price     int
	Color     string
	Guarantee Guarantee
	SellerID  primitive.ObjectID
	Picture   string
}

type StateType int

const (
	Delivered StateType = iota + 1
	Pending
	Canceled
	Returned
	PreparingOrder
	Transit
	NotOrdered
)

func (d StateType) String() string {
	return [...]string{"delivered", "pending", "canceled", "returned", "preparingOrder", "transit", "notOrdered"}[d-1]
}

func (d StateType) EnumIndex() int {
	return int(d)
}

type Order struct {
	ID          primitive.ObjectID `json:"_id,omitempty" bson:"_id,omitempty"`
	Product     order_product      `json:"product" bson:"product"`
	Quantity    int                `json:"quantity" bson:"quantity"`
	UserID      primitive.ObjectID `json:"user_id" bson:"user_id"`
	Rate        int                `json:"rate,omitempty" bson:"rate,omitempty"`
	State       StateType          `json:"state" bson:"state"`
	ReceiveDate time.Time          `json:"receive_date,omitempty" bson:"receive_date,omitempty"`
}
