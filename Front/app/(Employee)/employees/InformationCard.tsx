'use client'
import userContext from "@/app/contexts/userContext";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { AccessLevel } from "./page";



function InformationCard() {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const { user, setUser, isLoading } = useContext(userContext);

    const logOut = useMutation({
        mutationFn: async () => {
            const result = await fetch("http://localhost:3005/users/general/logOut", {
                credentials: 'include'
            });
            const jsonResult = await result.json();
            if (result.ok) {
                return jsonResult
            } else {
                throw new Error(jsonResult.error);
            }
        },
        onSuccess: (savedUser) => {
            console.log(savedUser);
            setUser(savedUser);
            router.push('/');
        },
        onError: (error) => {
            console.log(error);
            setError(error.message);
        }
    });

    return (
        <div className="flex bg-propBubble-bg my-24 mx-14 p-4 px-10 rounded-lg">
            {isLoading ? <span className="loading loading-dots loading-lg"></span> :
                user &&
                <div>
                    <div className="py-3 font-extrabold flex">
                        <p className="w-11/12"> {user.firstName} {user.lastName} </p>
                        <svg
                            fill="#000000"
                            height="25px"
                            width="25px"
                            version="1.1"
                            viewBox="0 0 611.999 611.999">
                            <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                            <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                            <g id="SVGRepo_iconCarrier">
                                <path d="M570.107,500.254c-65.037-29.371-67.511-155.441-67.559-158.622v-84.578c0-81.402-49.742-151.399-120.427-181.203 C381.969,34,347.883,0,306.001,0c-41.883,0-75.968,34.002-76.121,75.849c-70.682,29.804-120.425,99.801-120.425,181.203v84.578 c-0.046,3.181-2.522,129.251-67.561,158.622c-7.409,3.347-11.481,11.412-9.768,19.36c1.711,7.949,8.74,13.626,16.871,13.626 h164.88c3.38,18.594,12.172,35.892,25.619,49.903c17.86,18.608,41.479,28.856,66.502,28.856 c25.025,0,48.644-10.248,66.502-28.856c13.449-14.012,22.241-31.311,25.619-49.903h164.88c8.131,0,15.159-5.676,16.872-13.626 C581.586,511.664,577.516,503.6,570.107,500.254z M484.434,439.859c6.837,20.728,16.518,41.544,30.246,58.866H97.32 c13.726-17.32,23.407-38.135,30.244-58.866H484.434z M306.001,34.515c18.945,0,34.963,12.73,39.975,30.082 c-12.912-2.678-26.282-4.09-39.975-4.09s-27.063,1.411-39.975,4.09C271.039,47.246,287.057,34.515,306.001,34.515z M143.97,341.736v-84.685c0-89.343,72.686-162.029,162.031-162.029s162.031,72.686,162.031,162.029v84.826 c0.023,2.596,0.427,29.879,7.303,63.465H136.663C143.543,371.724,143.949,344.393,143.97,341.736z M306.001,577.485 c-26.341,0-49.33-18.992-56.709-44.246h113.416C355.329,558.493,332.344,577.485,306.001,577.485z"></path>
                                <path d="M306.001,119.235c-74.25,0-134.657,60.405-134.657,134.654c0,9.531,7.727,17.258,17.258,17.258 c9.531,0,17.258-7.727,17.258-17.258c0-55.217,44.923-100.139,100.142-100.139c9.531,0,17.258-7.727,17.258-17.258 C323.259,126.96,315.532,119.235,306.001,119.235z"></path>
                            </g>
                        </svg>
                    </div>
                    <ul className="flex flex-col px-17">
                        <li className="py-1.5">  شماره تلفن : {user.phoneNumber}</li>
                        <li className="py-1.5">  آی دی کارمند : {user._id}</li>
                        <li className="py-1.5">   ایمیل : {user.email}</li>
                        <li className="py-1.5">   شغل : {user.roleID.name}</li>

                        <ul>
                            <li className="py-1.5">   دسترسی ها : </li>
                            {!user.roleID.accessLevels ?
                                <p>هیچ دسترسی وجود ندارد</p>
                                : user.roleID.accessLevels?.map((accessLevel: AccessLevel, index: number) => {
                                    return (
                                        <li key={index} className="py-0.5">
                                            {accessLevel.level}
                                        </li>
                                    )
                                })
                            }


                        </ul>
                        <li className="my-3 py-2 border-2 border-red-box text-center text-red-box rounded-lg">
                            <button onClick={() => logOut.mutate()}>
                                خروج از حساب
                            </button>
                        </li>
                    </ul>

                </div>
            }
        </div>
    )
}
export default InformationCard;