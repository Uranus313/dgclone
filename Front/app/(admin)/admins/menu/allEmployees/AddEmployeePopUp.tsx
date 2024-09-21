"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import useGetRoles from "../../hooks/useGetRoles";
import { Role } from "./EmployeePopUp";

const AddEmployeePopUp = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [error, setError] = useState<string | null>(null);
  // const {user , setUser , isLoading} = useContext(userContext);
  const { register, handleSubmit, getValues } = useForm();
  const [selectedRole, setSelectedRole] = useState<string | undefined>(undefined);
  let {
    data: roleList,
    error: roleError,
    isLoading: roleIsLoading,
  } = useGetRoles();

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
  const addEmployee = useMutation({
    mutationFn: async (formData: any) => {
      const result = await fetch("http://localhost:3005/users/employee/signUp", {
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
      queryClient.invalidateQueries({ queryKey: ["employeeList"] });
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

    if (selectedRole) {
      addEmployee.mutate({ ...formData, roleID: selectedRole });
      return;
    }
    addEmployee.mutate(formData);
  }
  return (
    <div>
      <button onClick={openModal} className="btn btn-error">
        استخدام
      </button>
      <dialog ref={dialogRef} className="modal">
        <div className="modal-box">
          {error && <p>{error}</p>}
          <h3 className="font-bold text-lg mr-3">استخدام کارمند</h3>
          <form onSubmit={handleSubmit(submit)}>
            <label className="p-2 block ">
              <input type="text" className="bg-primary-bg rounded-md" placeholder=' نام'  {...register("firstName")} />
            </label>
            <label className="p-2 block">
              <input type="text" className="bg-primary-bg rounded-md" placeholder='  نام خانوادگی' {...register("lastName")} />
            </label>
            <label className="p-2 block">
              <input type="number" className="bg-primary-bg rounded-md" placeholder=' شماره تلفن' {...register("phoneNumber")} />
            </label>
            <label className="p-2 block">
              <input type="email" className="bg-primary-bg rounded-md" placeholder=' ایمیل' {...register("email")} />
            </label>
            <label className="p-2 block">
              <input type="number" className="bg-primary-bg rounded-md" placeholder=' کد ملی' {...register("nationalID")} />
            </label>
            <label className="p-2 block">
              <p> تاریخ تولد:</p>
              <input type="date" className="bg-primary-bg rounded-md" {...register("birthDate")} />
            </label>
            <label className="p-2 block">
              <input type="password" className="bg-primary-bg rounded-md" placeholder='  رمز عبور' {...register("password")} />
            </label>

            {roleIsLoading && (
              <span className="loading loading-dots loading-lg"></span>
            )}
            {!roleIsLoading && (
              <select className="select select-accent pl-36 max-w-xs" onChange={(e) => {
                if (e.target.value == "null######") {
                  setSelectedRole(undefined);
                } else {
                  setSelectedRole(e.target.value);
                }
              }}>
                <option disabled selected>
                  نقش
                </option>
                <option value={"null######"}>بدون نقش</option>
                {roleList?.map((role, index) => <option key={index} value={role._id}>{role.name}</option>)}
              </select>
            )}
            <div className=" my-4">
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

export default AddEmployeePopUp;
