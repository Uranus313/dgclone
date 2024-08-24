'use client'
import React, { useState } from 'react'
import MultiRangeSlider from './MultiRangeSlider/MultiRangeSlider';
import { usePathname, useRouter } from 'next/navigation';

interface FilterInterface{
    title: string;
    options: string[];
    query: string;
}

interface FilterResponseInterface{
    filters:FilterInterface[];
    priceRange:{max:number , min:number};
}

const Filter = () => {
  const manage = useRouter()
  const pathname = usePathname()

  const filtersRes : FilterResponseInterface = {
    filters : [
        {
            title: 'برند',
            options: ['Apple' , 'Samasong' , 'Xiaomi','Asus','Lenovo'],
            query: 'brand',
        },
        {
            title: 'رنگ',
            options: ['#bbb4fa' , '#e7b4fa' , '#4b2ad1','#2f2c3d','#c41466','#ffffff','#000000'],
            query: 'color',
        },
    ]
    ,
    priceRange:{max:90000000 , min:0}
  }

  const [minVal, setMinVal] = useState<number>(filtersRes.priceRange.min);
  const [maxVal, setMaxVal] = useState<number>(filtersRes.priceRange.max);

  return (
    <div>
        <h1 className='p-3 py-8'>فیلتر ها</h1>
        <div className="form-control m-2 ">
            <label className="label  cursor-pointer">
                <span className="label-text text-xl">فقط موجود</span>
                <input type="checkbox" className=" toggle toggle-primary disabled:bg-black"  />
            </label>
            <hr className='text-grey-border mt-2 w-10/12 text-center'></hr>
        </div>

        <div className='collapse collapse-arrow join-item '>
            <input type="checkbox" className='' name="my-accordion-4"  />
            <div className="collapse-title text-xl font-medium">بازه قیمتی</div>
            <div className="collapse-content ">
                
                <div className='w-full' >
                    <label className="label w-full cursor-pointer">
                    <span className="label-text text-xl text-black">از</span>
                    <input className='w-4/5 text-3xl' value={minVal} onChange={(e)=>{setMinVal(Number(e.target.value)) , manage.push(`${pathname}& min=${e.target.value}`)}} type='number'/>
                    </label>
                </div>

                <div className='w-full' >
                    <label className="label w-full cursor-pointer">
                    <span className="label-text text-black">تا</span>
                    <input className='w-4/5 text-3xl' value={maxVal} onChange={(e)=>{setMaxVal(Number(e.target.value))}} type='number'/>
                    </label>
                </div>

                <div>
                    <MultiRangeSlider min={filtersRes.priceRange.min} max={filtersRes.priceRange.max} setMinVal={setMinVal} minVal={minVal} setMaxVal={setMaxVal} maxVal={maxVal}/>
                </div>
            </div>
            <hr className='text-grey-border w-10/12 text-center'></hr>
        </div>

        {filtersRes.filters.map((filter)=>(                   
            <div className="collapse collapse-arrow join-item ">
                <input type="checkbox" name="my-accordion-4"  />
                <div className="collapse-title text-xl font-medium">{filter.title}</div>
                <div className="collapse-content">
                    {<div>
                        {filter.options.map(option=>(
                            <label className="label cursor-pointer">
                            {filter.query=='color' 
                                ? <div style={{backgroundColor:option , height:'30px',width:'30px'}} className='border border-grey-dark rounded-sm'></div>
                                : <span className="label-text text-black">{option}</span>}
                                <input type="checkbox" className="checkbox border-2 border-primary-color [--chkbg:theme(colors.primary-color)] [--chkfg:white] checked:border-primary-color" />
                            </label>
                        ))}
                    </div>}
                </div>
                <hr className='text-grey-border w-10/12 text-center'></hr>
            </div> 
        ))}
    </div>
  )
}

export default Filter