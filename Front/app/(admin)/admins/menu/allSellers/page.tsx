import React from 'react'
import SellerList from './SellerList'
import Link from 'next/link'

const sellersWatchPage = () => {
  return (
    <div>
      <h1>لیست فروشنده ها</h1>
      <Link href={"/admins/menu/allSellers/verifyRequests"}>درخواست های تایید</Link>
      <SellerList />
    </div>
  )
}

export default sellersWatchPage
