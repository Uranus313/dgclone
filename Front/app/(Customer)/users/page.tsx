import React, { Suspense } from 'react'
import ProductCard from '../../components/ProductCar/ProductCard'
import UserTable from './UserTable';
import Link from 'next/link';




const UsersPage = async () => {
    

    return <>
        <h1>Users</h1>
        <Link className='btn' href="/users/new">New User</Link>

        <Suspense fallback={<p>Loading...</p>}>

            <UserTable/>
        </Suspense>
        
    </>;
  };
  
  export default UsersPage;
  