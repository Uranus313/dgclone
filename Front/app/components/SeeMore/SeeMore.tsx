'use client'
import React, { useState, useRef, useEffect, ReactNode } from 'react';

interface SeeMoreLessProps {
  children: ReactNode[];
  minItemsCount: number;
}

const SeeMoreLess: React.FC<SeeMoreLessProps> = ({ children, minItemsCount }) => {
  const [isExpanded, setIsExpanded] = useState(false);


  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div>
        
      <div
        // ref={contentRef}
        className='hi'
        style={{
          overflow: 'hidden',
        }}
      >
        {isExpanded ? children : children.slice(0,minItemsCount)}
      </div>
        {/* <button onClick={()=>console.log(children.length)}>gu</button> */}
      {children.length > minItemsCount && (
        <button onClick={toggleExpand}>
          {isExpanded ? <p className='text-primary-color'>مشاهده ی کمتر</p> : <p className='text-primary-color'>مشاهده ی بیشتر</p>}
        </button>
      )}
    </div>
  );
};

export default SeeMoreLess;
