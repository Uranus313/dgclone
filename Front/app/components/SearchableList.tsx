'use client'
import React, { useState } from 'react';
import { Color } from './Interfaces/interfaces';


interface Props{
    items:any[],
    showKey?:string,
    setKey?:string,
    setFunc: any,
    showFunc :React.Dispatch<React.SetStateAction<string>>,
}

const SearchableList = ({items , showKey , setKey , setFunc,showFunc}:Props) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredItems = items.filter(item =>
   showKey ? item[showKey].toLowerCase().includes(searchTerm.toLowerCase()) : item.toLowerCase().includes(searchTerm.toLowerCase()) 
  );

  return (
    <div className="p-4">
      <input
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4 p-2 border border-gray-300 rounded"
      />
      <ul className="list-disc pl-5">
        {filteredItems.map((item, index) => (
          <li key={index} className="mb-2 list-none">
            <form method='dialog'>
               { showKey? <button onClick={()=>{
                            setFunc(item);showFunc(item[showKey]);
                        }} >
                            <div className='flex items-center'>
                                {item.hex && <div className='w-10 h-10 ml-4 rounded-md border border-grey-light' style={{backgroundColor:item.hex}}></div>}
                                {item[showKey]}
                            </div>
                        </button>

                :       <button onClick={()=>{
                            setFunc(item);showFunc(item);
                        }} >{item}
                        </button>
                }
            </form>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchableList;
