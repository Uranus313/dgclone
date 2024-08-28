'use client'
import React, { useState } from 'react'

import useGetUserNotifications, { Notification } from '../../hooks/useGetNotifications';
import NotificationCard from './NotificationCard';

const NotificationList = () => {
    const {data: notifications,error : notificationError,isLoading : isLoading} = useGetUserNotifications();
    const [mode,setMode]=useState<string>('order');
  return (
    <div>
      <div>
        <button className={mode == 'order'? 'btn btn-primary' : 'btn btn-secondary'} onClick={() => setMode('order')}>سفارشات</button>
        <button className={mode == 'information'? 'btn btn-primary' : 'btn btn-secondary'} onClick={() => setMode('information')}>اطلاع رسانی ها</button>
        <button className={mode == 'suggestion'? 'btn btn-primary' : 'btn btn-secondary'} onClick={() => setMode('suggestion')}>پیشنهادات</button>

      </div>
        
      {isLoading && <span className="loading loading-dots loading-lg"></span>}
      {notifications && notifications.map((notification : Notification , index : any) =>{
        if(notification.type == mode){
          return <NotificationCard notification={notification} />
        }
      })}
    </div>
  )
}

export default NotificationList
