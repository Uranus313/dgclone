import userContext from "@/app/contexts/userContext";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useRef, useState } from "react";
import { AccessLevel, Employee } from "../../page";
import UserList from "./UserList";




function UserBox() {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const { user, setUser, isLoading } = useContext(userContext) as { user: Employee; setUser: (user: Employee) => void; isLoading: boolean };
    const dialogRef = useRef<HTMLDialogElement>(null);
    const [isOpen, setIsOpen] = useState(false);
    useEffect(() => {
        if (user) {
            console.log(user)
            console.log(user.roleID)
            console.log(user.roleID.accessLevels)
        }
    }, [user])

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
            {isLoading ? <span className="loading loading-dots loading-lg"></span> :
                user &&
                <div>

                    <button onClick={() => openModal()} className="border-grey-border rounded-lg border-2 p-7 px-9 bg-white mb-3">
                        <svg
                            fill="#000000"
                            height="85px"
                            width="85px"
                            version="1.1"
                            viewBox="-61.44 -61.44 634.88 634.88"
                            stroke="#000000"
                            stroke-width="12.704">
                            <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                            <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                            <g id="SVGRepo_iconCarrier"> <path d="M256,0c-65.733,0-119.211,53.479-119.211,119.211S190.267,238.423,256,238.423s119.211-53.479,119.211-119.211 S321.733,0,256,0z M256,218.024c-54.486,0-98.813-44.328-98.813-98.813S201.515,20.398,256,20.398s98.813,44.328,98.813,98.813 S310.485,218.024,256,218.024z"></path>
                                <path d="M426.272,331.529c-45.48-45.48-105.952-70.529-170.272-70.529c-64.32,0-124.791,25.047-170.273,70.529 c-45.48,45.48-70.529,105.952-70.529,170.272c0,5.632,4.566,10.199,10.199,10.199h461.204c5.632,0,10.199-4.567,10.199-10.199 C496.801,437.482,471.752,377.01,426.272,331.529z M35.831,491.602C41.179,374.789,137.889,281.398,256,281.398 s214.821,93.391,220.17,210.204H35.831z"></path>
                                <path d="M182.644,457.944H66.295c-5.633,0-10.199,4.567-10.199,10.199s4.566,10.199,10.199,10.199h116.349 c5.633,0,10.199-4.567,10.199-10.199S188.277,457.944,182.644,457.944z"></path>
                                <path d="M225.621,457.944h-7.337c-5.633,0-10.199,4.567-10.199,10.199s4.566,10.199,10.199,10.199h7.337 c5.633,0,10.199-4.567,10.199-10.199S231.254,457.944,225.621,457.944z"></path>
                            </g>
                        </svg>
                    </button>
                    <p>مدیریت کاربر</p>
                    <dialog ref={dialogRef} className="modal">
                        <div className="modal-box">
                            {error && <p>{error}</p>}
                            {user.roleID.accessLevels &&
                                <div>
                                    {user.roleID.accessLevels.some(accessLevel => accessLevel.level === "userManage") ? (
                                        <UserList />
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
                        <form method="dialog" className="modal-backdrop" onClick={closeModal}>
                            <button type="button">close</button>
                        </form>
                    </dialog>
                </div>
            }
        </div>
    );
}

export default UserBox;
