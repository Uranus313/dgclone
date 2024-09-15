"use client";
import { useForm } from "react-hook-form";
import { useContext, useState } from "react";
import userContext from "@/app/contexts/userContext";
import { useMutation } from "@tanstack/react-query";
import InputPopUp from "./InputPopUp";
import PasswordPopUp from "./PasswordPopUp";



const MyFormComponent = () => {
  const [error, setError] = useState<string | null>(null);
  const { user, setUser, isLoading } = useContext(userContext);
    
  return (
    <div>
      <InputPopUp
        inputDetails={[
          { title: "نام", type: "text", name: "firstName" },
          { title: "نام خانوادگی", type: "text", name: "lastName" },
        ]}
        buttonMode="input"
        titleLabel="نام و نام خانوادگی"
        inputDefaultValue={
          "" +
          (user?.firstName ? user?.firstName : "") +
          (user?.lastName ? " " + user?.lastName : "")
        }
        inputType="text"
        mainText="سلام"
      />
      <InputPopUp
        inputDetails={[
          { title: "شماره تلفن همراه", type: "text", name: "phoneNumber" },
        ]}
        buttonMode="input"
        titleLabel="شماره تلفن همراه"
        inputDefaultValue={user?.phoneNumber}
        inputType="number"
        mainText="سلام"
      />
      <InputPopUp
        inputDetails={[{ title: "ایمیل", type: "email", name: "email" }]}
        buttonMode="input"
        titleLabel="پست الکترونیکی"
        inputDefaultValue={user?.email}
        inputType="text"
        mainText="سلام"
      />
      <InputPopUp
        inputDetails={[
          { title: "تاریخ تولد", type: "date", name: "birthDate" },
        ]}
        buttonMode="input"
        titleLabel="تاریخ تولد"
        inputDefaultValue={
          user?.birthDate
            ? new Date(user?.birthDate).toISOString().split("T")[0]
            : ""
        }
        inputType="date"
        mainText="سلام"
      />
      <InputPopUp
        inputDetails={[
          { title: "شماره ملی", type: "text", name: "nationalID" },
        ]}
        buttonMode="input"
        titleLabel="شماره ملی"
        inputDefaultValue={user?.nationalID}
        inputType="number"
        mainText="سلام"
      />
      <PasswordPopUp />
    </div>
  );
};

export default MyFormComponent;
