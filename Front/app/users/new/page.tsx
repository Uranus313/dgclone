'use client'
import { useRouter } from 'next/navigation'
import React from 'react'

const NewUser = () => {
  const manage = useRouter();
  return (
    <div>
        NewUser
        <button
             className='btn btn-primary'
             onClick={()=>manage.push('/users')}
             >Create</button>
    </div>
  )
}

export default NewUser