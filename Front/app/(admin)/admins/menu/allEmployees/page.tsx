import React from 'react'
import EmployeeList from './EmployeeList'
import AddEmployeePopUp from './AddEmployeePopUp'
import Link from 'next/link'

const EmployeesWatchPage = () => {
  return (
    <div>
      <h1>لیست کارمند ها</h1>
      <Link href={"/admins/menu/allEmployees/allRoles"}>نقش ها</Link>
      <AddEmployeePopUp />
      {/* <EmployeeList /> */}
    </div>
  )
}

export default EmployeesWatchPage
