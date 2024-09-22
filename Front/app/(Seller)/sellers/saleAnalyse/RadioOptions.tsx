'use client'
import { updateQueries } from '@/app/Functions/ServerFunctions'
import useQueryNext from '@/app/hooks/useQueryNext'
import React from 'react'


interface Props{
    id:string,
    title:string,
    query:string
    name:string
}

const RadioOptions = ({id,title,query,name}:Props) => {
    const {searchParams, handleRemoveQueryParam} = useQueryNext()
    return (
      <div id={id} className="form-control m-2 ">
          <label className="label cursor-pointer">
              <span className="label-text text-black">{title}</span>
              <input type="radio" name={name} className="radio checked:bg-primary-seller border-2 border-primary-seller [--chkbg:theme(colors.primary-seller)] [--chkfg:white] checked:border-primary-seller" 
                  onChange={(e) => {
                    if (e.target.checked) {
                      handleRemoveQueryParam(`${query}`);
                      updateQueries({ dicts: [{ param: `${query}`, value: id }], searchParams: searchParams });
                    } else {
                      handleRemoveQueryParam(`${query}`);
                    }
                  }}                  
                  />
          </label>
          <hr className='text-grey-border mt-2 w-10/12 text-center'></hr>
      </div>
    )
}

export default RadioOptions