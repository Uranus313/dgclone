'use client'
import Link from 'next/link';
import React, { useState } from 'react'
import { Categories } from './page';

const MegaMenu = () => {
const [selected, setSelected] = useState(0);
  return (
    <div 
             
              className=" absolute pl-20 shadow-md border-t-2 border-solid  border-grey-border  text-black flex bg-white"
            >
              <div className="bg-neutral-200 pt-3 border-l-2 border-grey-border">
                {Categories.map((category, index) => (
                  <div
                    className={`py-5 pr-3 pl-10 w-full ${
                      selected === index ? 'bg-white text-primary-color'  : 'hover:bg-white hover:text-primary-color hover:duration-300'
                    } overflow-auto`}
                    style={{ direction: 'ltr' }}
                    key={category.id}
                    onMouseEnter={() => {
                      setSelected(index);
                    }}
                  >
                    <Link href={`/products/parent/${category.id}`} className="">{category.title}</Link>
                  </div>
                ))}
              </div>

              <div className="pr-5 h-96  text-right overflow-auto " style={{direction:'ltr'}}>
                {Categories[selected].children?.map((category2) => {
                    return (
                      <div className="">
                        <Link className="" href={`/products/${category2.id}/?sortOrder=mostViewed`}>
                          <p className="mb-2 border-r-4 pr-2 border-solid border-primary-color mt-3 font-bold hover:text-primary-color">
                            {category2?.title}
                          </p>
                        </Link>

                        {category2.children?.map((category3) => {
                            return (
                              <div className="py-2 text-sm text-grey-dark">
                                <Link href={`/products/${category3.id}/?sortOrder=mostViewed`}>
                                  <p className="hover:text-primary-color">{category3.title}</p>
                                </Link>
                              </div>
                            );
                          }
                        )}
                      </div>
                    );
                  
                })}
              </div>

              
            </div>
  )
}

export default MegaMenu