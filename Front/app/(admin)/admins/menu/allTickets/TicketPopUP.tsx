'use client'
import { Ticket } from '@/app/components/Interfaces/interfaces';
import { useUser } from '@/app/hooks/useUser';
import { useMutation } from '@tanstack/react-query';
import React, { useRef, useState } from 'react'


export interface Props {
  ticket: Ticket;
}
const TicketPopUp = ({ ticket }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [error, setError] = useState<string | null>(null);
  const { user, setUser, isLoading } = useUser();

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
  const setTicket = useMutation({
    mutationFn: async () => {
      const result = await fetch(
        "http://localhost:3005/users/admin/seeTicket" + ticket._id,
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({ ticketID: ticket._id }),
        }
      );
      const jsonResult = await result.json();
      if (result.ok) {
        return jsonResult;
      } else {
        throw new Error(jsonResult.error);
      }
    },
    onSuccess: (savedUser) => {
      if (user?._id) {
        console.log(savedUser);
        ticket.adminID = user?._id;
        closeModal();
      }
    },
    onError: (error) => {
      console.log(error);
      setError(error.message);
    },
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
      <button onClick={() => {
        openModal();
      }} className='text-primary-color py-5 pb-8 w-full text-right'>
        بیشتر
      </button>
      {!ticket.isSeen &&
        <button onClick={() => setTicket.mutate()} className='text-primary-color border-primary-color border-2 py-1.5 px-7 rounded-lg'>
          تایید
        </button>
      }
      <dialog ref={dialogRef} className="modal">
        <div className="modal-box">
          {error && <p>{error}</p>}
          <h3 className="font-bold text-lg pb-2">
            {((ticket.title && ticket.title) || "")}
          </h3>
          <div className="block">
            <div className=" flex justify-between pb-2">
              <p> میزان اهمیت :</p>

              <p>{(ticket.importance && ticket.importance)}</p>
            </div>
            <div className=" flex justify-between pb-2">
              <p>آی دی کاربر :</p>

              <p>{(ticket.userID && ticket.userID)}</p>
            </div>
            <div className=" flex justify-between pb-2">
              <p> آی دی فروشنده :</p>

              <p>{(ticket.sellerID && ticket.sellerID)}</p>
            </div>
            <div className=" flex justify-between pb-2">
              <p>آی دی کارمند :</p>

              <p>{(ticket.employeeID && ticket.employeeID)}</p>
            </div>

            <div className=" flex justify-between pb-2">
              <p>آیدی ادمین :</p>

              <p>{(ticket.adminID && ticket.adminID)}</p>
            </div>
            <div className=" flex justify-between pb-2">
              <p>تاریخ :</p>

              <p>{(ticket.date && ticket.date)}</p>
            </div>
            <div className=" flex justify-between pb-2">
              <p> پیام :</p>

              <p>{(ticket.content && ticket.content)}</p>
            </div>
          </div>
          <div className="my-4 flex justify-center">

            <button
              className="btn btn-warning mx-3"
              type="button"
              onClick={closeModal}
            >
              خروج
            </button>

          </div>
        </div>
        <form method="dialog" className="modal-backdrop" onClick={closeModal}>
          <button type="button">close</button>
        </form>
      </dialog>

    </div>
  )
}

export default TicketPopUp