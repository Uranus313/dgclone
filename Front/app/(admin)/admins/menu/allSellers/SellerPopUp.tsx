"use client";

import { Wallet } from "@/app/(Customer)/users/menu/layout";
import userContext from "@/app/contexts/userContext";
import { useMutation } from "@tanstack/react-query";
import React, { useContext, useRef, useState } from "react";

export interface Seller {
  storeOwner: {
    firstName: string | null | undefined;
    lastName: string | null | undefined;
    email: string | null | undefined;
    birthDate: string | null | undefined;
    nationalID: string | null | undefined;
  };
  isBanned: boolean | undefined;
  phoneNumber: string;
  _id: string;
  rating: number;
  isVerified: boolean | undefined;
  walletID: string;
  moneyReturn: {
    method: "bankAccount" | "wallet";
    bankAccount: string | null | undefined;
  };
  entityType: "individual" | "legal";
  additionalDocuments: string[];
  legalInfo:
  | {
    companyName: string;
    companyType:
    | "publicCompany"
    | "privateCompany"
    | "limitedLiability"
    | "cooperative"
    | "jointLiability"
    | "institution"
    | "other";
    companyIDNumber: string;
    companyEconomicNumber: string;
    ShabaNumber: string;
    signOwners: string[];
    storeName: string;
  }
  | undefined;
  individualInfo:
  | {
    nationalID: string;
    bankNumberType: "shaba" | "bank";
    shabaNumber: string | undefined;
    bankNumber: string | undefined;
  }
  | undefined;
  storeInfo:
  | {
    commercialName: string;
    officePhoneNumber: string;
    workDays: string[];
    logo: string | undefined;
    sellerCode: string;
    aboutSeller: string | undefined;
    sellerWebsite: string | undefined;
    offDays: string[];
  }
  | undefined;
  storeAddress: {
    country: string;
    province: string;
    city: string;
    postalCode: string;
    additionalInfo: string | null | undefined;
    number: string | null | undefined;
    unit: string | null | undefined;
    coordinates: {
      x: string;
      y: string;
    };
  };
  warehouseAddress: {
    country: string;
    province: string;
    city: string;
    postalCode: string;
    additionalInfo: string | null | undefined;
    number: string | null | undefined;
    unit: string | null | undefined;
    coordinates: {
      x: string;
      y: string;
    };
  };
}
export interface Props {
  seller: Seller;
}
const SellerPopUp = ({ seller }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [error, setError] = useState<string | null>(null);

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
  async function getWallet(id: string) {
    if (!id) {
      return;
    }
    const result = await fetch(
      "http://localhost:3005/users/admin/getWallet/" + id,
      {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const jsonResult = await result.json();
    if (result.ok) {
      setWallet(jsonResult);
    } else {
      setError(jsonResult.error);
    }
  }
  const banSeller = useMutation({
    mutationFn: async () => {
      const result = await fetch(
        "http://localhost:3005/users/admin/banSeller",
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({ sellerID: seller._id }),
        }
      );
      const jsonResult = await result.json();
      if (result.ok) {
        return jsonResult;
      } else {
        throw new Error(jsonResult.error);
      }
    },
    onSuccess: (savedUser) => {
      console.log(savedUser);
      seller.isBanned = true;
      closeModal();
    },
    onError: (error) => {
      console.log(error);
      setError(error.message);
    },
  });
  const unbanSeller = useMutation({
    mutationFn: async () => {
      const result = await fetch(
        "http://localhost:3005/users/admin/unbanSeller",
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({ sellerID: seller._id }),
        }
      );
      const jsonResult = await result.json();
      if (result.ok) {
        return jsonResult;
      } else {
        throw new Error(jsonResult.error);
      }
    },
    onSuccess: (savedUser) => {
      console.log(savedUser);
      seller.isBanned = false;
      closeModal();
    },
    onError: (error) => {
      console.log(error);
      setError(error.message);
    },
  });
  const verifySeller = useMutation({
    mutationFn: async (sellerID) => {
      const result = await fetch(
        "http://localhost:3005/users/seller/verifySeller/" + seller._id,
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({ sellerID: seller._id }),
        }
      );
      const jsonResult = await result.json();
      if (result.ok) {
        return jsonResult;
      } else {
        throw new Error(jsonResult.error);
      }
    },
    onSuccess: (savedUser) => {
      console.log(savedUser);
      seller.isVerified = true;
      closeModal();
    },
    onError: (error) => {
      console.log(error);
      setError(error.message);
    },
  });
  const refuteSeller = useMutation({
    mutationFn: async (sellerID) => {
      const result = await fetch(
        "http://localhost:3005/users/seller/refuteSeller/" + seller._id,
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({ sellerID: seller._id }),
        }
      );
      const jsonResult = await result.json();
      if (result.ok) {
        return jsonResult;
      } else {
        throw new Error(jsonResult.error);
      }
    },
    onSuccess: (savedUser) => {
      console.log(savedUser);
      seller.isVerified = false;
      closeModal();
    },
    onError: (error) => {
      console.log(error);
      setError(error.message);
    },
  });
  return (
    <div>
      <div
        onClick={() => {
          openModal();
          getWallet(seller.walletID);
        }}
        className=" flex py-5 border-b-2 border-b-border-color-list text-center"
      >
        <p className="w-1/2 md:w-1/4">{(seller.storeInfo?.commercialName && seller.storeInfo?.commercialName) || "-"}</p>
        <p className="w-0 md:w-1/4 invisible md:visible">{(seller.phoneNumber && seller.phoneNumber) || "-"}</p>
        {seller.isVerified ? (
          <p className="w-1/2 md:w-1/4 text-red-500">تایید شده</p>
        ) : (
          <p className="w-1/2 md:w-1/4 text-red-500">تایید نشده</p>
        )}

        {seller.isBanned ? (
          <p className="w-0 md:w-1/4 invisible md:visible text-red-500">بن شده</p>
        ) : (
          <p className="w-0 md:w-1/4 invisible md:visible text-red-500"> -</p>
        )}

      </div>
      <dialog ref={dialogRef} className="modal break-all">
        <div className="modal-box">
          {error && <p>{error}</p>}
          <h3 className="font-bold text-lg pb-2">
            {((seller.storeInfo?.commercialName && seller.storeInfo?.commercialName || "") + " " + seller._id) || "-"}
          </h3>
          <div className="block">
            <div className=" flex pb-2">
              <p className="pl-2">شماره تلفن : </p>
              <p>{(seller.phoneNumber && seller.phoneNumber) || "-"}</p>
            </div>
            <div className=" flex pb-2">
              <p className="pl-2">امتیاز : </p>
              <p>{(seller.rating && seller.rating) || "-"}</p>
            </div>
            <div className=" flex pb-2">
              <p className="pl-2">آیدی : </p>
              <p>{seller._id}</p>
            </div>
            <div className=" flex-col ">
              <h3>مشخصات صاحب فروشگاه</h3>
              <div className=" flex pb-2">
                <p className="pl-2">نام :</p>
                {seller.storeOwner ? (
                  <p>{(seller.storeOwner.firstName && seller.storeOwner.firstName) || "-"}</p>
                ) : (
                  <p>-</p>
                )}
              </div>
              <div className=" flex pb-2">
                <p className="pl-2">نام خانوادگی :</p>
                {seller.storeOwner ? (

                  <p>{(seller.storeOwner.lastName && seller.storeOwner.lastName) || "-"}</p>
                ) : (
                  <p>-</p>
                )}
              </div>
              <div className=" flex pb-2">
                <p className="pl-2">ایمیل :</p>
                {seller.storeOwner ? (

                  <p>{(seller.storeOwner.email && seller.storeOwner.email) || "-"}</p>
                ) : (
                  <p>-</p>
                )}
              </div>
              <div className=" flex pb-2">
                <p className="pl-2">کد ملی :</p>
                {seller.storeOwner ? (

                  <p>{(seller.storeOwner.nationalID && seller.storeOwner.nationalID) || "-"}</p>
                ) : (
                  <p>-</p>
                )}

              </div>
              <div className=" flex pb-2">
                <p className="pl-2">تاریخ تولد :</p>
                {seller.storeOwner ? (
                  <p>{(seller.storeOwner.birthDate && seller.storeOwner.birthDate) || "-"}</p>
                ) : (
                  <p>-</p>
                )}

              </div>
            </div>
            <div className=" flex pb-2">
              <p className="pl-2">موجودی کیف پول :</p>
              {!wallet && !error && (
                <span className="loading loading-dots loading-lg"></span>
              )}
              {wallet?.money && <p>{wallet?.money}</p>}
            </div>
            <div className=" flex-col">
              <h3>روش بازگشت پول</h3>
              <div className=" flex pb-2">
                <p className="pl-2">شیوه انتخابی :</p>

                <p>{(seller.moneyReturn.method && seller.moneyReturn.method) || "-"}</p>
              </div>
              <div className=" flex pb-2">
                <p className="pl-2">شماره کارت بانکی :</p>
                <p>{(seller.moneyReturn.bankAccount && seller.moneyReturn.bankAccount) || "-"}</p>
              </div>
            </div>
            <div className=" flex pb-2">
              <p className="pl-2">نوع موجودیت :</p>
              <p>{(seller.entityType && seller.entityType) || "-"}</p>
            </div>
            <div className=" flex-col">
              <h3>اطلاعات حقوقی</h3>
              <div className=" flex pb-2">
                <p className="pl-2">نام شرکت :</p>
                <p>{(seller.legalInfo?.companyName && seller.legalInfo?.companyName) || "-"}</p>
              </div>
              <div className=" flex pb-2">
                <p className="pl-2">نوع شرکت :</p>
                <p>{(seller.legalInfo?.companyType && seller.legalInfo?.companyType) || "-"}</p>
              </div>
              <div className=" flex pb-2">
                <p className="pl-2">کد ملی شرکت :</p>
                <p>{(seller.legalInfo?.companyIDNumber && seller.legalInfo?.companyIDNumber) || "-"}</p>
              </div>
              <div className=" flex pb-2">
                <p className="pl-2">شماره اقتصادی شرکت :</p>
                <p>{(seller.legalInfo?.companyEconomicNumber && seller.legalInfo?.companyEconomicNumber) || "-"}</p>
              </div>
              <div className=" flex pb-2">
                <p className="pl-2">اسم فروشگاه :</p>
                <p>{(seller.legalInfo?.storeName && seller.legalInfo?.storeName) || "-"}</p>
              </div>
              <div className=" flex-col">
                <h5>صاحبان امضا</h5>
                {seller.legalInfo ? (
                  <div>
                    {seller.legalInfo?.signOwners.map((signer, index) => (
                      <p key={index}>{signer}</p>
                    ))}
                  </div>
                ) : (
                  <p>صاحب امضایی وجود ندارد</p>
                )}
              </div>
            </div>
            <div className=" flex-col pt-2">
              <h3>مدارک حقیقی</h3>
              <div className=" flex pb-2">
                <p className="pl-2">کد ملی :</p>
                <p>{(seller.individualInfo?.nationalID && seller.individualInfo?.nationalID) || "-"}</p>
              </div>
              <div className=" flex pb-2">
                <p className="pl-2">نوع شماره بانکی :</p>
                <p>{(seller.individualInfo?.bankNumberType && seller.individualInfo?.bankNumberType) || "-"}</p>
              </div>
              <div className=" flex pb-2">
                <p className="pl-2">شماره شبا :</p>
                <p>{(seller.individualInfo?.shabaNumber && seller.individualInfo?.shabaNumber) || "-"}</p>
              </div>
              <div className=" flex pb-2">
                <p className="pl-2">شماره بانکی :</p>
                <p>{(seller.individualInfo?.bankNumber && seller.individualInfo?.bankNumber) || "-"}</p>
              </div>
            </div>
            <div className=" flex-col">
              <h3>اطلاعات فروشگاه</h3>
              <div className=" flex pb-2">
                <p className="pl-2">نام تجاری :</p>
                <p>{(seller.individualInfo?.shabaNumber && seller.individualInfo?.shabaNumber) || "-"}</p>
              </div>
              <div className=" flex pb-2">
                <p className="pl-2">شماره تلفن دفتر :</p>
                <p>{(seller.storeInfo?.officePhoneNumber && seller.storeInfo?.officePhoneNumber) || "-"}</p>
              </div>
              <div className=" flex pb-2">
                <p className="pl-2">لوگو :</p>
                <p>{(seller.storeInfo?.logo && seller.storeInfo?.logo) || "-"}</p>
              </div>
              <div className=" flex pb-2">
                <p className="pl-2">کد فروشنده :</p>
                <p>{(seller.storeInfo?.sellerCode && seller.storeInfo?.sellerCode) || "-"}</p>
              </div>
              <div className=" pb-2">
                <p className="pl-2">درباره فروشگاه :</p>
                <p>{(seller.storeInfo?.aboutSeller && seller.storeInfo?.aboutSeller) || "-"}</p>
              </div>
              <div className=" pb-2">
                <p className="pl-2">وبسایت فروشگاه :</p>
                <p >{(seller.storeInfo?.sellerWebsite && seller.storeInfo?.sellerWebsite) || "-"}</p>
              </div>
              <div className=" flex-col pb-2">
                <h5>روز های کاری فروشگاه :</h5>
                {seller.storeInfo?.workDays.length!=0 ? (
                  <div>
                    {seller.storeInfo?.workDays.map((day, index) => (
                      <p key={index}>{day}</p>
                    ))}
                  </div>
                ) : (
                  <p>-</p>
                )

                }
              </div>
              <div className=" flex-col pb-2">
                <h5>روز های تعطیل فروشگاه :</h5>
                {seller.storeInfo?.offDays.length!=0 ? (
                  <div>
                    {seller.storeInfo?.offDays.map((day, index) => (
                      <p key={index}>{day}</p>
                    ))}

                  </div>
                ) : (
                  <p>-</p>
                )

                }
              </div>
            </div>
            <div className=" flex-col pb-2">
              <h3>مدارک دیگر :</h3>
              {seller.additionalDocuments ? (
                <div>
                  {seller.additionalDocuments.map((info, index) => (
                    <a href="info" key={index} target="_blank">
                      {info}
                    </a>
                  ))}
                </div>
              ) : (
                <p>-</p>
              )

              }
            </div>
            <div className=" flex-col pb-2">
              <h3>آدرس فروشگاه</h3>
              {seller.storeAddress ? (

                <div className=" m-3" >
                  {seller.storeAddress.additionalInfo && <p>{seller.storeAddress.additionalInfo}</p>}
                  <p>{seller.storeAddress.city}</p>
                  <p>{seller.storeAddress.postalCode}</p>
                  <p>{seller.storeAddress.coordinates.x}</p>
                  <p>{seller.storeAddress.coordinates.y}</p>
                </div>
              ) : (
                <p>-</p>
              )

              }
            </div>
            <div className=" flex-col pb-2">
              <h3>آدرس انبار</h3>
              {seller.warehouseAddress ? (

                <div className=" m-3" >
                  {seller.warehouseAddress.additionalInfo && <p>{seller.warehouseAddress.additionalInfo}</p>}
                  <p>{seller.warehouseAddress.city}</p>
                  <p>{seller.warehouseAddress.postalCode}</p>
                  <p>{seller.warehouseAddress.coordinates.x}</p>
                  <p>{seller.warehouseAddress.coordinates.y}</p>
                </div>
              ) : (
                <p>-</p>
              )

              }
            </div>
          </div>
          <div className="flex justify-center">

            {seller.isBanned ? (
              <button
                className="btn btn-primary"
                type="button"
                onClick={() => unbanSeller.mutate()}
              >
                لغو بن
              </button>
            ) : (
              <button
                className="btn btn-error"
                type="button"
                onClick={() => banSeller.mutate()}
              >
                بن
              </button>
            )}
            {seller.isVerified ? (
              <button
                className="btn btn-primary mx-3"
                type="button"
                onClick={() => refuteSeller.mutate()}
              >
                لغو تایید فروشنده
              </button>
            ) : (
              <button
                className="btn btn-error mx-3"
                type="button"
                onClick={() => verifySeller.mutate()}
              >
                ثبت تایید فروشنده
              </button>
            )}
            <button
              className="btn btn-warning"
              type="button"
              onClick={closeModal}
            >
              خروج
            </button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop" onClick={closeModal}>
          <button type="button">close</button>
        </form>
      </dialog>
    </div>
  );
};

export default SellerPopUp;
