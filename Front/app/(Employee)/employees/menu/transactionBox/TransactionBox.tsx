'use client'
import userContext from "@/app/contexts/userContext";
import { useUser } from "@/app/hooks/useUser";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useRef, useState } from "react";
import TransactionList from "./TransactionList";




function TransactionBox() {
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
        <div className="justify-center text-center mx-5">
            <button onClick={() => openModal()} className="border-grey-border rounded-lg border-2 p-7 px-9 bg-white mb-3">
                <svg
                    fill="#000000"
                    height="85px"
                    width="85px"
                    version="1.1"
                    viewBox="0 0 490.31 490.31"
                    stroke="#000000"
                    stroke-width="11.767439999999999">
                    <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                    <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#fcfcfc" stroke-width="4.9031"></g>
                    <g id="SVGRepo_iconCarrier">
                        <path d="M456.132,315.266v-46.86h3.443c16.947,0,30.735-13.788,30.735-30.735c0-16.947-13.788-30.735-30.735-30.735l-428.84,0.001 C13.788,206.936,0,220.723,0,237.67c0,16.947,13.788,30.735,30.735,30.735h3.444v46.86c-18.016,2.714-31.874,18.298-31.874,37.06 c0,18.762,13.858,34.346,31.874,37.06v60.049c0,17.534,14.266,31.8,31.8,31.8h358.353c17.535,0,31.8-14.265,31.8-31.799v-60.05 c18.016-2.714,31.873-18.298,31.873-37.06C488.005,333.563,474.148,317.979,456.132,315.266z M435.132,318.165 c-0.73,0.33-1.45,0.68-2.154,1.055l-50.813-50.814h52.967V318.165z M469.31,237.67c0,5.368-4.367,9.735-9.735,9.735h-98.41 l-19.47-19.471h117.88C464.943,227.934,469.31,232.302,469.31,237.67z M311.996,227.934l19.47,19.471H158.844l19.47-19.471H311.996 z M21,237.67c0-5.367,4.367-9.734,9.735-9.734h117.88l-19.47,19.47h-98.41C25.367,247.405,21,243.038,21,237.67z M108.145,268.405 l-50.814,50.813c-0.704-0.374-1.423-0.724-2.152-1.054v-49.76H108.145z M23.305,352.325c0-9.087,7.393-16.48,16.479-16.48 c9.087,0,16.48,7.393,16.48,16.48c0,9.087-7.393,16.48-16.48,16.48C30.698,368.806,23.305,361.412,23.305,352.325z M424.332,460.233h-52.059V359.081c0-5.799-4.701-10.5-10.5-10.5s-10.5,4.701-10.5,10.5v101.152h-95.618V304.766 c0-5.799-4.701-10.5-10.5-10.5c-5.799,0-10.5,4.701-10.5,10.5v155.468H139.57V359.081c0-5.799-4.701-10.5-10.5-10.5 c-5.799,0-10.5,4.701-10.5,10.5v101.152H65.979c-5.955,0-10.8-4.845-10.8-10.8v-62.948c13.008-5.886,22.086-18.978,22.086-34.16 c0-6.709-1.781-13.006-4.881-18.46l65.46-65.46h214.622l65.46,65.46c-3.1,5.454-4.881,11.751-4.881,18.46 c0,15.182,9.079,28.275,22.088,34.16v62.949C435.132,455.389,430.287,460.233,424.332,460.233z M450.526,368.806 c-9.088,0-16.481-7.393-16.481-16.48c0-9.087,7.394-16.48,16.481-16.48c9.087,0,16.48,7.393,16.48,16.48 C467.005,361.412,459.613,368.806,450.526,368.806z"></path>
                        <path d="M219.511,183.557c5.89,7.211,14.26,11.346,22.962,11.346c8.703,0,17.072-4.135,22.963-11.346l59.035-72.268 c6.558-8.028,8.36-16.764,4.943-23.966c-3.417-7.201-11.321-11.332-21.686-11.332h-18.228V30.48 c0-11.802-9.601-21.403-21.404-21.403H216.85c-11.802,0-21.404,9.601-21.404,21.402v45.512H177.22 c-10.366,0-18.27,4.131-21.687,11.333c-3.416,7.202-1.615,15.938,4.943,23.965L219.511,183.557z M175.883,96.991h30.064 c5.799,0,10.5-4.701,10.5-10.5V30.479c0-0.222,0.181-0.402,0.404-0.402h51.247c0.223,0,0.404,0.181,0.404,0.403v56.011 c0,5.799,4.701,10.5,10.5,10.5h30.176l-60.003,73.28c-1.913,2.341-4.292,3.631-6.7,3.631s-4.787-1.29-6.699-3.631L175.883,96.991z"></path>
                    </g>
                </svg>

            </button>
            <p>مدیریت تراکنش</p>
            <dialog ref={dialogRef} className="modal">
                        <div className="modal-box">
                            {error && <p>{error}</p>}
                            {user &&
                                <div>
                                    {user.roleID &&
                                        <div>

                                            {user.roleID.accessLevels &&
                                                <div>
                                                    {user.roleID.accessLevels.some(accessLevel => accessLevel.level === "transactionManage") ? (
                                                        <TransactionList />
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
export default TransactionBox;