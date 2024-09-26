'use client'
import { Comment } from '@/app/components/Interfaces/interfaces'
import React, { ChangeEvent, useContext, useEffect, useRef, useState } from 'react'

interface Props {
  comment: Comment
}

const CommentList = ({comment}: Props) => {

  return (
    <div className='w-full p-10 border-b-2 border-border'>
    <div className='flex pb-5'>
      <p className='text-text-color'>آی دی محصول : </p>
      <p>{comment.productID}</p>
      <p className='text-text-color'>آی دی کاربر : </p>
      <p>{comment.user.userid}</p>
      <p className='pr-20 pl-5 text-text-color'> تاریخ  : </p>
      <p>{comment.dateSent}</p>
      <p className='pr-20 pl-5 text-text-color'> نوع  : </p>
      <p>{comment.type}</p>
    </div>
    <p className='pb-5'>پیام : {comment.content}</p>
    <button onClick={() => {
    }} className='text-green-box border-green-box border-2 py-5 pb-8 mx-3'>
      تایید
    </button>
    <button onClick={() => {
    }} className='text-red-box border-red-box border-2 py-5 pb-8'>
      رد
    </button>
    
  </div>

  )
}

export default CommentList
