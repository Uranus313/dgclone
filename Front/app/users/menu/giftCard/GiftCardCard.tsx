import React from 'react'

interface Props{
    code : string,
    amount : number,
    buyer? : {
        phoneNumber : string,
        firstName? : string,
        lastName? : string
    }
    user? : {
        phoneNumber : string,
        firstName? : string,
        lastName? : string
    }
}

const GiftCardCard = ( {code , amount , buyer , user } : Props) => {
  return (
    <div className=' m-3'>
      <div>
        <h1>دیجی مارکت</h1>
        <h1>{amount}</h1>
      </div>
      <div>
        <p>کد :{code}</p>
        {buyer && <div>
            <h2>فرستنده</h2>
            <p>شماره موبایل :{buyer.phoneNumber}</p>
            {(buyer.firstName || buyer.lastName) && 
            <div>
                <p>
                {(buyer.firstName ? buyer.firstName + " " : '') + (buyer.firstName?  buyer.lastName : null)}      
                </p>     
            </div>}
        </div>  }
        {user && <div>
            <h2>دریافت کننده</h2>
            <p>شماره موبایل :{user.phoneNumber}</p>
            {(user.firstName || user.lastName) && 
            <div>
                <p>
                {(user.firstName ? user.firstName + " " : '') + (user.firstName?  user.lastName : null)}      
                </p>
            </div>}
        </div>  }
      </div>
    </div>
  )
}

export default GiftCardCard
