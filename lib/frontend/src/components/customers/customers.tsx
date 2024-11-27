import React, { useState } from "react";
import CustomersList from "./customersList";

const Customers: React.FC = () => {
  const [customers, setCustomers] = useState<string[]>(["דן ליבוביץ", "נועה כהן", "רון מלכה"]);

  return (
    <div>
      <CustomersList customers={customers}/>
    </div>
  );
};

export default Customers;
