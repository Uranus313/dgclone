'use client'
import React, { useState } from 'react'
import CommentList from './comment/CommentList';
import ProductList from './product/ProductList';
const Validation = () => {
    
  const [list, setList] = useState<string>('comments');
  return (
    <div className='w-full p-8 py-5'>
        {list === 'comments' ? <CommentList changeList={(list => setList(list))} />
            : <ProductList changeList={(list => setList(list))} />}
    </div>
  )
}

export default Validation
