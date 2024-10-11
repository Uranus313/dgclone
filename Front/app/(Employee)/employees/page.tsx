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
import CategoryBox from './menu/categoryBox/CategoryBox';


const EmployeeHomePage = () => {

  const [list, setList] = useState<string | null>('');
  const { user, setUser, isLoading } = useUser();

  return (
    <div className='flex flex-wrap lg:flex-nowrap '>
      <InformationCard />
      {isLoading && <span className="loading loading-dots loading-lg m-24"></span>}
      {
        user &&
        <span className='flex flex-wrap mr-5 md:mr-12 lg:mr-0 lg:mt-24 '>
          <CommentBox />
          <OrderBox />
          <TransactionBox />
          <UserBox />
          <SellerBox />
          <ProductManagement />
          <ProductValidation />
          <VariantBox />
          <TicketBox />
          <CategoryBox />
        </span>
      }

    </div>
  )
}

export default EmployeeHomePage