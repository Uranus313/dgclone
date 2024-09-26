'use client'
import React, { useContext } from 'react'
// import { UserAddress } from './page'
import AddressCard from './AddressCard'
import { useUser } from "@/app/hooks/useUser";
import { Address } from '@/app/components/Interfaces/interfaces';
import { useSeller } from '@/app/hooks/useSeller';

interface Props{
    addresses : Address[]
}

const AddressList = () => {
  const {seller } = useSeller();
    
  return (
    <div>
      <AddressCard key={0} address={seller?.storeAddress?.additionalInfo} city={seller?.storeAddress?.city??''} postalCode={seller?.storeAddress?.postalCode??''} receiver={seller?.storeAddress?.receiver??{firstName: '', lastName: '', phoneNumber: ''}}/>
    </div>
  )
}

export default AddressList
