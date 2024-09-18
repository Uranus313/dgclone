'use client'
import React, { useEffect, useRef, useState } from 'react'

interface Props{
    images :string[]
}
const Gallery = ({images}:Props) => {
    const [dialogElement, setDialogElement] = useState<HTMLDialogElement | null>(null);

    useEffect(() => {
      setDialogElement(document.getElementById("gallery") as HTMLDialogElement | null);
    }, []);

  return (
    <div className='grid grid-cols-5'>
        <img className='col-span-5' src={images[0]}></img>
            {images.map(image=>(
                <div onClick={()=>dialogElement?.showModal()} className='p-2 border border-grey-border rounded-md mx-1'>
                    <img className='col-span-1' src={image} />  
                </div>
            )).slice(1,Math.max(5 ,images.length-1))}

            <div onClick={()=>dialogElement?.showModal()} className='p-2 border border-grey-border rounded-md mx-1 '>
                <img className='col-span-1 blur-sm' src={images[images.length-1]} />  
            </div>
            
            <dialog id="gallery" className="modal">
                <div className="modal-box">
                    <form method="dialog">
                    {/* if there is a button in form, it will close the modal */}
                    <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 z-10">✕</button>
                    </form>
                    
                    <div className="carousel w-full">
                        {images.map((image , index) =>(
                            <div id={`slide${index}`} className="carousel-item relative w-full">
                                <img
                                src={image}
                                className="w-full" />
                                <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
                                <a href={`#slide${index+1}`} className="btn btn-circle">❮</a>
                                <a href={`#slide${index-1}`} className="btn btn-circle">❯</a>
                                </div>
                            </div>
                        ))}
                    </div>

                </div>
            </dialog>
    </div>
  )
}

export default Gallery