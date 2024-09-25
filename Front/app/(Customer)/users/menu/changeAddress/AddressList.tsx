'use client'
import React, { useContext } from 'react'
// import { UserAddress } from './page'
import AddressCard from './AddressCard'
import { useUser } from "@/app/hooks/useUser";
import { Address } from '@/app/components/Interfaces/interfaces';

interface Props{
    addresses : Address[]
}

const AddressList = () => {
  const {user } = useUser();
    
  return (
    <div>
      {user?.addresses.map((address : Address, index : any) =>{
        return <AddressCard key={index} address={address.additionalInfo} city={address.city} postalCode={address.postalCode} receiver={address.receiver}/>
      })}
    </div>
  )
}

export default AddressList
