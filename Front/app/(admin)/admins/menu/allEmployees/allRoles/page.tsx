import React from 'react'
import AddRolePopUp from './AddRolePopUp'
import RoleList from './RoleList'

const RolesWatchPage = () => {
  return (
    <div className='w-full m-16 bg-white rounded-md'>
      <AddRolePopUp />
      <RoleList />
    </div>
  )
}

export default RolesWatchPage
