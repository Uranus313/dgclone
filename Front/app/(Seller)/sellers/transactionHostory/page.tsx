import { Transaction, TransactionSide } from '@/app/components/Interfaces/interfaces'
import React from 'react'
import { seller } from '../page'
import Checkbox from '../products/Checkbox'
import RadioOptions from '../saleAnalyse/RadioOptions'


const transactionHistory : Transaction[]=[
  { transactionID:'1',
    date:'2024/08/22 22:09:01',
    userid:'1',
    moneyAmount:3000000,
    title:'تسویه حساب روز اخیر',
    reciver:{
      reciverID:'1',
      type:TransactionSide.seller,
    },
    sender:{
      type:TransactionSide.digiMarket,
    },
  },
  { transactionID:'2',
    date:'2024/08/22 22:09:01',
    userid:'1',
    moneyAmount:3000000,
    title:'تسویه حساب پانزده روز اخیر',
    reciver:{
      reciverID:'1',
      type:TransactionSide.seller,
    },
    sender:{
      type:TransactionSide.digiMarket,
    },
  },
  { transactionID:'3',
    date:'2024/08/22 22:09:01',
    userid:'1',
    moneyAmount:3000000,
    title:'تسویه حساب پانزده روز اخیر',
    reciver:{
      reciverID:'1',
      type:TransactionSide.seller,
    },
    sender:{
      type:TransactionSide.digiMarket,
    },
  },
  { transactionID:'4',
    date:'2024/08/22 22:09:01',
    userid:'1',
    moneyAmount:3000000,
    title:'جریمه ی تاخیر زمانی',
    additionalinfo:'در صورت اعتراض شناسه ی تراکنش را با توضیحات مربوطه به صورت تیکت برای همکاران ما ارسال نمایید',
    reciver:{
      type:TransactionSide.digiMarket,
    },
    sender:{
      type:TransactionSide.seller,
      senderID:'1'
    },
  },
  
]

const TransactionHistory = () => {
  return (
    <div className='bg-white p-5 my-4 rounded-lg'>
      <h1 className='text-xl text-grey-dark '>تاریخچه ی تراکنش ها</h1>

      <div className='py-5'>
          <label className="input w-full input-bordered flex items-center gap-2">
            <input type="text" className="grow " placeholder="  جستجو بر اساس شناسه ی تراکنش" />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="h-4 w-4 opacity-70"
            >
              <path
                fillRule="evenodd"
                d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                clipRule="evenodd"
              />
            </svg>
          </label>
      </div>
      
      <div className='flex items-center border-b border-grey-border pb-4 mb-5'>
        <div className='flex items-center mt-2 text-primary-seller'>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-7">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
            </svg>
            <p className='mx-1'>فیلتر ها</p>
        </div>

        <div className="dropdown mx-3">
          <div tabIndex={0} role="button" className="bg-primary-bg border border-primary-seller text-primary-seller rounded-xl px-4 py-2 m-1 text-sm">نوع تراکنش</div>
          <div tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-50 w-52 p-2 shadow">
            <RadioOptions name='transactiontype' id={"deposit"} title={"واریزی"} query='transactionType' />
            <RadioOptions name='transactiontype' id={'withdraw'} title={"برداشتی"} query='transactionType' />
          </div>
        </div>
      </div>


      {transactionHistory.map(transaction=>{
          return <div className="collapse collapse-arrow bg-propBubble-bg my-3">
              <input type="checkbox" name="my-accordion-2" />
              <div className="collapse-title font-medium flex ">
                {transaction.reciver.reciverID==seller.sellerID && transaction.reciver.type==TransactionSide.seller 
                ? <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 text-green-box">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18" />
              </svg>
                : <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 text-red-box">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3" />
              </svg>              
                }
                
                <p className='mx-5  h-fit overflow-hidden'>{transaction.title}</p>
                <p className='mr-auto'>{transaction.date}</p>

              </div>
              <div className="collapse-content bg-primary-bg border border-grey-border">
                <div className='grid grid-cols-2 pt-5 gap-5'>
                <p>شناسه ی تراکنش :</p>
                <p>{transaction.transactionID}</p>
                <hr className='col-span-2 text-grey-border'></hr>

                <p>فرستنده :</p>
                <p>{transaction.sender.type}</p>
                <hr className='col-span-2 text-grey-border'></hr>

                <p>گیرنده :</p>
                <p>{transaction.reciver.type}</p>
                <hr className='col-span-2 text-grey-border'></hr>

                <p>مبلغ :</p>
                {transaction.reciver.reciverID==seller.sellerID && transaction.reciver.type==TransactionSide.seller
                  ?<p className='text-green-box font-bold text-2xl'>{transaction.moneyAmount}+</p>
                  :<p className='text-red-box font-bold text-2xl'>{transaction.moneyAmount}-</p>
                }
                <hr className='col-span-2 text-grey-border'></hr>
                
                {transaction.additionalinfo&&
                    <>
                      <p>جزییات بیشتر :</p>
                      <p>{transaction.additionalinfo}</p>
                    </>
                }
                </div>
              </div>
            </div>
            
      })}
    </div>
  )
}

export default TransactionHistory