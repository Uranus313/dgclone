'use client'
import React, { useState } from 'react'
import useGetUserGiftCards, { GiftCard } from '../../hooks/useGetGiftCards';
import GiftCardCard from './GiftCardCard';
import { error } from 'console';

const GiftCardList = () => {
    const {data: giftCards,error : giftCardError,isLoading : isLoading} = useGetUserGiftCards();
    const [mode,setMode]=useState<string>('pending');
    function seperateCards(){
        switch (mode) {
            case 'pending':
                return giftCards.boughtGiftCards.map((giftCard : GiftCard , index : any) =>{
                    if(!giftCard.isUsed){
                        return <GiftCardCard code={giftCard.code} amount={giftCard.amount} />
                    }
                }); 
                break;
            case 'received':
                return giftCards.receivedGiftCards.map((giftCard : GiftCard , index : any) =>{
                    return <GiftCardCard buyer={giftCard.buyer} code={giftCard.code} amount={giftCard.amount} />
                }); 
                break;
            case 'gifted':
                return giftCards.boughtGiftCards.map((giftCard : GiftCard , index : any) =>{
                    if(giftCard.isUsed && giftCard.user){
                        return <GiftCardCard user={giftCard.user} code={giftCard.code} amount={giftCard.amount} />
                    }
                }); 
                break;
            case 'used':
                return giftCards.boughtGiftCards.map((giftCard : GiftCard , index : any) =>{
                    if(giftCard.isUsed && !giftCard.user){
                        return <GiftCardCard code={giftCard.code} amount={giftCard.amount} />
                    }
                }); 
                break;
            
            default:
                return null
                break;
        }
    }
  return (
    <div>
      <div>
        <button className={mode == 'pending'? 'btn btn-primary' : 'btn btn-secondary'} onClick={() => setMode('pending')}>کارت های فعال</button>
        <button className={mode == 'received'? 'btn btn-primary' : 'btn btn-secondary'} onClick={() => setMode('received')}>کارت های هدیه گرفته شده</button>
        <button className={mode == 'gifted'? 'btn btn-primary' : 'btn btn-secondary'} onClick={() => setMode('gifted')}>کارت های هدیه داده شده</button>
        <button className={mode == 'used'? 'btn btn-primary' : 'btn btn-secondary'} onClick={() => setMode('used')}>کارت های استفاده شده </button>

      </div>
        
      {isLoading && <span className="loading loading-dots loading-lg"></span>}
      {giftCards && seperateCards()}
    </div>
  )
}

export default GiftCardList
