'use client'
import useGetSellerNotifications from '@/app/hooks/useGetSellerNotifications'
import React from 'react'

const Notification = () => {
  //server
  // const res = await await fetch("http://localhost:3005/users/seller/myNotifications", {credentials: 'include'});
  // const noficiations  = await res.json()

  const {data:noficiations} = useGetSellerNotifications()
  return (
    <div>{JSON.stringify(noficiations)}</div>
  )
}

export default Notification