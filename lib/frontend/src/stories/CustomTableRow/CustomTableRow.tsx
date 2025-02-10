import React from "react";
import { TableRow, TableCell } from "@mui/material";
import "@fontsource/heebo";
import Status from "../Status/Status";

interface CustomTableRowProps {
  data: { [key: string]: any };
}

const CustomTableRow: React.FC<CustomTableRowProps> = ({ data }) => {
  return (
    <TableRow>
      {Object.entries(data).map(([key, value], index) => (
        <TableCell
          sx={{
            width: 183,
            paddingLeft: 2,
            paddingRight: 2,
            paddingTop: 1,
            paddingBottom: 1,
            textAlign: "right",
            color: "#032B40",
            fontSize: 17,
            fontFamily: "Heebo",
            fontWeight: "400",
            // wordWrap: "break-word",
            borderBottom: "1px #F5F6FA solid",
          }}
          key={index}
        >
          {key === "status" ? <Status status={value} /> : value}
          {value}
        </TableCell>
      ))}
    </TableRow>
  );
};

export default CustomTableRow;
