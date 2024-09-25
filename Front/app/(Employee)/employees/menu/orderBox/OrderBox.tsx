'use client'
import userContext from "@/app/contexts/userContext";
import { useUser } from "@/app/hooks/useUser";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useRef, useState } from "react";



function CommentBox() {
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
        <div className="justify-center text-center mx-10">
            <button onClick={() => openModal()} className="border-grey-border rounded-lg border-2 p-7 px-9 bg-white mb-3">
                <svg
                    fill="#000000"
                    version="1.1"
                    width="85px"
                    height="85px"
                    viewBox="0 0 902.86 902.86"
                    stroke="#000000"
                    stroke-width="0.009028600000000001"
                    transform="rotate(0)matrix(-1, 0, 0, 1, 0, 0)">
                    <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                    <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#CCCCCC" stroke-width="25.280080000000005"></g>
                    <g id="SVGRepo_iconCarrier">
                        <path d="M671.504,577.829l110.485-432.609H902.86v-68H729.174L703.128,179.2L0,178.697l74.753,399.129h596.751V577.829z M685.766,247.188l-67.077,262.64H131.199L81.928,246.756L685.766,247.188z"></path>
                        <path d="M578.418,825.641c59.961,0,108.743-48.783,108.743-108.744s-48.782-108.742-108.743-108.742H168.717 c-59.961,0-108.744,48.781-108.744,108.742s48.782,108.744,108.744,108.744c59.962,0,108.743-48.783,108.743-108.744 c0-14.4-2.821-28.152-7.927-40.742h208.069c-5.107,12.59-7.928,26.342-7.928,40.742 C469.675,776.858,518.457,825.641,578.418,825.641z M209.46,716.897c0,22.467-18.277,40.744-40.743,40.744 c-22.466,0-40.744-18.277-40.744-40.744c0-22.465,18.277-40.742,40.744-40.742C191.183,676.155,209.46,694.432,209.46,716.897z M619.162,716.897c0,22.467-18.277,40.744-40.743,40.744s-40.743-18.277-40.743-40.744c0-22.465,18.277-40.742,40.743-40.742 S619.162,694.432,619.162,716.897z"></path>
                    </g>
                </svg>

            </button>
            <p>مدیریت سفارش</p>
            <dialog ref={dialogRef} className="modal">
                <div className="modal-box">
                    {error && <p>{error}</p>}
                    {user &&
                        <div>
                            {user.roleID &&
                                <div>

                                    {user.roleID.accessLevels &&
                                        <div>
                                            {user.roleID.accessLevels.some(accessLevel => accessLevel.level === "orderManage") ? (
                                                // <UserList />
                                                <p></p>
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
export default CommentBox;