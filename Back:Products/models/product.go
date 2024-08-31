package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
	// "go.mongodb.org/mongo-driver/mongo/options"
)

type Guarantee struct {
	Title string
	Desc  string
}

type rating struct {
	Rate    float32
	RateNum int
}

type dimentions struct {
	Length int
	Width  int
	Height int
}

type pros_cons struct {
	Pros []string
	Cons []string
}

type sellerQuantity struct {
	Color    string
	Quantity int
}

type ShipmentMethod int

const (
	Digi_Kala ShipmentMethod = iota + 1
	WhereHouse
)

func (d ShipmentMethod) String() string {
	return [...]string{"Digi_Kala", "WhereHouse"}[d-1]
}

func (d ShipmentMethod) EnumIndex() int {
	return int(d)
}

type seller struct {
	SellerID       primitive.ObjectID
	SellerTitle    string
	SellerRating   float32
	SellerQuantity sellerQuantity
	Guarantees     []Guarantee
	ShipmentMethod ShipmentMethod
	DiscountID     primitive.ObjectID
	Price          int
}

type productDetail struct {
	Title string
	Map   map[string]string
}

type Product struct {
	ID          primitive.ObjectID `json:"_id,omitempty" bson:"_id,omitempty"`
	SellCount   int                `json:"sell_count" bson:"sell_count"`
	VisitCount  int                `json:"visit_count" bson:"visit_count"`
	Vists       []time.Time        `json:"visits" bson:"visits"`
	Title       string             `json:"title" bson:"title"`
	Sellers     []seller           `json:"sellers" bson:"sellers"`
	Rating      rating             `json:"rating" bson:"rating"`
	BrandID     primitive.ObjectID `json:"brand_id" bson:"brand_id"`
	Is_original bool               `json:"is_original" bson:"is_original"`
	CategoryID  primitive.ObjectID `json:"category_id" bson:"category_id"`
	Details     []productDetail    `json:"details,omitempty" bson:"details,omitempty"`
	IsFromIran  bool               `json:"is_from_iran" bson:"is_from_iran"`
	Images      []string           `json:"images" bson:"images"`
	Dimentions  dimentions         `json:"dimentions" bson:"dimentions"`
	Weight_KG   int                `json:"weight_KG" bson:"weight_KG"`
	Description string             `json:"description" bson:"description"`
	ProsNCons   pros_cons          `json:"pros&cons,omitempty" bson:"pros&cons,omitempty"`
	// Guarantees  []Guarantee        `json:"guarantees" bson:"guarantees"`
	// Price       int                `json:"price" bson:"price"`
	// DiscountID  primitive.ObjectID `json:"discount_id,omitempty" bson:"discount_id,omitempty"`
	// Color       string             `json:"color" bson:"color"`
}
