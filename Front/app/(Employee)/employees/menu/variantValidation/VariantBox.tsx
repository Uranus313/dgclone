'use client'
import userContext from "@/app/contexts/userContext";
import { useUser } from "@/app/hooks/useUser";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useRef, useState } from "react";
import ProductList from "./ProductList";



function VariantBox() {
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
        <div className=" justify-center text-center mx-5">
            <button onClick={() => openModal()} className="border-grey-border rounded-lg border-2 p-7 px-9 bg-white mb-3">
                <svg
                    fill="#000000"
                    width="85px"
                    height="85px"
                    viewBox="-13.5 -13.5 195.79 195.79"
                    stroke="#000000"
                    stroke-width="2.1942180000000002">
                    <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                    <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                    <g id="SVGRepo_iconCarrier">
                        <path id="stamp" d="M278.066,1084.939l-.085-22.623-40.74-40.886a28.033,28.033,0,0,0-55.606,5.026,27.607,27.607,0,0,0,7.933,19.57v6.557l-46,35.384v22.622l4,4.015v12.333l40.229,40.3,86.229-66.267-.033-12.917Zm-126.5,14.7,32,32.229v7.527l-32-32.113Zm118.381-27.776,0,9.145-78.383,60.235v-9.022Zm-60.247-65.41a20,20,0,1,1-20,20A20.024,20.024,0,0,1,209.7,1006.456Zm-12.134,45.293a29.055,29.055,0,0,0,12,2.707,26.511,26.511,0,0,0,11-2.253v17.92a9.186,9.186,0,0,1-9.2,9.28h-4.334a9.414,9.414,0,0,1-9.467-9.28Zm9.467,35.654h4.334a17.193,17.193,0,0,0,17.2-17.28V1047a28.825,28.825,0,0,0,8.391-14.451l30.831,30.907-79.733,61.464-34.393-34.58,35.9-27.663v7.447A17.422,17.422,0,0,0,207.035,1087.4Z" transform="translate(-143.568 -998.456)"></path>
                    </g>
                </svg>
            </button>
            <p>تایید تنوع</p>
            <dialog ref={dialogRef} className="modal">
                <div className="modal-box">
                    {error && <p>{error}</p>}
                    {user &&
                        <div>
                            {user.roleID &&
                                <div>

                                    {user.roleID.accessLevels &&
                                        <div>
                                            {user.roleID.accessLevels.some(accessLevel => accessLevel.level === "productManage" && accessLevel.writeAccess === true) ? (
                                               <ProductList />
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
export default VariantBox;