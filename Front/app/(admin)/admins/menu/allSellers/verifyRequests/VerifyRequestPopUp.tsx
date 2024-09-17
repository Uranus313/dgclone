'use client'

import userContext from '@/app/contexts/userContext';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import React, { useContext, useRef, useState } from 'react'
import { VerifyRequest } from '../../../hooks/useGetVerifyRequests';
import { Seller } from '../SellerPopUp';
import { Admin } from '../../allAdmins/AdminPopUp';


export interface Props{
    verifyRequest : VerifyRequest
}
const AdminPopUp = ({verifyRequest} : Props) => {
    const [isOpen, setIsOpen] = useState(false);
    const dialogRef = useRef<HTMLDialogElement>(null);
    const [error , setError] = useState<string | null>(null);
    const [seller , setSeller] = useState<Seller | null>(null);
    const [admin , setAdmin] = useState<Admin | null>(null);
    // const { user} = useContext(userContext);
  
    const openModal = () => {
      if (dialogRef.current) {
        dialogRef.current.showModal();
        setIsOpen(true);
      }
    };
  
    const closeModal = () => {
      if (dialogRef.current) {
        dialogRef.current.close();
        setIsOpen(false);
      }
    };
    interface RequestAnswer{
        requestID : string  ;
         state : string;
    }
    const queryClient = useQueryClient();
    const answerTheRequest = useMutation({
        mutationFn: async ({requestID   , state } :  RequestAnswer) => {
            const result = await fetch("http://localhost:3005/users/seller/verifyRequest", {
                  method: "PATCH",
                  credentials: 'include',
                  headers: {
                    "Content-Type": "application/json",
                  },

                  body: JSON.stringify({requestID : requestID , state : state}),
            });
            const jsonResult = await result.json();
            if(result.ok){
                return jsonResult
            }else{
                throw new Error(jsonResult.error);
            }    
        },
        onSuccess: (savedUser) =>{
            console.log(savedUser);
            // localStorage.setItem("auth-token",savedUser.headers["auth-token"]);
            queryClient.invalidateQueries({queryKey : ["verifyRequestList"]});
            // setUser(savedUser);
            // verifyRequest.state = true;
            closeModal();
            // router.push('/');
            // router.push('/');
        },
        onError: (error) => {

          console.log(error);
          setError(error.message)
          // setError(error)
        }
    });
    async function getSeller(sellerID : string){
        const result = await fetch("http://localhost:3005/users/general/allSellers/" + sellerID, {
            method: "GET",
            credentials: 'include',
            headers: {
              "Content-Type": "application/json",
            },

      });
      const jsonResult = await result.json();
      if(result.ok){
          setSeller(jsonResult);
      }else{
          throw new Error(jsonResult.error);
      }
    }
    async function getAdmin(adminID : string){
        const result = await fetch("http://localhost:3005/users/general/allAdmins/" + adminID, {
            method: "GET",
            credentials: 'include',
            headers: {
              "Content-Type": "application/json",
            },

      });
      const jsonResult = await result.json();
      if(result.ok){
          setAdmin(jsonResult);
      }else{
          throw new Error(jsonResult.error);
      }
    }
    return (
      <div>
        <div onClick={() => {
            openModal();
            getSeller(verifyRequest.sellerID);
            if(verifyRequest.adminID){
                getAdmin(verifyRequest.adminID);
            }
        }} className=' flex justify-between'>
            <p>{verifyRequest.sellerID}</p>
            <p>{verifyRequest.requestDate }</p>
            <p>{verifyRequest.state }</p>
        </div>

        <dialog ref={dialogRef} className="modal">
          <div className="modal-box">
            {error && <p>{error}</p>}
            {(!seller && !error) && <span className="loading loading-dots loading-lg"></span>}
            {seller && <div>
                <h3 className="font-bold text-lg">
            {seller.storeInfo?.commercialName} + {" " + seller._id}
          </h3>
          {seller.isBanned && <h3>بن شده</h3>}
          <div className="block">
            <div className=" flex justify-between">
              <p>شماره تلفن :</p>

              <p>{seller.phoneNumber}</p>
            </div>
            <div className=" flex justify-between">
              <p>امتیاز :</p>

              <p>{seller.rating}</p>
            </div>
            <div className=" flex justify-between">
              <p>آیدی :</p>

              <p>{seller._id}</p>
            </div>
            <div className=" flex-col">
              <h3>مشخصات صاحب فروشگاه</h3>
              <div className=" flex justify-between">
                <p>نام :</p>

                <p>{seller.storeOwner.firstName}</p>
              </div>
              <div className=" flex justify-between">
                <p>نام خانوادگی :</p>

                <p>{seller.storeOwner.lastName}</p>
              </div>
              <div className=" flex justify-between">
                <p>ایمیل :</p>

                <p>{seller.storeOwner.email}</p>
              </div>
              <div className=" flex justify-between">
                <p>کد ملی :</p>

                <p>{seller.storeOwner.nationalID}</p>
              </div>
              <div className=" flex justify-between">
                <p>تاریخ تولد :</p>

                <p>{seller.storeOwner.birthDate}</p>
              </div>
            </div>
            <div className=" flex-col">
              <h3>روش بازگشت پول</h3>
              <div className=" flex justify-between">
                <p>شیوه انتخابی :</p>

                <p>{seller.moneyReturn.method}</p>
              </div>
              <div className=" flex justify-between">
                <p>شماره کارت بانکی :</p>
                <p>{seller.moneyReturn.bankAccount}</p>
              </div>
            </div>
            <div className=" flex justify-between">
              <p>نوع موجودیت :</p>
              <p>{seller.entityType}</p>
            </div>
            <div className=" flex-col">
              <h3>اطلاعات حقوقی</h3>
              <div className=" flex justify-between">
                <p>نام شرکت</p>
                <p>{seller.legalInfo?.companyName}</p>
              </div>
              <div className=" flex justify-between">
                <p>نوع شرکت :</p>
                <p>{seller.legalInfo?.companyType}</p>
              </div>
              <div className=" flex justify-between">
                <p>کد ملی شرکت :</p>
                <p>{seller.legalInfo?.companyIDNumber}</p>
              </div>
              <div className=" flex justify-between">
                <p>شماره اقتصادی شرکت :</p>
                <p>{seller.legalInfo?.companyEconomicNumber}</p>
              </div>
              <div className=" flex justify-between">
                <p>اسم فروشگاه :</p>
                <p>{seller.legalInfo?.storeName}</p>
              </div>
              <div className=" flex-col">
                <h5>صاحبان امضا</h5>
                {seller.legalInfo?.signOwners.map((signer, index) => (
                  <p key={index}>{signer}</p>
                ))}
              </div>
            </div>
            <div className=" flex-col">
              <h3>مدارک حقیقی</h3>
              <div className=" flex justify-between">
                <p>کد ملی :</p>
                <p>{seller.individualInfo?.nationalID}</p>
              </div>
              <div className=" flex justify-between">
                <p>نوع شماره بانکی :</p>
                <p>{seller.individualInfo?.bankNumberType}</p>
              </div>
              <div className=" flex justify-between">
                <p>شماره شبا :</p>
                <p>{seller.individualInfo?.shabaNumber}</p>
              </div>
              <div className=" flex justify-between">
                <p>شماره بانکی:</p>
                <p>{seller.individualInfo?.bankNumber}</p>
              </div>
            </div>
            <div className=" flex-col">
              <h3>اطلاعات فروشگاه</h3>
              <div className=" flex justify-between">
                <p>نام تجاری :</p>
                <p>{seller.individualInfo?.shabaNumber}</p>
              </div>
              <div className=" flex justify-between">
                <p>شماره تلفن دفتر :</p>
                <p>{seller.storeInfo?.officePhoneNumber}</p>
              </div>
              <div className=" flex justify-between">
                <p>لوگو :</p>
                <p>{seller.storeInfo?.logo}</p>
              </div>
              <div className=" flex justify-between">
                <p>کد فروشنده :</p>
                <p>{seller.storeInfo?.sellerCode}</p>
              </div>
              <div className=" flex justify-between">
                <p>درباره فروشگاه :</p>
                <p>{seller.storeInfo?.aboutSeller}</p>
              </div>
              <div className=" flex justify-between">
                <p>وبسایت فروشگاه :</p>
                <p>{seller.storeInfo?.sellerWebsite}</p>
              </div>
              <div className=" flex-col">
                <h5>روز های کاری فروشگاه</h5>
                {seller.storeInfo?.workDays.map((day, index) => (
                  <p key={index}>{day}</p>
                ))}
              </div>
              <div className=" flex-col">
                <h5>روز های تعطیل فروشگاه</h5>
                {seller.storeInfo?.offDays.map((day, index) => (
                  <p key={index}>{day}</p>
                ))}
              </div>
            </div>
            <div className=" flex-col">
              <h3>مدارک دیگر</h3>
              {seller.additionalDocuments.map((info, index) => (
                <a href="info" key={index} target="_blank">
                  {info}
                </a>
              ))}
            </div>
            <div className=" flex-col">
              <h3>آدرس فروشگاه</h3>
                  <div className=" m-3" >
                    {seller.storeAddress.additionalInfo && <p>{seller.storeAddress.additionalInfo}</p>}
                    <p>{seller.storeAddress.city}</p>
                    <p>{seller.storeAddress.postalCode}</p>
                    <p>{seller.storeAddress.coordinates.x}</p>
                    <p>{seller.storeAddress.coordinates.y}</p>
                  </div>
            </div>
            <div className=" flex-col">
              <h3>آدرس انبار</h3>
                  <div className=" m-3" >
                    {seller.warehouseAddress.additionalInfo && <p>{seller.warehouseAddress.additionalInfo}</p>}
                    <p>{seller.warehouseAddress.city}</p>
                    <p>{seller.warehouseAddress.postalCode}</p>
                    <p>{seller.warehouseAddress.coordinates.x}</p>
                    <p>{seller.warehouseAddress.coordinates.y}</p>
                  </div>
            </div>
          </div>
                </div>}
            {admin && <div>
            <h2>ادمین</h2>
            <h3 className="font-bold text-lg">{admin?.firstName + ' ' + admin?.lastName}</h3>
            <div className='block'>
                <div className=' flex justify-between'>
                <p>ایمیل :</p>

                    <p>{admin?.email}</p>
                </div>
                <div className=' flex justify-between'>
                <p>شماره تلفن :</p>

                    <p>{admin?.phoneNumber}</p>
                </div>
                <div className=' flex justify-between'>
                <p>کد ملی :</p>

                    <p>{admin?.nationalID}</p>
                </div>
                <div className=' flex justify-between'>
                <p>تاریخ تولد :</p>

                    <p>{admin?.birthDate}</p>
                </div>
                <div className=' flex justify-between'>
                <p>آیدی :</p>

                    <p>{admin?._id}</p>
                </div>
            </div>
            </div>}
            
            {verifyRequest.state != "pending" &&
            <button
              className="btn btn-primary"
              type="button"
              onClick={() => answerTheRequest.mutate({requestID : verifyRequest._id , state: "rejected"})}
            >
              رد
            </button>
           }
          {verifyRequest.state != "pending" &&
            <button
              className="btn btn-error"
              type="button"
              onClick={() => answerTheRequest.mutate({requestID : verifyRequest._id , state: "accepted"})}
            >
                تایید
            </button>
          }
            <button className='btn btn-warning' type='button' onClick={closeModal}>خروج</button>
          
          </div>
          <form method="dialog" className="modal-backdrop" onClick={closeModal}>
            <button type="button">close</button>
          </form>
        </dialog>
      </div>
    );
}

export default AdminPopUp
