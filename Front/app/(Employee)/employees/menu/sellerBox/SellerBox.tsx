'use client'
import userContext from "@/app/contexts/userContext";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useRef, useState } from "react";
import SellerList from "./SellerList";
import { useUser } from "@/app/hooks/useUser";



function SellerBox() {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const { user, setUser, isLoading } = useUser();
    const dialogRef = useRef<HTMLDialogElement>(null);
    const [isOpen, setIsOpen] = useState(false);

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

    return (
        <div className="justify-center text-center">
            <button onClick={() => openModal()} className="border-grey-border rounded-lg border-2 p-7 px-9 bg-white mb-3">
                <svg
                    fill="#000000"
                    height="85px"
                    width="85px"
                    version="1.1"
                    viewBox="-30.72 -30.72 573.44 573.44"
                    stroke="#000000"
                    stroke-width="8.68">
                    <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                    <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                    <g id="SVGRepo_iconCarrier">
                        <path d="M76.8,230.4v230.4H256V230.4H76.8z M230.4,435.2h-128V256h128V435.2z"></path>
                        <path d="M512,153.6v-51.209c0-2.756-0.444-5.487-1.314-8.098l-25.6-76.791C481.604,7.049,471.817,0,460.8,0H51.2 C40.183,0,30.396,7.049,26.914,17.502l-25.6,76.791C0.444,96.905,0,99.635,0,102.391V153.6c0,14.14,11.46,25.6,25.6,25.6v307.2 H12.8c-7.074,0-12.8,5.726-12.8,12.8c0,7.074,5.726,12.8,12.8,12.8h486.4c7.074,0,12.8-5.726,12.8-12.8 c0-7.074-5.726-12.8-12.8-12.8h-12.8V179.2C500.54,179.2,512,167.74,512,153.6z M460.8,25.6l21.333,64h-95.479l-16.282-64H460.8z M268.8,25.6h75.128l16,64H268.8V25.6z M268.8,115.2h94.72v38.4H268.8V115.2z M168.073,25.6H243.2v64h-91.128L168.073,25.6z M148.48,115.2h94.72v38.4h-94.72V115.2z M51.2,25.6h90.428l-16.282,64H29.867L51.2,25.6z M25.6,115.2h97.28v38.4H51.2H25.6V115.2 z M409.6,486.4H307.2V384h25.6v-25.6h-25.6V256h102.4V486.4z M460.8,486.4h-25.6v-256H281.6v256H51.2V179.2h409.6V486.4z M460.8,153.6h-71.68v-38.4h97.28v38.4H460.8z"></path>
                    </g>
                </svg>

            </button>
            <p>مدیریت فروشنده</p>
            <dialog ref={dialogRef} className="modal">
                <div className="modal-box">
                    {error && <p>{error}</p>}
                    {user &&
                        <div>
                            {user.roleID &&
                                <div>
                                    {user.roleID.accessLevels &&
                                        <div>
                                            {user.roleID.accessLevels.some(accessLevel => accessLevel.level === "sellerManage") ? (
                                                <SellerList />
                                            ) : (
                                                <div>
                                                    <p>خارج از سطح دسترسی</p>
                                                    <button
                                                        className="mt-7 py-2 px-5 border-2 border-red-box text-center text-red-box rounded-lg"
                                                        type="button"
                                                        onClick={closeModal}>
                                                        خروج
                                                    </button>
                                                </div>
                                            )
                                            }
                                        </div>
                                    }
                                </div>
                            }
                        </div>
                    }

                </div>
                <form method="dialog" className="modal-backdrop" onClick={closeModal}>
                    <button type="button">close</button>
                </form>
            </dialog>
        </div>
    )
}
export default SellerBox;