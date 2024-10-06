'use client'
import React, { useState } from 'react'
import useGetTicket from '../../hooks/useGetTickets';
import TicketPopUp from './TicketPopUP';



const TicketList = () => {

    let [typeSort, setTypeSort] = useState<string>("none");
    let [pageSize, setPageSize] = useState<number>(8);
    let [page, setPage] = useState<number>(0);
    let { data: tickets, error, isLoading } = useGetTicket({ sort: typeSort, floor: page * pageSize, limit: pageSize });

    return (
        <div className='w-full bg-white rounded-lg'>
            <div className='border-b-2 shadow-md border-white p-7 px-15 w-full' >
                <p> بلیط ها</p>
            </div>
            {isLoading ? <span className="loading loading-dots loading-lg"></span> :
                <div className=' flex-col'>
    
                    {tickets?.data?.map((ticket, index) => {
                        return (
                            <div key={index}>
                                <TicketPopUp ticket={ticket} />
                            </div>
                        )
                    })}

                    <div className='my-4 flex justify-center pb-5'>
                        <button disabled={page == 0} onClick={() => setPage(page - 1)} className='btn btn-primary mx-3'>قبلی</button>
                        <button disabled={!tickets?.hasMore} onClick={() => setPage(page + 1)} className='btn btn-primary'>بعدی</button>
                    </div>

                </div>
            }
        </div>
    )
}

export default TicketList