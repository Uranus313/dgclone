package models

import (
	"go.mongodb.org/mongo-driver/bson/primitive"
	// "go.mongodb.org/mongo-driver/mongo/options"
)

type detail struct {
	Title string
	List  []detail
}

type Category struct {
	ID       primitive.ObjectID   `json:"_id,omitempty" bson:"_id,omitempty"`
	Title    string               `json:"title" bson:"title"`
	ParentID primitive.ObjectID   `json:"parent_id" bson:"parent_id"`
	Childs   []primitive.ObjectID `json:"childs" bson:"childs"`
	Detail   []detail             `json:"details" bson:"details"`
	Pictures []string             `json:"pictures,omitempty" bson:"pictures,omitempty"`
}
