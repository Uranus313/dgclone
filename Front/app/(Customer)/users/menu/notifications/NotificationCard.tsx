import React from "react";
import { Notification } from "../../hooks/useGetNotifications";
import Link from "next/link";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface Props{
  notification : Notification
}
const NotificationCard = ({notification}: Props) => {

  const queryClient = useQueryClient();
  const update = useMutation({
      mutationFn: async (notificationID :string) => {
          const result = await fetch("http://localhost:3005/users/user/seeNotification/" +notificationID, {
                method: "PATCH",
                credentials: 'include',
                headers: {
                  "Content-Type": "application/json",
                }
          });
          const jsonResult = await result.json();
          console.log(jsonResult)
          if(result.ok){
              return jsonResult
          }else{
              throw new Error(jsonResult.error);
          }    
      },
      onSuccess: (savedUser ) =>{
          console.log(savedUser);
          // localStorage.setItem("auth-token",savedUser.headers["auth-token"]);
          queryClient.invalidateQueries({ queryKey: ["notifications"] });

      },
      onError: (error ) => {
        
        console.log(error);
      //   console.log(error.message);
        // setError(error.message)
        // setError(error)
      }
  });
  async function handleClick(){
    if(notification.isSeen){
      return;
    }
    update.mutate(notification._id);
  }
  return (
    <div className=" m-3">
      <div className="collapse bg-base-200" onChange={handleClick}>
        <input type="checkbox" />
        <div className="collapse-title text-xl font-medium flex justify-between">
          <div>
            <h1>{notification.title}</h1>
            <p>{notification.teaser}</p>
            <p>{notification.date}</p>
          </div>
          <div>
          {notification.imageUrl && 
          <div>
            <img src={notification.imageUrl} alt="notification image" />
          </div>
          }
          {!notification.isSeen &&
          <div className="badge badge-primary badge-md"></div>
          }
          </div>
          
        </div>
        <div className="collapse-content">
          <p>{notification.content}</p>
        </div>
        {notification.orderID &&
          <Link href={"/users/menu/orders/" + notification.orderID} />
        }
      </div>
    </div>
  );
};

export default NotificationCard;
