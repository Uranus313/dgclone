'use client'
import React from 'react';
import { BarChart, Bar, Rectangle, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';


interface Props{
    data:{date:string,value:number}[]
}

const LinearChart = ({data}:Props) => {
    return (
        <ResponsiveContainer width="100%" height="100%">
          <LineChart 
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
            
            <Line strokeWidth={3} dataKey='value' fill="#395F82" activeDot={{r:8}} />
          </LineChart>
        </ResponsiveContainer>
  )
}

export default LinearChart
    