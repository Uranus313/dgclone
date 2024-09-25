"use client";
import React, { useContext, useEffect, useState } from 'react'
import userContext from '@/app/contexts/userContext'
import Link from 'next/link'
import InformationCard from './InformationCard';
import CommentBox from './menu/commentAproval/CommentBox';
import OrderBox from './menu/orderBox/OrderBox';
import TransactionBox from './menu/transactionBox/TransactionBox';
import UserBox from './menu/userBox/UserBox';
import SellerBox from './menu/sellerBox/SellerBox';
import ProductManagement from './menu/productBox/ProductManagement';
import TicketBox from './menu/ticketBox/TicketBox';
import ProductValidation from './menu/validationBox/ProductValidation';
import VariantBox from './menu/variantValidation/VariantBox';

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

export interface Employee {
  firstName: string,
  lastName: string,
  email: string,
  birthDate: string,
  nationalID: string,
  phoneNumber: string,
  roleID: Role,
  _id: string
}

const EmployeeHomePage = () => {

  
  const { user, setUser, isLoading } = useContext(userContext) as { user: Employee; setUser: (user: Employee) => void; isLoading: boolean };
  const [list, setList] = useState<string | null>('');
  
  return (
    <div className='w-full flex'>
       < InformationCard />
      <div className='w-full'>
        
        {isLoading && <span className="loading loading-dots loading-lg m-24"></span>}
        {
          user &&
          <span>
            <div className='flex mt-24' >
              <CommentBox />
              <OrderBox />
              <TransactionBox />
              <UserBox />
              <SellerBox />
            </div>
            <div className='flex mt-8' >
              <ProductManagement />
              <ProductValidation />
              <VariantBox />
              <TicketBox />
            </div>

          </span>
        }
      </div>
     
    </div>
  )
}

export default EmployeeHomePage