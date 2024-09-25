'use client'
import React, { useState } from 'react'


export interface Ticket {
  content: string;
  title: string;
  orderID: string;
  sellerID: string;
  userID: string;
  employeeID: string;
  adminID: string;
  date: string;
  importance: string
}
export interface Props {
  ticket: Ticket;
}
const TicketPopUp = ({ ticket }: Props) => {

  return (
    <div className='w-full p-10'>
      <div className='flex pb-5'>
        <p>آی دی کاربر : {ticket.userID}</p>
        <p className='px-20'> تاریخ  : {ticket.date}</p>
      </div>
      <p className='pb-5'>پیام : {ticket.content}</p>
      <button className='text-primary-color py-5 pb-8 w-full text-right'>
        بیشتر
      </button>
      <button className='text-primary-color border-primary-color border-2 py-1.5 px-7 rounded-lg'>
        تایید
      </button>

    </div>
  )
}

export default TicketPopUp