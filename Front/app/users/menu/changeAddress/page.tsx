import React from 'react'
import AddAddressPopUp from './AddAddressPopUp'
import AddressList from './AddressList'

export interface UserAddress{
        country: string,
        province: string,
        city: string,
        postalCode : string,
        additionalInfo? : string,
        number : string,
        unit : string,
        coordinates : {
                x : string,
                y : string
            },
        receiver : {
            firstName : string,
            lastName : string,
            phoneNumber: string
        }
}

const Addresses = () => {
  return (
    <div>
      <AddAddressPopUp />
      <AddressList />
    </div>
  )
}

export default Addresses
