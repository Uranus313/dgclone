import React from 'react'
import { ProductInterface , shipmentMethod , Comment , commentType} from '@/app/components/Interfaces/interfaces'
import ClientPart from './ClientPart'
import SeeMore from '@/app/components/SeeMore/SeeMore'
import Answer from './Answer'
import AddComment from './AddCommentRequest'

interface Props {
    params: {productID: string}  
}
const ProductPage = async({params:{productID}}:Props) => {
    
    //server
    const res = await fetch(`https://localhost:8080/products/product/${productID}`)
    const temp  = await res.json()
    const product:ProductInterface = temp.product
    const recentComments:Comment[] = temp.comments

    return (
        <div className='p-5 m-10 bg-white rounded-lg'>
            {/* <h1>{temp.product} jjj</h1> */}
            <ClientPart product={product} />
            <div className='mt-20'>
                <div className="collapse collapse-arrow  bg-propBubble-bg text-black mb-3 ">
                    <input type="checkbox" className="peer"/>
                    <div 
                     className="collapse-title text-xl font-medium bg-propBubble-bg ">
                       <h2 className=''>معرفی</h2> 
                    </div>
                    <div style={{ wordSpacing:'5px',lineHeight:'30px'}} 
                    className="collapse-content bg-white border-2 border-propBubble-bg">
                        <p className='mt-5'>{product?.description}</p>
                    </div>
                </div>

                <div className="collapse collapse-arrow  bg-propBubble-bg text-black mb-3 ">
                    <input type="checkbox" className="peer"/>
                    <div 
                     className="collapse-title text-xl font-medium bg-propBubble-bg ">
                       <h2 className=''>مشخصات</h2> 
                    </div>
                    <div style={{ wordSpacing:'5px',lineHeight:'30px'}} 
                    className="collapse-content bg-white border-2 border-propBubble-bg">
                        <div className='mt-5 '>
                                    <table className="w-full text-right table-auto min-w-max">
                                        <tbody>
                            {product.details.map(detail=>(
                                <>
                                    <tr>
                                        <td>{detail.title}</td>
                                    </tr>
                                    {Object.entries(detail.map).map(([key, value]) => (
                                    <tr className="hover:bg-slate-50" key={key}>
                                        <td className="p-4 w-1/5">
                                        <p className="block text-grey-dark text-sm text-slate-800">
                                            {key}:
                                        </p>
                                        </td>
                                        <td className="p-4 border-b border-grey-border">
                                        <p className="block text-sm text-slate-800">
                                            {value}
                                        </p>
                                        </td>
                                    </tr>
                                    ))}
                                </>
                            ))}
                            </tbody>
                        </table>
                        </div>
                    </div>
                </div>

                <div className="collapse collapse-arrow  bg-propBubble-bg text-black mb-3 ">
                    <input type="checkbox" className="peer"/>
                    <div 
                     className="collapse-title text-xl font-medium bg-propBubble-bg ">
                       <h2 className=''>بازخورد ها</h2> 
                    </div>
                    <div style={{ wordSpacing:'5px',lineHeight:'30px'}} 
                    
                    className="collapse-content max-h-96 overflow-auto bg-primary-bg border-2 border-propBubble-bg">
                        <AddComment productID={productID} type="comment" />

                        {recentComments?.map((comment , index) =>{
                            console.log(comment)
                            if (comment.comment_type == 0){
                                return <div key={comment._id} className='mt-5 p-4 bg-white border border-grey-border'>
                                    <div className='flex mt-5'>
                                        <p className='text-grey-dark text-sm'>{comment?.user?.firstname} {comment?.user?.lastname}</p>
                                        {comment.order && <p className=' bg-primary-color text-white p-1 text-xs rounded-md mx-2'>خریدار</p>}
                                    </div>
                                    {comment.rate && <div className="rating mt-5 ">
                                        <input  disabled = {!(comment.rate==1)} checked= {comment.rate==1}  type="radio" name={`rating-${index}`} className="mask mask-star-2 bg-primary-color" />
                                        <input  disabled = {!(comment.rate==2)} checked= {comment.rate==2}  type="radio"name={`rating-${index}`} className="mask mask-star-2 bg-primary-color" />
                                        <input  disabled = {!(comment.rate==3)} checked= {comment.rate==3}  type="radio" name={`rating-${index}`} className="mask mask-star-2 bg-primary-color" />
                                        <input  disabled = {!(comment.rate==4)} checked= {comment.rate==4}  type="radio" name={`rating-${index}`} className="mask mask-star-2 bg-primary-color" />
                                        <input  disabled = {!(comment.rate==5)} checked= {comment.rate==5}  type="radio" name={`rating-${index}`} className="mask mask-star-2 bg-primary-color" />
                                    </div>}
                                    <p className='my-5'>{comment.content}</p>
                                    {comment.order && <div className='flex my-5'>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 ml-2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 0 0 2.25 1.016c.896 0 1.7-.393 2.25-1.015a3.001 3.001 0 0 0 3.75.614m-16.5 0a3.004 3.004 0 0 1-.621-4.72l1.189-1.19A1.5 1.5 0 0 1 5.378 3h13.243a1.5 1.5 0 0 1 1.06.44l1.19 1.189a3 3 0 0 1-.621 4.72M6.75 18h3.75a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75H6.75a.75.75 0 0 0-.75.75v3.75c0 .414.336.75.75.75Z" />
                                        </svg>
                                            
                                        <p className='text-xs'>{comment.order?.sellerTitle}</p>
                                        <div className='h-4 w-4 mx-2 border-grey-dark border rounded-full' style={{backgroundColor:comment.order.color.hex}}></div>
                                    </div>}
                                
                                </div>
                            }
                        })}
                    </div>
                </div>

                <div className="collapse collapse-arrow  bg-propBubble-bg text-black mb-3 ">
                    <input type="checkbox" className="peer"/>
                    <div 
                     className="collapse-title text-xl font-medium bg-propBubble-bg ">
                       <h2 className=''>پرسش ها</h2> 
                    </div>
                    <div style={{ wordSpacing:'5px',lineHeight:'30px'}} 
                    className="collapse-content bg-white border-2 border-propBubble-bg">
                        <AddComment productID={productID} type="question" />
                        {recentComments?.map((comment , index) =>{
                            console.log(comment)
                            if (comment.comment_type == 0){
                                const answers = comment?.answers ?? []
                                return <div key={comment._id} className='mt-5 p-4 bg-white border border-grey-border'>
                                    <div className='flex items-center'>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-8 text-primary-color">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" />
                                        </svg>
                                        <p className='my-5 mx-2'>{comment.content}</p>
                                    </div>
                                    <SeeMore minItemsCount={1}>
                                        {answers.map((item, index) => (
                                            <div className=' pt-3' key={index}>
                                                <div className='flex'>
                                                    <p className='text-grey-dark text-sm ml-4'>پاسخ</p>
                                                    <div>
                                                        <p className='text-grey-dark text-sm'>{item.content}</p>
                                                        <p className='text-xs text-grey-light my-4'>{comment?.user?.firstname} {comment?.user?.lastname}</p>
                                                    </div>
                                                </div>
                                                
                                                <hr className='text-grey-border mb-3 mt-10' />
                                            </div>
                                        ))} 
                                    </SeeMore>
                                    <hr className='text-grey-border mt-5 mb-5'></hr>
                                    <Answer questionID={comment._id} questionContent={comment.content}/>      
                                
                                </div>
                            }
                        })}
                    </div>
                </div>
            </div>
        </div>

    )
}

export default ProductPage