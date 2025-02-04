'use client'

import { ProductInterface } from "@/app/components/Interfaces/interfaces";
import { useUser } from "@/app/hooks/useUser";
import { useMutation } from '@tanstack/react-query';
import React, { useContext, useRef, useState } from 'react'
import { Comment } from "@/app/components/Interfaces/interfaces";


interface Props {
  comment: Comment
}
const CommentPopUp = ({ comment }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [error, setError] = useState<string | null>(null);
  const { user } = useUser();

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
  const unbanComment = useMutation({
    mutationFn: async () => {
      const result = await fetch("https://localhost:8080/products/validate-comments" + `?CommentID=${comment._id}&ValidationState=2`, {
        method: "PATCH",
        credentials: 'include',
        headers: {
          "Content-Type": "application/json",
        },

      });
      const jsonResult = await result.json();
      console.log(jsonResult);
      if (result.ok) {
        return jsonResult
      } else {
        throw new Error(jsonResult.error);
      }
    },
    onSuccess: (savedUser) => {
      console.log(savedUser);
      comment.validation_state = 2;
      closeModal();
    },
    onError: (error) => {
      console.log(error);
      setError(error.message)
    }
  });

  const banComment = useMutation({
    mutationFn: async () => {
      const result = await fetch("https://localhost:8080/products/validate-comments" + `?CommentID=${comment._id}&ValidationState=3`, {
        method: "PATCH",
        credentials: 'include',
        headers: {
          "Content-Type": "application/json",
        },

      });
      const jsonResult = await result.json();
      console.log(jsonResult);
      if (result.ok) {
        return jsonResult
      } else {
        throw new Error(jsonResult.error);
      }
    },
    onSuccess: (savedUser) => {
      console.log(savedUser);
      comment.validation_state = 3;
      closeModal();
    },
    onError: (error) => {
      console.log(error);
      setError(error.message)
    }
  });


  return (
    <div className="text-right">
      {comment.validation_state == 1 &&
        <div className='w-full p-10 border-b-2 border-border'>
          <div className=' pb-5'>
            <p className='text-text-color'>آی دی محصول : </p>
            <p>{comment.product_id}</p>
            <p className=' pl-5 text-text-color text-right'> تاریخ  : </p>
            <p>{comment.date_sent?.toString()}</p>
            <p className=' pl-5 text-text-color text-right'> نوع  : </p>
            {comment.comment_type == 1 && <p>عادی</p>}
            {comment.comment_type == 2 && <p>سوال</p>}
            {comment.comment_type == 3 && <p>جواب</p>}
          </div>
          <p className='pb-5 line-clamp-3 break-all text-right'>پیام : {comment.content}</p>
          <button className='text-primary-color py-5 pb-8 w-full text-right'>بیشتر</button>
          {user &&
            <div>
              {user.roleID &&
                <div>

                  {user.roleID.accessLevels &&
                    <div>
                      {user.roleID.accessLevels.some(accessLevel => accessLevel.level === "commentManage" && accessLevel.writeAccess === true) &&

                        <div>
                          <button onClick={() => unbanComment.mutate()} className='text-green-box border-green-box rounded-md border-2 p-3 mx-3'>
                            تایید
                          </button>
                          <button onClick={() => banComment.mutate()} className='text-red-box border-red-box rounded-md border-2 p-3'>
                            رد
                          </button>
                        </div>
                      }
                    </div>
                  }
                </div>
              }
            </div>
          }
        </div>
      }
    </div>
  )
}

export default CommentPopUp
