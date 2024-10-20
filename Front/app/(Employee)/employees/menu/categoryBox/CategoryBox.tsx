'use client'
import userContext from "@/app/contexts/userContext";
import { useUser } from "@/app/hooks/useUser";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useRef, useState } from "react";
import CategoryList from "./CategoryList";



function CategoryBox() {
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
        <div className="  mx-5 pb-5">
            <button onClick={() => openModal()} className="border-grey-border rounded-lg border-2 p-7 px-9 bg-white mb-3">
                <svg width="85px"
                    height="85px"
                    viewBox="0 0 24 24"
                    fill="none">
                    <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                    <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                    <g id="SVGRepo_iconCarrier"> <g id="Iconly/Curved/Arrow - Up Circle"> <g id="Arrow - Up Circle">
                        <path id="Stroke 1" fill-rule="evenodd" clip-rule="evenodd" d="M21.2498 12C21.2498 5.063 18.9368 2.75 11.9998 2.75C5.06276 2.75 2.74976 5.063 2.74976 12C2.74976 18.937 5.06276 21.25 11.9998 21.25C18.9368 21.25 21.2498 18.937 21.2498 12Z" stroke="#130F26" stroke-width="1.416" stroke-linecap="round" stroke-linejoin="round"></path>
                        <path id="Stroke 3" d="M15.4714 13.4419C15.4714 13.4419 13.0794 9.95589 11.9994 9.95589C10.9194 9.95589 8.52944 13.4419 8.52944 13.4419" stroke="#130F26" stroke-width="1.416" stroke-linecap="round" stroke-linejoin="round"></path>
                    </g> </g> </g>
                </svg>

            </button>
            <p>مدیریت دسته بندی</p>
            <dialog ref={dialogRef} className="modal">
                <div className="modal-box">
                    {error && <p>{error}</p>}
                    {user &&
                        <div>
                            {user.roleID &&
                                <div>
                                    {user.roleID.accessLevels &&
                                        <div>
                                            {user.roleID.accessLevels.some(accessLevel => accessLevel.level === "categoryManage") ? (
                                                <CategoryList />
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
                <div className="modal-backdrop" onClick={closeModal}>
                    <button type="button">close</button>
                </div>
            </dialog>

        </div>
    )
}
export default CategoryBox;