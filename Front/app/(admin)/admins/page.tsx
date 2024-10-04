'use client'
import React, { useState } from 'react'
import MenuSideBar from './MenuSideBar'
import CardBox from './CardBox'
import UserList from './menu/allUsers/UserList'
import AdminList from './menu/allAdmins/AdminList'
import SellerList from './menu/allSellers/SellerList'
import EmployeeList from './menu/allEmployees/EmployeeList'
import TransactionList from './menu/allTransactions/TransactionList'
import ProductList from './menu/allProducts/ProductList'
import OrderList from './menu/allOrders/OrderList'



const AdminHomePage = () => {
  const [list, setList] = useState<string>('users');

  return (
    <div className='w-full flex'>
      <MenuSideBar />
      <div className='w-full'>
        <CardBox />
        <span>
          {list === 'admins' ? <AdminList changeList={(list => setList(list))} />
            : list === 'sellers' ? <SellerList changeList={(list => setList(list))} />
              : list === 'employees' ? <EmployeeList changeList={(list => setList(list))} />
                : list === 'transactions' ? <TransactionList changeList={(list => setList(list))} />
                  : list === 'products' ? <ProductList changeList={(list => setList(list))} />
                    : list === 'orders' ? <OrderList changeList={(list => setList(list))} />
                      : <UserList changeList={(list => setList(list))} />}
        </span>
      </div>
    </div>
  )
}

export default AdminHomePage