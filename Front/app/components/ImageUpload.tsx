'use client'
import Image, { StaticImageData } from 'next/image'
import React, { useRef, useState } from 'react'
import DefaultImage from './images.png'

interface Props{
    setImages: React.Dispatch<React.SetStateAction<string[]>>
}
const ImageUpload = ({setImages}:Props) => {
    const [image, setImage] = useState<StaticImageData | string>(DefaultImage)
    const fileLoadRef = useRef<HTMLInputElement>(null)
    const [isloading , setIsLoading]=useState(false)
    const isAdded = useRef(false)

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
                    setImage(data?.location)

                    if(!isAdded.current){
                        isAdded.current=true
                        setImages(prevImages=>[...prevImages , data?.location])
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
