import React from 'react'
import GiftCardList from './GiftCardList'
import RegisterGiftCard from './RegisterGiftCard'

const page = () => {
  return (
    <div>
      کارت های هدیه 
      <RegisterGiftCard />
      <GiftCardList />
    </div>
  )
}

export default page
