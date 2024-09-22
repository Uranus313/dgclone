'use client'
import React, { useState } from 'react'
import EmployeeList from './EmployeeList'
import AddEmployeePopUp from './AddEmployeePopUp'
import Link from 'next/link'

const EmployeesWatchPage = () => {
  const [list, setList] = useState<string>('employees');

  return (
    <div>
      <h1>لیست کارمند ها</h1>
      <Link href={"/admins/menu/allEmployees/allRoles"}>نقش ها</Link>
      <AddEmployeePopUp />
      {/* <EmployeeList /> */}
      <EmployeeList changeList={(list => setList(list))} />
    </div>
  )
}

export default EmployeesWatchPage
