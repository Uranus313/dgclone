import { details } from '@/app/components/Interfaces/interfaces';
import React, { useState } from 'react';

interface DetailProps {
  detail: details;
  onChange: (key: string, value: string) => void;
}

 const DetailComponent: React.FC<DetailProps> = ({ detail, onChange }) => {
  return (
    <div>
      <h3>{detail.title}</h3>
      {Object.keys(detail.map).map((key) => (
        <div key={key}>
          <label>{key}:</label>
          <input
            type="text"
            value={detail.map[key]}
            onChange={(e) => onChange(key, e.target.value)}
          />
        </div>
      ))}
    </div>
  );
};

export default DetailComponent
