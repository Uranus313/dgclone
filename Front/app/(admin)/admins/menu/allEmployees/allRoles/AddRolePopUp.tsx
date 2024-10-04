"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import useGetAccessLevels from "../../../hooks/useGetAccessLevels";

const AddRolePopUp = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [error, setError] = useState<string | null>(null);
  // const {user , setUser , isLoading} = useUser();
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
      queryClient.invalidateQueries({ queryKey: ["roleList"] });
      closeModal();
    },
    onError: (error) => {
      console.log(error);
      setError(error.message);
    },
  });
  async function submit(formData: any) {
    console.log(formData);
    let levels: any = [];
    if (accessLevelList) {
      accessLevelList.forEach((accessLevel) => {
        let newLevel = {} as {
          level: string;
          writeAccess?: boolean;
        }
        if (formData[accessLevel.name] == true) {
          newLevel.level = accessLevel.name
        }
        if (formData[accessLevel.name + " writeAccess"] == true) {
          newLevel.writeAccess = true;
        }
        if (newLevel.level) {
          levels.push(newLevel);
        }
      });
    }
    let finalObject = {
      name: formData.name,
      accessLevels: levels
    }
    console.log(finalObject);
    addRole.mutate(finalObject);
  }
  return (
    <div>
      <div className="pt-8 border-b-2 pb-7 shadow-md border-white flex justify-center">
        {/* <input className='w-3/6 bg-primary-bg placeholder-neutral-700 px-6 py-2 rounded-md mx-20' type="text" placeholder='جست و جو' /> */}
        <button onClick={openModal} className="btn bg-white border-primary text-primary">
          اضافه کردن نقش جدید
        </button>
      </div>
      <dialog ref={dialogRef} className="modal">
        <div className="modal-box">
          {error && <p>{error}</p>}
          <h3 className="font-bold text-lg border-b-2 border-border-color-list py-3">اضافه کردن نقش</h3>
          <form onSubmit={handleSubmit(submit)}>

            <input className=" bg-white placeholder-neutral-400 my-7 mb-4 px-4 py-2 rounded-md border-2 border-neutral-200" type="text" {...register("name")} placeholder="نام شغل" />

            {accessLevelIsLoading && <span className="loading loading-dots loading-lg"></span>}
            {accessLevelList &&
              accessLevelList.map((accessLevel, index) => (
                <div key={index} className="flex">
                  <div className="form-control  w-1/2 ">
                    <label className="label cursor-pointer" >
                      <span className="label-text">{accessLevel.title}</span>
                      <input
                        type="checkbox"
                        className="checkbox checkbox-primary rounded-md ml-9"
                        {...register(accessLevel.name)}
                      />
                    </label>
                  </div>
                  <div className="form-control w-1/2">
                    <label className="label cursor-pointer ">
                      <span className="label-text text-secondary">قابلیت ایجاد تغییرات</span>
                      <input
                        type="checkbox"
                        className="checkbox checkbox-secondary rounded-md ml-14"
                        {...register(accessLevel.name + " writeAccess")}
                      />
                    </label>
                  </div>
                </div>

              ))}
            <div className="mt-5 flex justify-center ">

              <button className="btn btn-success mx-3" type="submit">
                تایید
              </button>
              <button
                className="btn btn-warning"
                type="button"
                onClick={closeModal}
              >
                خروج
              </button>
            </div>

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
