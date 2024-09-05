import React from 'react'
import ProfileSide from './ProfileSide'
import { bankNumberType, commentType, EntitiyType, moneyReturn, notifTypeSeller, Seller, State } from '@/app/components/Interfaces/interfaces'
import OrderWidget from './OrderWidget'
import SellChart from './SellChart'
import Link from 'next/link'


export const seller:Seller={
  sellerID:'1',
  password:"1234",
  rating:4.1,
  storeOwner:{
    firstName:"بابک",
    lastName:"بلغار",
    birthDate:"1350/09/03" ,
    email:"babak@gmail.com",
    nationalID:'2050394203',
  },
  isCompelete:true,
  phoneNumber:9114532030,
  entityType: EntitiyType.individual, 

  legalInfo:{
      storeName:"بابک لپتاپ",
      companyIDNumber:"39402340",
      companyEconomicNumber:"304932034",
      shabaNumber:1210394032403,
      signOwners:['mmd','ali'],
  },

  additionalDocuments:['sth','sth'],
  
  individualInfo:{
      nationalID:2049304032,
      bankNumberType :bankNumberType.bank,    
      shabaNumber:903939340234,
      bankNumber:6037439543950,
  },
  storeInfo: {
      commercialName:'بابک لپتاپ',
      officePhoneNumber:99348333493,
      logo:'',
      sellerCode:'13039420',
      aboutSeller:'سلام',
      sellerWebsite:"www.gffs.com" },

  walletID:'1',

  moneyReturn:{
      method:moneyReturn.bankAccount,
      bankAccount:393849320494
  },
  // storeAddress:{
  //     country:'ایران',
  //     province:'مازندران',
  //     city:"بابل",
  //     postalCode:294039434,
  // },

  // warehouseAddress:{
  //     country:string,
  //     province:string,
  //     city:string,
  //     postalCode:number,
  //     additionalInfo:string ,
  //     coordinates : {
  //         x:number ,
  //         y:number 
  //     }
  // },

  // socialInteractions : Comment[],
  recentNotifications :[
                  {notificationID:'1',content:'در مسیر دو سویه شراکت تجاری، آگاهی از نظرات شما چراغ راه ما برای بهبود فرایندهاست. با پاسخ به چند پرسش کوتاه، نظرتان را درباره این همکاری با ما به اشتراک بگذارید',
                    dateSent:'2024/09/08',seen:false,sellerID:'1',sellerphone:93940403404,type:notifTypeSeller.info
                  },
                  {notificationID:'2',content:'در مسیر دو سویه شراکت تجاری، آگاهی از نظرات شما چراغ راه ما برای بهبود فرایندهاست. با پاسخ به چند پرسش کوتاه، نظرتان را درباره این همکاری با ما به اشتراک بگذارید',
                    dateSent:'2024/09/09',seen:true,sellerID:'1',sellerphone:93940403404,type:notifTypeSeller.order
                  }
                ],
  
  saleInfo:{
    sold:4,
    income:20120000,
    productCount:2,
  },
  ordersInfo:{
    pastAndTodayShipmentCommitment:1,
    tomorrowAndFutureShipmentCommitment:2,
    todaysOrders:1,
    canceledOrders:1,
  },

  recentSaleChart:[
    {income:0 , date:'2024-08-08'},
    {income:0 , date:'2024-08-09'},
    {income:0 , date:'2024-08-10'},
    {income:9000000 , date:'2024-08-11'},
    {income:0 , date:'2024-08-12'},
    {income:0 , date:'2024-08-13'},
    {income:3120000 , date:'2024-08-14'},
    {income:0 , date:'2024-08-15'},
    {income:0 , date:'2024-08-16'},
    {income:0 , date:'2024-08-17'},
    {income:0 , date:'2024-08-18'},
    {income:0 , date:'2024-08-19'},
    {income:4000000 , date:'2024-08-20'},
    {income:0 , date:'2024-08-21'},
    {income:8000000 , date:'2024-08-22'}]
 
}

const SellersHome = () => {
  return (
    <div className='grid bg-primary-bg grid-cols-8 gap-4 grid-rows-6 mt-8'>
      <div className='bg-white col-span-2 row-span-3 text-black rounded-lg'><ProfileSide/></div>
      <div className='bg-white col-span-2 row-span-1 p-4 rounded-lg'>
        <div className='my-3 flex justify-between'>
          <p className='text-lg'>فروخته‌شده</p>
          <Link href='/sellers/orders/?filter=sold' className='border rounded-md border-primary-seller px-5 py-2 text-primary-seller text-sm'>جزییات</Link>
        </div>
        <p className='text-lg'>{seller.saleInfo.sold} کالا</p>
      </div>

      <div className='bg-white col-span-2 row-span-1 p-4 rounded-lg'>
        <p className='text-md my-3 mb-5'>درآمد ناخالص</p>
        <p className='text-xl'>{seller.saleInfo.income} تومان</p>

      </div>
      <div className='bg-white col-span-2 row-span-1 p-4 rounded-lg'>
      <div className='my-3 flex justify-between'>
          <p className='text-lg'>تمام کالا ها</p>
          <Link href='/sellers/products' className='border rounded-md border-primary-seller px-5 py-2 text-primary-seller text-sm'>جزییات</Link>
        </div>
        <p className='text-lg'>{seller.saleInfo.productCount} کالا</p>
      </div>
      <div className='bg-white col-span-3 row-span-2 p-4 rounded-lg'><OrderWidget/></div>
      <div className='bg-white col-span-3 row-span-2 p-4 rounded-lg'><SellChart data={seller.recentSaleChart}/></div>
    </div>
  )
}

export default SellersHome