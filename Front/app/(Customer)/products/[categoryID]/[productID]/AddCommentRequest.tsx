'use client'
import { Comment } from '@/app/components/Interfaces/interfaces';
import { useUser } from '@/app/hooks/useUser';
import React, { useRef, useEffect } from 'react'

interface Props {
  productID:string
  type:string
}

async function AddCommentRequest(comment:Comment) {
  try {
    const response = await fetch('https://localhost:8080/products/comments', {
      method: 'POST',
      credentials:'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(comment)
    });
    
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    
    const result = await response.json();
    console.log('Success:', result);
  } catch (error) {
    console.error('Error:', error);
  }
}

const AddComment = ({productID , type }: Props) => {
  const dialogRef = useRef<HTMLDialogElement | null>(null)
  const content = useRef<HTMLTextAreaElement>(null)
  const {user} = useUser()
  

  useEffect(() => {
    const dialogElement = dialogRef.current
    console.log(dialogElement)
  }, [])

  return (
    <div >
      <button onClick={() => dialogRef.current?.showModal()} className='text-primary-color text-sm'>
        ثبت کامنت جدید
      </button>
      <dialog ref={dialogRef} id="answerPopup" className="modal">
        <div className="modal-box">
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
          </form>
          <textarea ref={content} className='resize-none border-2 rounded-md w-full h-full p-2 mt-5 border-grey-border' placeholder='پاسخ'></textarea>
          <button className='w-full  bg-primary-color text-white py-3 rounded-md my-5' onClick={()=>{AddCommentRequest(
             {
                comment_type:0,
                product_id:productID,
                user_id:user?._id,
                content:content.current?.value,
                'likes&disslikes':[],
                date_sent:new Date(),
                validation_state:0,
            }
          )
          }}>ثبت کامنت</button>
        </div>
      </dialog>
    </div>
  )
}

export default AddComment
