'use client'
import { updateQueries } from '@/app/Functions/ServerFunctions'
import useQueryNext from '@/app/hooks/useQueryNext'
import React from 'react'

interface Props{
    id:string,
    title:string,
    index?:number,
    query:string
}
const Checkbox = ({id,title,index,query}:Props) => {
  const {searchParams, handleRemoveQueryParam} = useQueryNext()
  return (
    <div id={id} className="form-control m-2 ">
        <label className="label cursor-pointer">
            <span className="label-text text-black">{title}</span>
            <input type="checkbox" className="checkbox border-2 border-primary-seller [--chkbg:theme(colors.primary-seller)] [--chkfg:white] checked:border-primary-seller" 
                onChange={(e)=>{e.target.checked? updateQueries({dicts:[{param:`${query}[${index??''}]`,value:id}] , searchParams:searchParams}) : handleRemoveQueryParam(`${query}[${index??''}]`)}}
                />
        </label>
        <hr className='text-grey-border mt-2 w-10/12 text-center'></hr>
    </div>
  )
}

export default Checkbox