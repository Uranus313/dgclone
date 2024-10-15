'use client'
import { updateQueries } from '@/app/Functions/ServerFunctions'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import React from 'react'



const Sort = () => {
    const searchParams = useSearchParams()
    searchParams.delete
    return (
        <div>
            <button className={`text-sm mx-2 ${searchParams.get('sortOrder')==='1'?'text-primary-color' :''}`} onClick={()=>updateQueries({dicts:[{param:'sortOrder',value:'1'}] , searchParams:searchParams})}>پربازدید ترین</button>
            <button className={`text-sm mx-2 ${searchParams.get('sortOrder')==='2'?'text-primary-color' :''}`} onClick={()=>updateQueries({dicts:[{param:'sortOrder',value:'2'}] , searchParams:searchParams})}>ارزان ترین</button>
            <button className={`text-sm mx-2 ${searchParams.get('sortOrder')==='3'?'text-primary-color' :''}`} onClick={()=>updateQueries({dicts:[{param:'sortOrder',value:'3'}] , searchParams:searchParams})}>گران ترین</button>
            <button className={`text-sm mx-2 ${searchParams.get('sortOrder')==='4'?'text-primary-color' :''}`} onClick={()=>updateQueries({dicts:[{param:'sortOrder',value:'4'}] , searchParams:searchParams})}>جدید ترین</button>
        </div>
    )
}

export default Sort