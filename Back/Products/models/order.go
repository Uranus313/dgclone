package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type OrderProduct struct {
	ProdID    primitive.ObjectID `json:"prod_id" bson:"prod_id"`
	Title     string             `json:"title" bson:"title"`
	Price     int                `json:"price" bson:"price"`
	Color     Color              `json:"color" bson:"color"`
	Guarantee Guarantee          `json:"guarantee" bson:"guarantee"`
	SellerID  primitive.ObjectID `json:"seller_id" bson:"seller_id"`
	Picture   string             `json:"picture" bson:"picture"`
}

type StateType int

const (
	Delivered StateType = iota + 1
	Pending
	Canceled
	Returned
	RecievedInWareHouse
)

func (d StateType) String() string {
	return [...]string{"delivered", "pending", "canceled", "returned", "recievedInWareHouse"}[d-1]
}

func (d StateType) EnumIndex() int {
	return int(d)
}

type Order struct {
	ID          primitive.ObjectID `json:"_id,omitempty" bson:"_id,omitempty"`
	Product     OrderProduct       `json:"product" bson:"product"`
	Quantity    int                `json:"quantity" bson:"quantity"`
	UserID      primitive.ObjectID `json:"user_id" bson:"user_id"`
	Rate        int                `json:"rate,omitempty" bson:"rate,omitempty"`
	State       StateType          `json:"state" bson:"state"`
	ReceiveDate time.Time          `json:"receive_date,omitempty" bson:"receive_date,omitempty"`
	OrderDate   time.Time          `json:"order_date" bson:"order_date"`
}
