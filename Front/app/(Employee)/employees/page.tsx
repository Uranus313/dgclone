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
import { useUser } from '@/app/hooks/useUser';


const EmployeeHomePage = () => {

  const [list, setList] = useState<string | null>('');
  const { user, setUser, isLoading } = useUser();

  return (
    <div className='flex flex-wrap md:flex-nowrap '>
      <InformationCard />

      {isLoading && <span className="loading loading-dots loading-lg m-24"></span>}
      {
        user &&
        <span className='flex flex-wrap md:mt-24 mr-12 md:mr-0 '>
          <CommentBox />
          <OrderBox />
          <TransactionBox />
          <UserBox />
          <SellerBox />
          <ProductManagement />
          <ProductValidation />
          <VariantBox />
          <TicketBox />
        </span>
      }

    </div>
  )
}

export default EmployeeHomePage