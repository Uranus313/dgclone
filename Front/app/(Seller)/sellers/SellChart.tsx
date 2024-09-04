'use client'
import React from 'react';
import { BarChart, Bar, Rectangle, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';


interface Props{
    data:{date:string,income:number}[]
}

const SellChart = ({data}:Props) => {
    return (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            width={500}
            height={300}
            data={data}
            className='p-4'
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis tickMargin={80}/>
            <Tooltip />
            <Legend />
            
            <Bar dataKey="income" fill="#395F82" activeBar={<Rectangle fill="gold" stroke="purple" />} />
          </BarChart>
        </ResponsiveContainer>
  )
}

export default SellChart
    