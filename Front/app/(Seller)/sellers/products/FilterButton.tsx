'use client'
import { updateQueries } from '@/app/Functions/ServerFunctions'
import useQueryNext from '@/app/hooks/useQueryNext'
import React from 'react'

interface Props{
    id:string,
    title:string,
    query:string
}
const FilterButton = ({id,title,query}:Props) => {
    const {searchParams}=useQueryNext()
  return (
    <button onClick={()=>updateQueries({dicts:[{param:`${query}`,value:id}] , searchParams:searchParams})} className="text-primary-seller">{title}</button>

  )
}

export default FilterButton