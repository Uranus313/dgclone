package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type CommentType int

const (
	RegularComment CommentType = iota + 1
	Answer
	Question
)

func (d CommentType) String() string {
	return [...]string{"Comment", "Answer", "Question"}[d-1]
}

func (d CommentType) EnumIndex() int {
	return int(d)
}

type LikeOrDisslike struct {
	UserID primitive.ObjectID
	Liked  bool
}

type Comment struct {
	ID                primitive.ObjectID `json:"_id,omitempty" bson:"_id,omitempty"`
	CommentType       CommentType        `json:"comment_type" bson:"comment_type"`
	AnswersTo         primitive.ObjectID `json:"answers_to,omitempty" bson:"answers_to,omitempty"` // answers
	ProductID         primitive.ObjectID `json:"product_id" bson:"product_id"`
	OrderID           primitive.ObjectID `json:"order_id,omitempty" bson:"order_id,omitempty"` // regular comments
	UserID            primitive.ObjectID `json:"user_id" bson:"user_id"`
	Content           string             `json:"content" bson:"content"`
	Pictures          []string           `json:"pictures,omitempty" bson:"pictures,omitempty"` // regular comments
	Videos            []string           `json:"videos,omitempty" bson:"videos,omitempty"`     // regular comments
	LikesAndDisslikes []LikeOrDisslike   `json:"likes&disslikes" bson:"likes&disslikes"`
	DateSent          time.Time          `json:"date_sent" bson:"date_sent"`
}
