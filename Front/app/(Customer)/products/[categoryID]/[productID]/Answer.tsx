'use client'
import React, { useRef, useEffect } from 'react'

interface Props {
  questionID: string
  questionContent:string
}

const Answer = ({ questionID , questionContent }: Props) => {
  const dialogRef = useRef<HTMLDialogElement | null>(null)

  useEffect(() => {
    const dialogElement = dialogRef.current
    console.log(dialogElement)
  }, [])

  return (
    <div >
      <button onClick={() => dialogRef.current?.showModal()} className='text-primary-color text-sm'>
        ثبت پاسخ جدید
      </button>
      <dialog ref={dialogRef} id="answerPopup" className="modal">
        <div className="modal-box">
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
          </form>
          <h3 className='my-2'>{questionContent}</h3>
          <textarea className='resize-none border-2 rounded-md w-full h-full p-2 mt-5 border-grey-border' placeholder='پاسخ'></textarea>
          <button className='w-full  bg-primary-color text-white py-3 rounded-md my-5'>ثبت پاسخ</button>
        </div>
      </dialog>
    </div>
  )
}

export default Answer
