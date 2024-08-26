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
            <button className={`text-sm mx-2 ${searchParams.get('sortOrder')==='mostViewed'?'text-primary-color' :''}`} onClick={()=>updateQueries({dicts:[{param:'sortOrder',value:'mostViewed'}] , searchParams:searchParams})}>پربازدید ترین</button>
            <button className={`text-sm mx-2 ${searchParams.get('sortOrder')==='bestSellers'?'text-primary-color' :''}`} onClick={()=>updateQueries({dicts:[{param:'sortOrder',value:'bestSellers'}] , searchParams:searchParams})}>پرفروش ترین</button>
            <button className={`text-sm mx-2 ${searchParams.get('sortOrder')==='cheapest'?'text-primary-color' :''}`} onClick={()=>updateQueries({dicts:[{param:'sortOrder',value:'cheapest'}] , searchParams:searchParams})}>ارزان ترین</button>
            <button className={`text-sm mx-2 ${searchParams.get('sortOrder')==='mostExpensive'?'text-primary-color' :''}`} onClick={()=>updateQueries({dicts:[{param:'sortOrder',value:'mostExpensive'}] , searchParams:searchParams})}>گران ترین</button>
            <button className={`text-sm mx-2 ${searchParams.get('sortOrder')==='newest'?'text-primary-color' :''}`} onClick={()=>updateQueries({dicts:[{param:'sortOrder',value:'newest'}] , searchParams:searchParams})}>جدید ترین</button>
        </div>
    )
}

export default Sort