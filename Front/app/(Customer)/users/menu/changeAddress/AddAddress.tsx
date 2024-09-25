"use client";

import React, { ChangeEvent, useContext, useEffect, useRef, useState } from "react";
import "ol/ol.css";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import { fromLonLat, toLonLat, transform } from "ol/proj";
import "./mapComponent.css";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import userContext from "@/app/contexts/userContext";
import {provinces} from "@/data/cities";
import _ from "lodash";
import { useUser } from "@/app/hooks/useUser";
interface SearchLocResult {
  title?: string;
  address?: string;
  neighbourhood?: string;
  region?: string;
  type?: string;
  category?: string;
  location?: {
    x?: number;
    y?: number;
  };
}
interface Props {
  afterCancel: () => void;
  afterSuccess: () => void;
}
const AddAddress = ({ afterCancel, afterSuccess }: Props) => {
  const mapRef = useRef<any>(null);
  const postLocationRef = useRef<any>(null);
  const provinceRef = useRef<any>(null);
  const cityRef = useRef<any>(null);

  const [error,setError] = useState<string | null>(null);
  // const [provinces,setError] = useState<string[] | null>(null);
  const [cities,setCities] = useState<string[] >([]);
  const [cityInput,setCityInput] = useState<string >('');
  const [provinceInput,setProvinceInput] = useState<string >('');


  const [searchData, setSearchData] = useState<SearchLocResult[]>([]);
  const [longitude, setLongitude] = useState<number | null | undefined>(51.389);
  const [latitude, setLatitude] = useState<number | null | undefined>(35.6892);
  const [showSecondPage, setShowSecondPage] = useState<boolean>(false);
  const [showFirstPage, setShowFirstPage] = useState<boolean>(true);
  const [locationAsAddress, setLocationAsAddress] = useState<
    string | null | undefined
  >(null);
  const { register, handleSubmit, getValues } = useForm();

  async function searchLoc(e: React.ChangeEvent<HTMLInputElement>) {
    console.log(e.target.value);
    console.log(latitude);
    const result = await fetch(
      `https://api.neshan.org/v1/search?term=${e.target.value}&lat=${latitude}&lng=${longitude}`,
      {
        headers: {
          "Api-Key": "service.5b4e25ebc469407182ba7e7095cc2e7e",
        },
      }
    );
    if (!result.ok) {
      return;
    }
    const jsonResult = await result.json();
    console.log(jsonResult);
    if (jsonResult.items) {
      setSearchData(jsonResult.items);
    }
  }
  useEffect(() => {
    if (mapRef.current) return; // Initialize map only once

    mapRef.current = new Map({
      target: "map",
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],
      view: new View({
        center: fromLonLat([51.389, 35.6892]),
        zoom: 10,
      }),
    });

    mapRef.current.getView().on("change:center", function () {
      const center = mapRef.current.getView().getCenter();
      const [lon, lat] = toLonLat(center);
      setLongitude(lon);
      setLatitude(lat);
      if (!isNaN(lon) && !isNaN(lat)) {
        console.log(`Map Center - Longitude: ${lon}, Latitude: ${lat}`);
        // You can use these coordinates as needed
      } else {
        console.error("Invalid center coordinates:", center);
      }
    });
  }, []);
  const {user , setUser , isLoading} = useUser();

  const update = useMutation({
    mutationFn: async (formData : any) => {
        const result = await fetch("http://localhost:3005/users/user/addAddress", {
              method: "PUT",
              credentials: 'include',
              headers: {
                "Content-Type": "application/json",
              },

              body: JSON.stringify(formData),
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
        // queryClient.invalidateQueries(["user"]);
        setUser(savedUser);
        afterSuccess();
        // closeModal();
        // router.push('/');
        // router.push('/');
    },
    onError: (error) => {
      // Array.isArray(error.response?.data.detail)?  error.response?.data.detail.map((item,index) => {toast(item.msg.includes("Value error,")?item.msg.replace("Value error, ",''): capitalizeFirstLetter(item.loc[item.loc.length-1]) + " " + item.msg.substr(item.msg.indexOf(" ")+1),{type: "error"})}) : toast(error.response?.data.detail ,{type: "error"})// navigate("/");
      //   console.log(error)
      //   console.log(error.response?.data.detail)
      console.log(error);
    //   console.log(error.message);
      setError(error.message)
      // setError(error)
    }
});
  async function firstPageSubmit() {
    if (longitude && latitude) {
      const result = await fetch(
        `https://api.neshan.org/v5/reverse?lat=${latitude}&lng=${longitude}`,
        {
          headers: {
            "Api-Key": "service.5b4e25ebc469407182ba7e7095cc2e7e",
          },
        }
      );
      if (result.ok) {
        const jsonResult = await result.json();
        console.log(jsonResult);
        postLocationRef.current.value = jsonResult.formatted_address;
      }
    }
    setShowFirstPage(false);
    setShowSecondPage(true);
  }
  function secondPageFormSubmit(formData: any) {
    console.log(formData);
    // console.log(postLocationRef.current.value);
    if(_.isEqual(cities ,[])){
      setError("لطفا یک استان انتخاب کنید");
      return;
    }
    let checker = false; 
    for (let index = 0; index < cities.length; index++) {
      if(cityRef.current.value ==  cities[index]){
        checker = true;
        break;
      }
      
    }
    if(!checker){
      setError("لطفا یک شهر انتخاب کنید");
      return;
    }
    formData.coordinates = {
      x : longitude?.toString(),
      y: latitude?.toString()
    }
    formData.country = "Iran";
    formData.additionalInfo = postLocationRef.current.value.trim();
    formData.province = provinceRef.current.value.trim();
    formData.city = cityRef.current.value.trim();
    update.mutate(formData);
    
  }
  return (
    <div>
      <h1>اضافه کردن آدرس</h1>
      <div className={showFirstPage ? "block" : "hidden"}>
        <div
          className="dropdown"
          onChange={(e) => searchLoc(e as ChangeEvent<HTMLInputElement>)}
        >
          <input
            tabIndex={0}
            role="button"
            className=" m-1"
            placeholder="search"
          />
          <ul
            tabIndex={0}
            className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
          >
            {searchData.map((data, index) => {
              return (
                <li
                  key={index}
                  onClick={() => {
                    console.log(data);
                    const coordinates = fromLonLat([
                      data.location?.x || 3,
                      data.location?.y || 3,
                    ]);
                    mapRef.current.getView().setCenter(coordinates);
                    mapRef.current.getView().setZoom(15);
                    setLongitude(data.location?.x);
                    setLatitude(data.location?.y);
                  }}
                >
                  <div className=" flex-col">
                    <p className=" text-lg block">{data.title} </p>
                    <p className=" text-sm block">{data.address}</p>

                    {/* {
                    data.address == data.region? 
                    <p className=' text-sm'>{data.address}</p> 
                    :
                    <p className=' text-sm'>{data.address}{" "+ data.region}</p>
                } */}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
        <div style={{ position: "relative", width: "500px", height: "400px" }}>
          <div id="map" style={{ width: "100%", height: "100%" }}></div>
          <div className="marker"></div>
          <div>
            <button onClick={afterCancel}>لغو</button>
            <button onClick={firstPageSubmit}>تایید</button>
          </div>
        </div>
      </div>
      <div className={showSecondPage ? "block" : "hidden"}>
        <form onSubmit={handleSubmit(secondPageFormSubmit)}>
          <label className="block">
            نشانی پستی
            <input type="text" className=" w-11/12" ref={postLocationRef} />
          </label>
          <button type="button" onClick={() => {setShowFirstPage(true); setShowSecondPage(false)}}>بازگشت به انتخاب از روی نقشه</button>
          <div
          className="dropdown block"
          // onChange={(e) => searchLoc(e as ChangeEvent<HTMLInputElement>)}
        >
          <input
            tabIndex={0}
            role="button"
            className=" m-1"
            placeholder="استان"
            ref = {provinceRef}
            onBlur={(e) => {
              console.log(e.target.value)
              let checker = false;
              provinces.forEach(data => {
                if(e.target.value == data.name){
                  setCities(data.cities);
                  console.log("checked")
                  console.log(cities);
                  checker = true;
                }
              })
              // if(!checker){
              //   setCities([]);
              // }
            }}
            onChange={e => setProvinceInput(e.target.value)}
          />
          <ul
            tabIndex={0}
            className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
          >
            {provinces.map((data, index) => {
              if(data.name.includes(provinceInput)){
                return (
                  <li
                    key={index}
                    onClick={() => {
                      provinceRef.current.value= data.name;
                      setCities(data.cities);

                    }}
                  >
                    <div className=" flex-col">
                      <p className=" text-lg block">{data.name} </p>
  
                      {/* {
                      data.address == data.region? 
                      <p className=' text-sm'>{data.address}</p> 
                      :
                      <p className=' text-sm'>{data.address}{" "+ data.region}</p>
                  } */}
                    </div>
                  </li>
                );
              }else{
                return null;
              }
            })}
          </ul>
        </div>
        <div
          className="dropdown block"
          // onChange={(e) => searchLoc(e as ChangeEvent<HTMLInputElement>)}
        >
          <input
            tabIndex={0}
            role="button"
            className=" m-1"
            placeholder="شهر"
            ref = {cityRef}
            onChange={e => setCityInput(e.target.value)}
          />
          <ul
            tabIndex={0}
            className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
          >
            {cities?.map((data, index) => {
              if(data.includes(cityInput)){
                return (
                  <li
                    key={index}
                    onClick={() => {
                      cityRef.current.value= data
                    }}
                  >
                    <div className=" flex-col">
                      <p className=" text-lg block">{data} </p>
  
                      {/* {
                      data.address == data.region? 
                      <p className=' text-sm'>{data.address}</p> 
                      :
                      <p className=' text-sm'>{data.address}{" "+ data.region}</p>
                  } */}
                    </div>
                  </li>
                );
              }else{
                return null;
              }
            })}
          </ul>
        </div>
          {/* <label className="block">
            استان
            <input type="text" {...register("province")} />
          </label> */}
          {/* <label className="block">
            شهر
            <input type="text" {...register("city")} />
          </label> */}
          <label className="block">
            پلاک
            <input type="text" {...register("number")} />
          </label>
          <label className="block">
            واحد
            <input type="text" {...register("unit")}/>
          </label>
          <label className="block">
            کد پستی
            <input type="text" {...register("postalCode")} />
          </label>
          <label className="block">
            نام
            <input type="text" {...register("receiver.firstName")} />
          </label>
          <label className="block">
            نام خانوادگی
            <input type="text" {...register("receiver.lastName")} />
          </label>
          <label className="block">
            شماره تلفن همراه
            <input type="text" {...register("receiver.phoneNumber")} />
          </label>
          <button type="button" onClick={afterCancel}>لغو</button>
          <button type="submit" >تایید</button>
        </form>
      </div>
    </div>
  );
};

export default AddAddress;
