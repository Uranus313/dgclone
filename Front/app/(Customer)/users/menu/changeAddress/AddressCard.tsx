import React from 'react'

interface Props{
    address? : string,
    city : string,
    postalCode : string,
    receiver : {
        firstName : string,
        lastName : string,
        phoneNumber : string,
    }
}

const AddressCard = ({address,city,postalCode,receiver}: Props) => {
  return (
    <div className=' m-3'>
      {address && <p>{address}</p>}
      <p>{city}</p>
      <p>{postalCode}</p>
      <p>{receiver.firstName+ " " + receiver.lastName}</p>
      <p>{receiver.phoneNumber}</p>
    </div>
  )
}

export default AddressCard
