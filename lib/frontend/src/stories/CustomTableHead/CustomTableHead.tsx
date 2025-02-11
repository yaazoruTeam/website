import React from "react";
import { TableHead, TableRow, TableCell } from "@mui/material";
import { colors } from "../../styles/theme";

interface CustomTableHeadProps {
  headers: string[];
}

const CustomTableHead: React.FC<CustomTableHeadProps> = ({ headers }) => {
  return (
    <TableHead>
      <TableRow>
        {headers.map((header, index) => (
          <TableCell
            key={index}
            sx={{
              textAlign: "right",
              color: colors.brand.color_9,
              fontSize: 17,
              fontFamily: "Heebo",
              fontWeight: "500",
            //   wordWrap: "break-word",
              paddingLeft: 2,
              paddingRight: 2,
              paddingTop: 1,
              paddingBottom: 1,
              width: "180px",
            }}
          >
            {header}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
};

export default CustomTableHead;
