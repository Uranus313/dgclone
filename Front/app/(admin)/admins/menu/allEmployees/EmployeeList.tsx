'use client'
import React, { ChangeEvent, useContext, useEffect, useRef, useState } from 'react'
import useGetEmployees from '../../hooks/useGetEmployees';
import { useUser } from "@/app/hooks/useUser";
import EmployeePopUp from './EmployeePopUp';
import useGetRoles from '../../hooks/useGetRoles';
import AddEmployeePopUp from './AddEmployeePopUp';
interface Props {
  changeList: (list: string) => void
}
const EmployeeList = ({ changeList }: Props) => {

  const [isOpen, setIsOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  let [typeSort, setTypeSort] = useState<string>("none");
  let [pageSize, setPageSize] = useState<number>(8);
  let [page, setPage] = useState<number>(0);
  let [search, setSearch] = useState<string | null>('');
  let searchRef = useRef<any>('');
  let { data: employees, error, isLoading } = useGetEmployees({ sort: typeSort, floor: page * pageSize, limit: pageSize, nameSearch: search });
  useEffect(() => {
    console.log(error)
  }, [error])

  function handleSort(type: string) {
    setTypeSort(type);
  }

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

  function handleSearch() {
    console.log(searchRef.current.value.trim());
    setSearch(searchRef.current.value.trim());
  }
  return (
    <div className=' flex-col bg-white m-20 rounded-md'>
      <div className='flex border-b-2 shadow-md border-white p-7 px-13 w-full'>

        <form onSubmit={(e) => {
          e.preventDefault();
          handleSearch();
        }} className='w-8/12'>
          <select onChange={(e) => { changeList(e.target.value) }} className='bg-white ml-16 text-black'>
            <option value="users">کاربران</option>
            <option value="employees" selected>کارمندان</option>
            <option value="admins" > ادمین ها</option>
            <option value="orders">سفارش ها</option>
            <option value="sellers">فروشندگان</option>
            <option value="products">محصولات</option>
            <option value="transactions"> تراکنش ها</option>
          </select>
          <input className='mt-6 mr-6 lg:mt-0 lg:mr-0 md:w-4/6 bg-primary-bg placeholder-neutral-700 px-6 py-2 rounded-md' type="text" placeholder='جست و جو بر حسب نام و نام خانوادگی'
          ref={searchRef}
          onBlur={() => handleSearch()} />
        </form>
          <button onClick={() => { openModal() }} className='bg-red-box px-8 py-2 rounded-md mr-12 ml-6'>مرتب سازی</button>
          <AddEmployeePopUp />
      </div>
      <dialog ref={dialogRef} className="modal">
        <div className="modal-box flex justify-center">
          <div className="my-4 flex flex-col justify-center w-1/2">
            <button className="rounded-md bg-primary-color px-6 py-3"  type="button" onClick={() => {
              closeModal();
              handleSort("lastName");
              handleSort("firstName");
            }}>نام و نام خانوادگی</button>
            <button className="rounded-md bg-primary-color px-6 py-3  my-3" type="button" onClick={() => {
              closeModal();
              handleSort("phoneNumber");
            }}>شماره تلفن</button>
            <button className="btn btn-warning  " type="button" onClick={closeModal}>خروج</button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop" onClick={closeModal}>
          <button type="button">close</button>
        </form>
      </dialog>
      
      {isLoading ? <span className="loading loading-dots loading-lg"></span> :
        // error && <p>{error.message}</p>
        <div className=' flex-col'>
          <ul>
            <div className="flex justify-between py-8 text-center">
              <p className="w-1/4">نام و نام خانوادگی</p>
              <p className="w-1/4">شماره تلفن</p>
              <p className="w-1/4">شغل </p>
              <p className="w-1/4">وضعیت</p>
            </div>
            {employees?.data?.map((employee, index) => {
              return (
                <li key={index}>
                  <EmployeePopUp employee={employee} />
                </li>
              )
            })}
          </ul>
          <div className='my-4 flex justify-center pb-5'>
            <button disabled={page == 0} onClick={() => setPage(page - 1)} className='btn btn-primary mx-3'>قبلی</button>
            <button disabled={!employees?.hasMore} onClick={() => setPage(page + 1)} className='btn btn-primary'>بعدی</button>
          </div>
        </div>

      }

    </div>
  )
}

export default EmployeeList
