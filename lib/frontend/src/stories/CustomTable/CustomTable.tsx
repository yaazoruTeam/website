import React, { useEffect, useState } from "react";
import { Table, TableBody, TableContainer, Paper } from "@mui/material";
import CustomTableRow from "../CustomTableRow/CustomTableRow";
import { getCustomers } from "../../api/customerAPI";
import { Customer } from "../../model/src";

interface CustomTableProps {
    data: { [key: string]: any }[];
}

const CustomTable: React.FC<CustomTableProps> = ({data}) => {
  const [customersData, setCustomersData] = useState<Customer.Model[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const result: Customer.Model[] = await getCustomers();
      setCustomersData(result);
    };
    // בהמשך יהיה פה טעינת נתוני שאר הטבלאות

    loadData();
  }, []);

  return (
    <TableContainer component={Paper} sx={{ boxShadow: "none", padding: 2 }}>
      <Table sx={{ width: "100%" }}>
        <TableBody>
          {customersData.map((row, index) => (
            <CustomTableRow key={index} data={row} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default CustomTable;
