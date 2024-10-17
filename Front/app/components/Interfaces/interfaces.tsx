import { BooleanExpression } from "ol/style/flat";

export interface ProductCardInterface {
    id: string,
    title: string,
    price: number,
    picture: string,
    discountID?: string
}

export enum shipmentMethod {
    option1 = 'o1',
    option2 = 'o2',
    option3 = 'o3',
}

export interface Quantity{
   color: Color,
   quantity: number,
   guarantee: { title: string, _id: string },
   validation_state?: number //1 pending 2 validated 3 banned
}

export interface SellerInfosOnProduct {
    seller_id: string,
    seller_title: string,
    seller_rating: number
    seller_quantity:Quantity[], //1 pending 2 validated 3 banned
    price: number,
    shipment_method?: number, //1 digi 2 warehouise
    discount_id?: string,

}

export interface ProductVariant {
    _id: string,
    category_id: string,
    seller_id: string,
    seller_title: string,
    seller_rating: number
    seller_quantity:Quantity, 
    price: number,
    shipment_method?: number, //1 digi 2 warehouise
    discount_id?: string,
}

export interface Ticket {
    _id: string;
    isSeen: boolean;
    content: string;
    title: string;
    orderID: string;
    sellerID: string;
    userID: string;
    employeeID: string;
    adminID: string;
    date: string;
    importance: string
}

export interface Order {
    _id?: string,
    product: {
        prod_id: string,
        price: number,
        color: Color,
        garantee: {_id:string , title:string},
        seller_id?: string,
        picture: string,
        title: string
    },
    quantity: number,
    user_id?: string,
    rate?: number,
    state?: State,
    order_date?: string
    receive_date?: string
}


export interface OrdersHistory {
    _id?: string
    userid: string,
    orders: Order[]
    ordersdate: string
    recievedate: string
    state?: State,
    price: number,
    discount?: number,
    address?: Address
}


export interface AccessLevel {
    name: string;
    title: string;
}
export interface AccessLevels {
    level: string,
    writeAccess: boolean
}
export interface Role {
    name: string,
    accessLevels: [
        {
            level: string,
            writeAccess: boolean
        }
    ],
    _id: string
}

export enum UserStatus {
    user = 'user',
    employee = 'employee',
    admin = 'admin',
    seller = 'seller',
}
export interface User {
    [key: string]: any;
    status: UserStatus
    firstName: string | null | undefined;
    roleID: Role | null | undefined;
    lastName: string | null | undefined;
    isBanned: boolean | undefined;
    email: string | null | undefined;
    birthDate: string | null | undefined;
    nationalID: string | null | undefined;
    phoneNumber: string;
    _id: string;
    job: string | null | undefined;
    economicCode: string | null | undefined;
    walletID: string;
    moneyReturn: {
        _id: string,
        method: "bankAccount" | "wallet";
        bankAccount: string | null | undefined;
    };
    shoppingCart:string[];
    addresses: Address[];
}

export interface Address {
    country: string;
    province: string;
    city: string;
    postalCode: string;
    additionalInfo: string | null | undefined;
    number: string;
    unit: string | null | undefined;
    coordinates: {
        x: string;
        y: string;
    };
    receiver: {
        firstName: string;
        lastName: string;
        phoneNumber: string;
    };
}


export interface SellerSetVarientOnProduct {
    sellerID: string,
    productID: string,
    productTitle: string,
    productPicture: string,
    color: { title: string, hex: string },
    quantity: number,
    garante: string,
    shipmentMethod?: shipmentMethod,

}

export interface details {
    title: string, map: { [key: string]: string }
}


export interface ProductInterface {
    _id?: string,
    sell_count: number | undefined,
    date_added?: string | undefined,
    brand_id: string | undefined,
    visit_count: number,
    visits: string[],
    title: string
    sellers: SellerInfosOnProduct[],
    rating: { rate: number, rate_num: number },
    category_id: string,
    details: details[],
    is_from_iran: boolean,
    is_original: boolean,
    images: string[],
    dimentions: { length: number, width: number, height: number },
    weight_KG: number,
    description?: string,
    validation_state: number

}



export enum commentType { comment = 'comment', answer = 'answer', question = 'question' }

export interface Comment {
    answers?: Comment[]  //for question comments
    _id?: string
    answers_to?:string
    product_id?: string
    order_id?:string
    rate?: number //for buyers
    order?: { color: { title: string, hex: string }, sellerTitle: string } //for normal comments
    user?: { userid: string, firstname: string, lastname: string }
    user_id?: string
    content?: string
    'likes&disslikes'?: { userid: string, disOlike: boolean }[] //for questions
    date_sent?: Date
    comment_type?: number
    validation_state?: number
}

export enum State { returned = 'returned', canceled = 'canceled', pending = 'pending', delivered = 'delivered', recivedInWareHouse = 'recivedInWareHouse' }

export enum notifTypeUser { info = 'info', order = 'order', recommend = 'recommend' }
export enum notifTypeSeller { question = 'پرسش', order = 'سفارش', info = 'عمومی' }

export interface NotificationSeller {
    notificationID: string
    sellerID: string
    selleremail?: string
    sellerphone: number
    content: string
    type: notifTypeSeller
    seen: boolean
    dateSent: string
}

export interface NotificationUser {
    notificationID: string
    userid: string
    useremail: string
    userphone: number
    content: string
    type: notifTypeUser
    seen: boolean
    dateSent: string
}

export enum TransactionSide { digikala = 'digiMarket', user = 'user', seller = 'seller', giftCard = 'giftCard' }
export enum SenderType { bankAccount = "bankAccount", wallet = "wallet" }

export interface Transaction {
    _id:string
    userid: string,
    money: number,
    title: string,
    additionalinfo?: string,
    sender: {
        entityType: SenderType,
        bankAccount: string | null,
        senderID?: string,
        additionalInfo: string | null,
    }

    receiver: {
        entityType: TransactionSide,
        bankAccount: string | null,
        receiverID?: string,
        additionalInfo: string | null,
    }
    orderHistoryID: string,
    date: string,
}

//#region seller
export interface VerifyRequest {
    sellerID: string,
    adminID: string | undefined,
    requestDate: string | undefined,
    state: "pending" | "accepted" | "rejected" | undefined,
    _id: string
}

export enum EntitiyType {
    individual = "individual",
    legal = "legal",
}

export enum companyType {
    publicCompany = "publicCompany",
    privateCompany = "privateCompany",
    limitedLiability = "limitedLiability",
    cooperative = "cooperative",
    jointLiability = "jointLiability",
    institution = "institution",
    other = "other",
}

export enum bankNumberType { shaba = "shaba", bank = "bank" }
export enum moneyReturn { bankAccount = "bankAccount", wallet = "wallet" }
export interface Seller {
    _id?: string
    status?:string
    isVerified:boolean,
    [key: string]: any;
    rating: number
    sellerID: string
    password: string
    storeOwner?: {
        _id?: string
        id?: string
        firstName: string,
        lastName: string,
        birthDate: string,
        email: string,
        nationalID: string,
    },
    isCompelete: boolean,
    phoneNumber: string,
    entityType?: EntitiyType,

    legalInfo?: {
        _id?: string
        id?: string
        companyIDNumber: string,
        companyEconomicNumber: string,
        shabaNumber: number,
        signOwners: string[],
        storeName: string
    },

    additionalDocuments?: string[],

    individualInfo?: {
        _id?: string
        id?: string
        nationalID: number,
        bankNumberType: bankNumberType,
        shabaNumber: number,
        bankNumber: number,
    },
    storeInfo?: {
        _id?: string
        id?: string
        commercialName: string
        officePhoneNumber: number,
        logo?: string,
        sellerCode: string,
        aboutSeller: string,
        sellerWebsite: string
    },

    walletID?: string,

    moneyReturn?: {
        _id: string
        method: moneyReturn
        bankAccount: number
    },
    storeAddress?: Address

    // productList: ProductInterface[],
    // saleHistory: Order[],
    // socialInteractions : Comment[],
    recentNotifications: NotificationSeller[],
    // transactionHistory:Transaction[]

    saleInfo: {
        sold: number
        income: number
        productCount: number
    }
    ordersInfo: {
        pastAndTodayShipmentCommitment: number
        tomorrowAndFutureShipmentCommitment: number
        todaysOrders: number
        canceledOrders: number
    }

    recentSaleChart: { income: number, date: string }[]
}

export enum StateProduct {
    accepted = 'پذیرفته شده',
    rejected = 'لغو شده',
    inCheckingOrder = 'در صف بررسی'

}

export interface ProductCardSeller {
    title: string,
    categoryTitle: string,
    categoryID: string,
    productID: string,
    brand: string,
    state: StateProduct,
    varientCount: number,
    picture: string,
}

export interface SellerOrderCard {
    title: string,
    productID: string,
    orderID: string,
    orderDate: string,
    orderState: State,
    productPicture: string,
    productCategorytitle: string,
    productCategoryID: string,
    productFinalPrice: number,
}

export interface SellerAddProdctCard {
    Picture: string,
    Title: string,
    Commission: number,
    Price:number,
    UrbanPrice: number,//price that the first seller put
    SellerCount: number,
    ID: string
    CategoryID:string
}

//#endregion

export interface Color {
    _id?: string,
    title: string,
    hex: string
}

export interface Brand {
    title: string,
    _id: string,
}

export interface productSaleAnalyseCard {
    productID: string,
    picture: string,
    productTitle: string,
    categoryID: string,
    categoryTitle: string,
    title:string
    brand:string
    state:number
    varientCount:number
    totalSellPrice:number
    totalSellCount:number
    viewCount:number
    sellerCart:SellerInfosOnProduct
}

export interface Category {
    ID?: string,
    _id: string,
    title: string,
    Title: string,
    Childs?: Category[],
    Detail: detail[],
    CommisionPercentage: number,
    ParentID?: string,
    Pictures: string[],
    Description?: string,
    Link?: string,
    Theme?: string
}

export interface detail {
    title: string,
    keys: string[]
}

