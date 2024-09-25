package models

import (
	"go.mongodb.org/mongo-driver/bson/primitive"
	// "go.mongodb.org/mongo-driver/mongo/options"
)

type Color struct {
	ID    primitive.ObjectID `json:"_id,omitempty" bson:"_id,omitempty"`
	Title string             `json:"title" bson:"title"`
	Hex   string             `json:"hex" bson:"hex"`
}
