'use client'

import { ProductInterface, Ticket } from "@/app/components/Interfaces/interfaces";
import { useUser } from "@/app/hooks/useUser";
import { useMutation } from '@tanstack/react-query';
import React, { useContext, useRef, useState } from 'react'


export interface Props {
    ticket: Ticket
}
const TicketPopUp = ({ ticket }: Props) => {
    const [isOpen, setIsOpen] = useState(false);
    const dialogRef = useRef<HTMLDialogElement>(null);
    const [error, setError] = useState<string | null>(null);
    const { user } = useUser();

    const openModal = () => {
        if (dialogRef.current) {
            dialogRef.current.showModal();
            setIsOpen(true);
        }
    };

    const closeModal = () => {
        if (dialogRef.current) {
            dialogRef.current.close();
            setIsOpen(false);
        }
    };
    const unbanProd = useMutation({
        mutationFn: async () => {
            // const result = await fetch("http://localhost:8080/products/validate-prods" + `?ProdID=${product._id}&ValidationState=2`, {
            //     method: "PATCH",
            //     headers: {
            //         "Content-Type": "application/json",
            //     },

            // });
            // const jsonResult = await result.json();
            // console.log(jsonResult);
            // if (result.ok) {
            //     return jsonResult
            // } else {
            //     throw new Error(jsonResult.error);
            // }
        },
        onSuccess: (savedUser) => {
            console.log(savedUser);
            closeModal();
        },
        onError: (error) => {
            console.log(error);
            setError(error.message)
        }
    });


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