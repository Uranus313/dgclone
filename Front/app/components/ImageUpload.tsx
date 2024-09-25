'use client'
import Image, { StaticImageData } from 'next/image'
import React, { useEffect, useRef, useState } from 'react'
import DefaultImage from './images.png'

interface Props{
    setImages: React.Dispatch<React.SetStateAction<string[]>>
    prevProductImage?:string
    defaultImage?:boolean
    index?:number
}
const ImageUpload = ({index,setImages,prevProductImage,defaultImage=false}:Props) => {
    const [image, setImage] = useState<StaticImageData | string>(DefaultImage)
    const fileLoadRef = useRef<HTMLInputElement>(null)
    const [isloading , setIsLoading]=useState(false)
    const isAdded = useRef(false)
    const set = useRef(false)

    if (prevProductImage && !set.current && !defaultImage) {
        setImage(prevProductImage);
        isAdded.current=true
        set.current=true
    }


    function HandlImageUpload(event: React.MouseEvent<HTMLButtonElement>) {
        event.preventDefault()
        fileLoadRef.current?.click()
        // Add your image upload logic here
    }

    async function uploadImageDisplay() {
        try{
            setIsLoading(true)
            const temp = fileLoadRef.current?.files
            if (temp) {
                const uploadedFile = temp[0]
                const formData = new FormData()
                formData.append("file",uploadedFile)
                
                const res = await fetch('https://api.escuelajs.co/api/v1/files/upload',{
                    method:'post',
                    body:formData
                })
    
                if(res.status==201){
                    setIsLoading(false)
                    const data = await res.json()
                    if (!defaultImage){
                        setImage(data?.location)
                    }

                    if(!isAdded.current){
                        if(!defaultImage){
                            isAdded.current=true
                        }else{
                            setImages(prevImages=>[...prevImages , data?.location])
                        }
                    
                    }else if(isAdded.current){
                        setImages(prevImages => 
                            prevImages.map((image, i) => 
                              i === index ? data?.location : image
                            )
                          );
                          

                    }
                }
                //const cachedURL = URL.createObjectURL(uploadedFile)
                //setImage(cachedURL)
    
            }

        }
        catch(error){
            console.log(error)
            setIsLoading(false)
        }
    }

    return (
        <div>
            <button type='submit' className='relative h-32 w-32 object-cover ' onClick={(e) => HandlImageUpload(e)}>
                <Image alt='' className='object-cover' fill={true} src={image} />
                {isloading && <span className="loading loading-dots loading-lg absolute top-8 left-8 z-20"></span>}
            </button>

            <form id='formImage' encType='multipart/form-data'>
                <input ref={fileLoadRef} type='file' id='fileImage' className='hidden'
                    onChange={uploadImageDisplay}    
                />
            </form>
        </div>
    )
}

export default ImageUpload
