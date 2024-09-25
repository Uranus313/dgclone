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

export interface SellerInfosOnProduct {
    sellerid: string,
    sellerTitle: string,
    sellerRating: number
    quantity: { color: { title: string, hex: string }, quantity: number, garante: string }[],
    price: number,
    shipmentMethod?: shipmentMethod,
    discountId?: string,

}

export interface Ticket {
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
    _id: string,
    product: {
        productID: string,
        price: number,
        color: Color,
        garantee: string,
        sellerid: string,
        sellerTitle: string
        picture: string,
        productTitle: string
    },
    quantity: number,
    userid: string,
    rate?: number,
    state: State,
    ReciveDate: string,
}
export interface AccessLevel {
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


export interface ProductInterface {
    id?: string,
    sellcount: number,
    visitCount: number,
    visits: string[],
    title: string
    sellers: SellerInfosOnProduct[],
    rating: { rate: number, rateNum: number },
    brand: string,
    original: boolean,
    categoryID: string,
    details: { title: string, map: { key: string, value: string }[] }[],
    madeInIran: boolean
    images: string[],
    dimentions: { length: number, width: number, height: number },
    wieght: number,
    description?: string,
    prosNcons?: { pros: string[], cons: string[] },
    recentComments: Comment[]
}



export enum commentType { comment = 'comment', answer = 'answer', question = 'question' }

export interface Comment {
    type: commentType
    answers?: Comment[]  //for question comments
    id: string
    productID: string
    rate?: number //for buyers
    order?: { color: { title: string, hex: string }, sellerTitle: string } //for normal comments
    user: { userid: string, firstname: string, lastname: string }
    content: string
    disAndlike?: { userid: string, disOlike: boolean }[] //for questions
    dateSent: string
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
    rating: number
    sellerID: string
    password: string
    storeOwner?: {
        firstName: string,
        lastName: string,
        birthDate: string,
        email: string,
        nationalID: string,
    },
    isCompelete: boolean,
    phoneNumber: number,
    entityType?: EntitiyType,

    legalInfo?: {
        companyIDNumber: string,
        companyEconomicNumber: string,
        shabaNumber: number,
        signOwners: string[],
        storeName: string
    },

    additionalDocuments?: string[],

    individualInfo?: {
        nationalID: number,
        bankNumberType: bankNumberType,
        shabaNumber: number,
        bankNumber: number,
    },
    storeInfo?: {
        commercialName: string
        officePhoneNumber: number,
        logo?: string,
        sellerCode: string,
        aboutSeller: string,
        sellerWebsite: string
    },

    walletID?: string,

    moneyReturn?: {
        method: moneyReturn
        bankAccount: number
    },
    storeAddress?: {
        country: string,
        province: string,
        city: string,
        postalCode: number,
        additionalInfo: string,
        coordinates: {
            x: number,
            y: number
        }
    },

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
    picture: string,
    title: string,
    productID: string
    commission: number,
    urbanPrice: number,//price that the first seller put
    sellerCount: number,
    id: string
}

//#endregion

export interface Color {
    title: string,
    hex: string,
    id?: string,
}

export interface Brand {
    title: string,
    id: string,
}

export interface productSaleAnalyseCard {
    productID: string,
    picture: string,
    productTitle: string,
    productCategoryID: string,
    productCategoryTitle: string,
    saleValue: number,
    saleCount: number,
    visits: number
}