'use client'

import userContext from '@/app/contexts/userContext';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import React, { useContext, useRef, useState } from 'react'
import { Role } from '../EmployeePopUp';
import useGetAccessLevels from '../../../hooks/useGetAccessLevels';


export interface Props{
    role : Role
}
const RolePopUp = ({role } : Props) => {
    const [isOpen, setIsOpen] = useState(false);
    const dialogRef = useRef<HTMLDialogElement>(null);
    const [error , setError] = useState<string | null>(null);
    // let {data: roleList,error : roleError,isLoading : roleIsLoading} = useGetRoles(); 
    let {data: accessLevelList,error : accessLevelError,isLoading : accessLevelIsLoading} = useGetAccessLevels(); 
    
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
    const queryClient = useQueryClient();
    const deleteRole = useMutation({
        mutationFn: async (roleID : string) => {
            const result = await fetch("http://localhost:3005/users/employee/roles/" + roleID, {
                  method: "DELETE",
                  credentials: 'include',
                  headers: {
                    "Content-Type": "application/json",
                  }
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
            queryClient.invalidateQueries({queryKey :  ["roleList"]});
            // setUser(savedUser);
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
    
    return (
      <div>
        <div onClick={openModal} className=' flex justify-between'>
            <p>{role.name}</p>
        </div>

        <dialog ref={dialogRef} className="modal">
          <div className="modal-box">
            {error && <p>{error}</p>}
            <h3 className="font-bold text-lg">{role.name}</h3>
            
            <div className='block'>
                {accessLevelIsLoading && <span className="loading loading-dots loading-lg"></span> }
                {accessLevelList && role.accessLevels.map((accessLevel, index) => 
                <div className=' flex m-3' key={index}>
                    {accessLevelList?.map((accessLevel2 , index)=>  {
                        return accessLevel2.name == accessLevel.level && <p key={index}>{accessLevel2.title}</p>})}
                    {accessLevel.writeAccess? <p>اجازه تغییر دارد</p> :
                    <p>اجازه تغییر ندارد</p>
                    }    
                </div>)}
            </div>
            <button className='btn  btn-error' type='button' onClick={() => deleteRole.mutate(role._id)}>حذف نقش</button>
            <button className='btn btn-warning' type='button' onClick={closeModal}>خروج</button>
          </div>
          <form method="dialog" className="modal-backdrop" onClick={closeModal}>
            <button type="button">close</button>
          </form>
        </dialog>
      </div>
    );
}

export default RolePopUp
