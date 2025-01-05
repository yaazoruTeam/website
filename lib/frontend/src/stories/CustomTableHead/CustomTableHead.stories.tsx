import React from "react";
import CustomTableHead from "./CustomTableHead";

export default {
  title: "Components/CustomTableHead",
  component: CustomTableHead,
};

const headers = [
  "מספר לקוח", 
  "שם פרטי", 
  "שם משפחה", 
  "טלפון", 
  "סטטוס", 
  "כתובת",
  "עיר", 
  "אזור"
];

export const Default = () => <CustomTableHead headers={headers} />;
