package models

import (
	"go.mongodb.org/mongo-driver/bson/primitive"
	// "go.mongodb.org/mongo-driver/mongo/options"
)

type Detail struct {
	Title string   `json:"title" bson:"title"`
	Keys  []string `json:"keys" bson:"keys"`
}

type Category struct {
	ID                  primitive.ObjectID   `json:"_id,omitempty" bson:"_id,omitempty"`
	Title               string               `json:"title" bson:"title"`
	ParentID            primitive.ObjectID   `json:"parent_id" bson:"parent_id"`
	Childs              []primitive.ObjectID `json:"childs" bson:"childs"`
	Detail              []Detail             `json:"details" bson:"details"`
	Pictures            []string             `json:"pictures,omitempty" bson:"pictures,omitempty"`
	Description         string               `json:"description" bson:"description"`
	Link                string               `json:"link" bson:"link"`
	Theme               string               `json:"theme" bson:"theme"`
	CommisionPercentage int                  `json:"commision_percentage" bson:"commision_percentage"`
}

type UpdatableCategory struct {
	Title               string   `json:"title"`
	Details             []Detail `json:"details"`
	Pictures            []string `json:"pictures"`
	Description         string   `json:"description"`
	Link                string   `json:"link"`
	Theme               string   `json:"theme"`
	CommisionPercentage int      `json:"commision_percentage"`
}
