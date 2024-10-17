package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
	// "go.mongodb.org/mongo-driver/mongo/options"
)

// type Guarantee struct {
// 	Title string `json:"title" bson:"title"`
// 	Desc  string `json:"desc" bson:"desc"`
// }

type Rating struct {
	Rate    float32 `json:"rate" bson:"rate"`
	RateNum int     `json:"rate_num" bson:"rate_num"`
}

type Dimentions struct {
	Length int `json:"length" bson:"length"`
	Width  int `json:"width" bson:"width"`
	Height int `json:"height" bson:"height"`
}

type Pros_cons struct {
	Pros []string `json:"pros" bson:"pros"`
	Cons []string `json:"cons" bson:"cons"`
}

type SellerQuantity struct {
	Color           Color           `json:"color" bson:"color"`
	Quantity        int             `json:"quantity" bson:"quantity"`
	Guarantee       Guarantee       `json:"guarantee" bson:"guarantee"`
	ValidationState ValidationState `json:"validation_state" bson:"validation_state"`
}

type ShipmentMethod int

const (
	Digi_Kala ShipmentMethod = iota + 1
	WareHouse
)

func (d ShipmentMethod) String() string {
	return [...]string{"Digi_Kala", "WareHouse"}[d-1]
}

func (d ShipmentMethod) EnumIndex() int {
	return int(d)
}

type ValidationState int

const (
	PendingValidation ValidationState = iota + 1
	Validated
	Banned
)

func (d ValidationState) String() string {
	return [...]string{"PendingValidation", "Validated", "Banned"}[d-1]
}

func (d ValidationState) EnumIndex() int {
	return int(d)
}

type SellerCart struct {
	SellerID       primitive.ObjectID `json:"seller_id" bson:"seller_id"`
	SellerTitle    string             `json:"seller_title" bson:"seller_title"`
	SellerRating   float64            `json:"seller_rating" bson:"seller_rating"`
	SellerQuantity []SellerQuantity   `json:"seller_quantity" bson:"seller_quantity"`
	ShipmentMethod ShipmentMethod     `json:"shipment_method" bson:"shipment_method"`
	DiscountID     primitive.ObjectID `json:"discount_id" bson:"discount_id"`
	Price          int                `json:"price" bson:"price"`
}

type ProductDetail struct {
	Title string            `json:"title" bson:"title"`
	Map   map[string]string `json:"map" bson:"map"`
}

type Product struct {
	ID          primitive.ObjectID `json:"_id,omitempty" bson:"_id,omitempty"`
	SellCount   int                `json:"sell_count" bson:"sell_count"`
	VisitCount  int                `json:"visit_count" bson:"visit_count"`
	Vists       []time.Time        `json:"visits" bson:"visits"`
	Title       string             `json:"title" bson:"title"`
	Sellers     []SellerCart       `json:"sellers" bson:"sellers"`
	Rating      Rating             `json:"rating" bson:"rating"`
	BrandID     primitive.ObjectID `json:"brand_id" bson:"brand_id"`
	Is_original bool               `json:"is_original" bson:"is_original"`
	CategoryID  primitive.ObjectID `json:"category_id" bson:"category_id"`
	Details     []ProductDetail    `json:"details,omitempty" bson:"details,omitempty"`
	IsFromIran  bool               `json:"is_from_iran" bson:"is_from_iran"`
	Images      []string           `json:"images" bson:"images"`
	Dimentions  Dimentions         `json:"dimentions" bson:"dimentions"`
	Weight_KG   float32            `json:"weight_KG" bson:"weight_KG"`
	Description string             `json:"description" bson:"description"`
	// ProsNCons       Pros_cons          `json:"pros&cons,omitempty" bson:"pros&cons,omitempty"`
	DateAdded       time.Time       `json:"date_added" bson:"date_added"`
	ValidationState ValidationState `json:"validation_state" bson:"validation_state"`
	// Guarantees  []Guarantee        `json:"guarantees" bson:"guarantees"`
	// Price       int                `json:"price" bson:"price"`
	// DiscountID  primitive.ObjectID `json:"discount_id,omitempty" bson:"discount_id,omitempty"`
	// Color       string             `json:"color" bson:"color"`
}

type UpdatableProd struct {
	// Patch => edit product -> title, desc, images, details, dimentions, weight, pros&cons
	ID          primitive.ObjectID `json:"id"`
	Title       string             `json:"title"`
	Description string             `json:"description"`
	Images      []string           `json:"images"`
	Details     []ProductDetail    `json:"details"`
	Dimentions  Dimentions         `json:"dimentions"`
	Weight_KG   float32            `json:"weight_kg"`
	// ProsNCons   Pros_cons          `json:"pros&cons"`
}

type ProductCard struct {
	ID          primitive.ObjectID
	Title       string
	Price       int
	Picture     string
	DiscountID  primitive.ObjectID
	SellerCount int
	UrbanPrice  int
	Commission  int
	CategoryID  primitive.ObjectID
}
