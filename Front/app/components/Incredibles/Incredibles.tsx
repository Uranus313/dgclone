import Image from 'next/image'
import React from 'react'


interface incredible {
    title:string,
    price:number,
    offpercent:string,
    image:string,
    id:string
}

const incredibles : incredible[] = [
    {   
        id:'1',
        title:'تبلت شیائومی مدل Redmi Pad SE ظرفیت 256 گیگابایت و رم 8 گیگابایت ',
        price:9994000,
        offpercent:'4%',
        image:'https://dkstatics-public.digikala.com/digikala-products/0d959cfe63ed2740e1a2684ef60d55ba854b2adf_1705166001.jpg',
    },
    {   
        id:'2',
        title:'تبلت شیائومی مدل Redmi Pad SE ظرفیت 256 گیگابایت و رم 8 گیگابایت ',
        price:9994000,
        offpercent:'4%',
        image:'https://dkstatics-public.digikala.com/digikala-products/0d959cfe63ed2740e1a2684ef60d55ba854b2adf_1705166001.jpg',
    },
    {   
        id:'3',
        title:'تبلت شیائومی مدل Redmi Pad SE ظرفیت 256 گیگابایت و رم 8 گیگابایت ',
        price:9994000,
        offpercent:'4%',
        image:'https://dkstatics-public.digikala.com/digikala-products/0d959cfe63ed2740e1a2684ef60d55ba854b2adf_1705166001.jpg',
    },
    {   
        id:'1',
        title:'تبلت شیائومی مدل Redmi Pad SE ظرفیت 256 گیگابایت و رم 8 گیگابایت ',
        price:9994000,
        offpercent:'4%',
        image:'https://dkstatics-public.digikala.com/digikala-products/0d959cfe63ed2740e1a2684ef60d55ba854b2adf_1705166001.jpg',
    },
    {   
        id:'2',
        title:'تبلت شیائومی مدل Redmi Pad SE ظرفیت 256 گیگابایت و رم 8 گیگابایت ',
        price:9994000,
        offpercent:'4%',
        image:'https://dkstatics-public.digikala.com/digikala-products/0d959cfe63ed2740e1a2684ef60d55ba854b2adf_1705166001.jpg',
    },
    {   
        id:'3',
        title:'تبلت شیائومی مدل Redmi Pad SE ظرفیت 256 گیگابایت و رم 8 گیگابایت ',
        price:9994000,
        offpercent:'4%',
        image:'https://dkstatics-public.digikala.com/digikala-products/0d959cfe63ed2740e1a2684ef60d55ba854b2adf_1705166001.jpg',
    },
    {   
        id:'1',
        title:'تبلت شیائومی مدل Redmi Pad SE ظرفیت 256 گیگابایت و رم 8 گیگابایت ',
        price:9994000,
        offpercent:'4%',
        image:'https://dkstatics-public.digikala.com/digikala-products/0d959cfe63ed2740e1a2684ef60d55ba854b2adf_1705166001.jpg',
    },
    {   
        id:'2',
        title:'تبلت شیائومی مدل Redmi Pad SE ظرفیت 256 گیگابایت و رم 8 گیگابایت ',
        price:9994000,
        offpercent:'4%',
        image:'https://dkstatics-public.digikala.com/digikala-products/0d959cfe63ed2740e1a2684ef60d55ba854b2adf_1705166001.jpg',
    },
    {   
        id:'3',
        title:'تبلت شیائومی مدل Redmi Pad SE ظرفیت 256 گیگابایت و رم 8 گیگابایت ',
        price:9994000,
        offpercent:'4%',
        image:'https://dkstatics-public.digikala.com/digikala-products/0d959cfe63ed2740e1a2684ef60d55ba854b2adf_1705166001.jpg',
    },
]


interface Props{
    color?:string;
    categoryID?: string;
}

const Incredibles = ({color ='', categoryID=''}:Props) => {
  return (
    <div style={{backgroundColor:color}} className={`${ color === '' ? 'bg-primary-color'  : '' } flex w-full rounded-lg overflow-x-scroll p-5 `}>
         <div className='pl-10 pr-5'>
            <h1 className='text-white text-center'>پیشنهاد</h1>
            <h1 className='text-white text-center'>شگفت</h1>
            <h1 className='text-white text-center'>انگیز</h1>
         </div>
         <div className=' flex rounded-lg '>
            {incredibles.map((incredible)=>{
                console.log(categoryID)
                return <div  className='bg-white text-black rounded-md w-44 ml-2 pt-1 pb-3' key={incredible.id}>
                    <img className='rounded-t-md' src={incredible.image} alt='product picture'/>
                    <p className='px-3 text-grey-dark line-clamp-2'>{incredible.title}</p>
                    <p className='px-3 font-semibold line-clamp-2'>{incredible.price} تومان</p>
                </div>
            })}
         </div>
    </div>
  )
}

export default Incredibles