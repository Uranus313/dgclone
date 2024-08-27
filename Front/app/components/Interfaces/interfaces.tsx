export interface ProductCardInterface{
    id:string,
    title:string,
    price:number,
    picture:string,
}

export enum shipmentMethod{
    option1 = 'o1',
    option2 = 'o2',
    option3 = 'o3',
}

export interface SellerInfosOnProduct{
    sellerid:string,
    sellerTitle:string,
    sellerRating:number
    quantity: {color:string,  quantity:number}[],
    garante:{title:string,desc:string},
    shipmentMethod:shipmentMethod,
    discountId?:string,
    price:number
}


export interface ProductInterface{
    id:string,
    sellcount:number,
    visitCount:number,
    visits:string[],
    title:string
    sellers:SellerInfosOnProduct[],
    rating: {rate:number,rateNum:number},
    brand:string,
    original:boolean,
    categoryID:string,
    details:{key:string , value:string}[],
    madeInIran:boolean
    images:string[] , 
    dimentions:{length:number , width:number , height:number} , 
    wieght:number , 
    description?: string, 
    prosNcons?:{pros:string[],cons:string[]},
}

export enum commentType{comment , answer, question}

export interface Comment{
    type: commentType
    answerto?:string  //for answer comments
    id:string
    productID:string
    orderID?:string //for normal comments
    userID:string
    content:string
    disAndlike:{userid:string,disOlike:boolean}[]
    dateSent:string
}

