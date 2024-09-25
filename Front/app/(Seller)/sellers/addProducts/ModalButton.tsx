'use client'
import React, { useEffect, useState } from 'react'

interface Props {
  id: string
  title:string
  solid?:boolean
  additionalCss?:string
  noMargin?:boolean
}

const ModalButton = ({ noMargin,id,title,additionalCss='bg-propBubble-bg', solid=true }: Props) => {
  const [dialogElement, setDialogElement] = useState<HTMLDialogElement | null>(null);

  useEffect(() => {
    setDialogElement(document.getElementById(id) as HTMLDialogElement | null);
  }, []);

  return (
    <div>
      <button onClick={() => { dialogElement?.showModal(); console.log(dialogElement) }} className={`  p-3 w-fit ${solid ?additionalCss : 'text-primary-seller'}  rounded-md ${!noMargin && 'my-6 text-sm'} `}>{title}</button>
      
    </div>
  )
}

export default ModalButton
