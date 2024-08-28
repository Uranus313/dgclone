'use client'
import React, { useContext } from 'react'
import { UserAddress } from './page'
import AddressCard from './AddressCard'
import userContext from '@/app/contexts/userContext'

interface Props{
    addresses : UserAddress[]
}

const AddressList = () => {
  const {user } = useContext(userContext);
    
  return (
    <div>
      {user.addresses.map( (address : UserAddress, index : any) =>{
        return <AddressCard key={index} address={address.additionalInfo} city={address.city} postalCode={address.postalCode} receiver={address.receiver}/>
      })}
    </div>
  )
}

export default AddressList
