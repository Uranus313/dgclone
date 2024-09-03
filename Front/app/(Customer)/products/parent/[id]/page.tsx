import React from 'react'
import styles from './BG.module.css'
import { Categories, Category } from '@/app/(Customer)/page';
import Incredibles from '@/app/components/Incredibles/Incredibles';
import BestProducts from '@/app/components/BestProducts/BestProducts';
import Link from 'next/link';
import { getCategory } from '@/app/Functions/ServerFunctions';


interface Props {
  params: {id:string}
}

const ParentCategoryPage = ({params:{id}}:Props) => {

  let category = getCategory(id) 
  const descs = category?.desc?.split("/") ?? [];

  return (
    <div className='w-full' >
      <div className={styles.bgImage} style={{backgroundImage: `url(${category?.pictures[0]})`}} >

        <div className='mx-20 p-6 rounded-lg' style={{backgroundColor:'rgba(0,0,0,0.5)', backdropFilter: 'blur(10px)'}}>
          {descs.map(desc=>(
            <h1 className='text-white font-black p-2'>
              {desc}
            </h1>
          ))}

          <Link href={'/products/'+id}><button style={{backgroundColor:category?.theme}} className='text-white py-2 px-4 mt-4 text-lg font-black rounded-md'>بزن بریم</button></Link>
        </div>
      </div>

      <div className='m-14'>
        <Incredibles color={category?.theme} categoryID={category?.id} />
      </div>

      <div className='flex flex-col items-center'>
        <h1 className='font-bold my-10 text-black'>
          انتخاب بر اساس دسته بندی
        </h1>
        <div className='bg-white place-content-center justify-center w-11/12 p-10 mb-5 grid grid-cols-5'>
          {category?.children?.map((category)=>{
              return <Link href={`/products/${category.id}/?sortOrder=mostViewed`} key={category.id} className='flex flex-col items-center'>
                <img className=' w-3/5' src={category.pictures[2]}/>
                <h1 className='font-light my-3'>{category.title}</h1>
              </Link>
          })}
        </div>
      </div>

      <div className='flex flex-col items-center'>
          <h1 className='font-bold my-10 text-black'>
            پرفروش ترین ها
          </h1>

        <div className='w-full'>    
          <BestProducts filter='best-sellers' color={category?.theme} categoryID={category?.id}/>
        </div>
      
      </div>
    </div>

   
  )
}


export default ParentCategoryPage