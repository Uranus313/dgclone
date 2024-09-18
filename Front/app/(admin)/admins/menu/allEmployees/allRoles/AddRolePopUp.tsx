"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import useGetAccessLevels from "../../../hooks/useGetAccessLevels";
import { AccessLevel } from "../EmployeePopUp";

const AddRolePopUp = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [error, setError] = useState<string | null>(null);
  // const {user , setUser , isLoading} = useContext(userContext);
  const { register, handleSubmit, getValues } = useForm();
  const [selectedRole, setSelectedRole] = useState<string | undefined>(
    undefined
  );
  let {
    data: accessLevelList,
    error: accessLevelError,
    isLoading: accessLevelIsLoading,
  } = useGetAccessLevels();

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
  const addRole = useMutation({
    mutationFn: async (formData: any) => {
      const result = await fetch("http://localhost:3005/users/employee/roles", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(formData),
      });
      const jsonResult = await result.json();
      if (result.ok) {
        return jsonResult;
      } else {
        throw new Error(jsonResult.error);
      }
    },
    onSuccess: (savedUser) => {
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
      setError(error.message);
      // setError(error)
    },
  });
  async function submit(formData: any) {
    console.log(formData);
    let levels : any = [];
    if(accessLevelList){
        accessLevelList.forEach((accessLevel) => {
            let newLevel = {} as {
                level : string;
                writeAccess? : boolean;
            }
            if(formData[accessLevel.name] == true){
                newLevel.level = accessLevel.name
            }
            if(formData[accessLevel.name + " writeAccess"] == true){
                newLevel.writeAccess = true;
            }
            if(newLevel.level){
                levels.push(newLevel);
            }
        });
    }
    let finalObject = {
        name : formData.name,
        accessLevels : levels
    }
    console.log(finalObject);
    addRole.mutate(finalObject);
  }
  return (
    <div>
      <button onClick={openModal} className="btn btn-primary">
        اضافه کردن نقش جدید
      </button>
      <dialog ref={dialogRef} className="modal">
        <div className="modal-box">
          {error && <p>{error}</p>}
          <h3 className="font-bold text-lg">اضافه کردن نقش</h3>
          <form onSubmit={handleSubmit(submit)}>
          <label className="p-2 block">
              نام
              <input type="text" {...register("name")} />
            </label>
            {accessLevelIsLoading && <span className="loading loading-dots loading-lg"></span> }
            {accessLevelList &&
              accessLevelList.map((accessLevel, index) => (
                <div key={index}>
                    <div className="form-control">
                  <label className="label cursor-pointer" >
                    <span className="label-text">{accessLevel.title}</span>
                    <input
                      type="checkbox"
                      className="checkbox checkbox-primary"
                      {...register(accessLevel.name)}
                    />
                  </label>
                </div>
                <div className="form-control">
                  <label className="label cursor-pointer">
                    <span className="label-text">قابلیت ایجاد تغییرات</span>
                    <input
                      type="checkbox"
                      className="checkbox checkbox-secondary"
                      {...register(accessLevel.name + " writeAccess")}
                    />
                  </label>
                </div>
                </div>
                
              ))}

            <button className="btn btn-success" type="submit">
              تایید
            </button>
            <button
              className="btn btn-warning"
              type="button"
              onClick={closeModal}
            >
              خروج
            </button>
          </form>
        </div>
        <form method="dialog" className="modal-backdrop" onClick={closeModal}>
          <button type="button">close</button>
        </form>
      </dialog>
    </div>
  );
};

export default AddRolePopUp;
