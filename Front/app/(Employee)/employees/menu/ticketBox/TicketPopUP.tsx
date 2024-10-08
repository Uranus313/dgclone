'use client'
import { Ticket } from '@/app/components/Interfaces/interfaces';
import { useUser } from '@/app/hooks/useUser';
import React, { useState } from 'react'


export interface Props {
  ticket: Ticket;
}
const TicketPopUp = ({ ticket }: Props) => {

  const { user, setUser, isLoading } = useUser();

  return (
    <div className='w-full p-10 border-b-2 border-border'>
      <div className='flex pb-5'>
        <p className='text-text-color'>آی دی کاربر : </p>
        <p>{ticket.userID}</p>
        <p className='pr-20 pl-5 text-text-color'> تاریخ  : </p>
        <p>{ticket.date}</p>
      </div>
      <p className='pb-5 line-clamp-3 m-5 break-all'>پیام : {ticket.content}</p>
      <button className='text-primary-color py-5 pb-8 w-full text-right'>
        بیشتر
      </button>
      {user &&
        <div>
          {user.roleID &&
            <div>
              {user.roleID.accessLevels && user.roleID.accessLevels.some(accessLevel => accessLevel.level === "ticketManage" && accessLevel.writeAccess === true) &&
                <div>
                  <button className='text-primary-color border-primary-color border-2 py-1.5 px-7 rounded-lg'>
                    تایید
                  </button>
                </div>
              }
            </div>
          }
        </div>

      }


    </div>
  )
}

export default TicketPopUp