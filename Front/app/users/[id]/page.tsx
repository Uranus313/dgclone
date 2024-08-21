import { notFound } from 'next/navigation';
import React from 'react'

interface Props {
    params:{id:number}
}
const UserProfile = ({params:{id}}:Props) => {

  if(id>10) notFound();
  return (
    <div>UserProfile {id}</div>
  )
}

export default UserProfile