import React from 'react';

interface FormatDateProps {
  date: Date | string;
}

const FormatDate: React.FC<FormatDateProps> = ({ date }) => { 
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime()) || parsedDate.getFullYear() === 1999) {
        return <span>?</span>; 
    }
    const day = String(parsedDate.getDate()).padStart(2, '0');
    const month = String(parsedDate.getMonth() + 1).padStart(2, '0');
    const year = parsedDate.getFullYear();
  
    return <span>{`${day}/${month}/${year}`}</span>;
};

export default FormatDate;
