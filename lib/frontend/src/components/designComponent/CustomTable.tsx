import React from "react";
import { Table, TableBody, TableContainer, Paper, TableHead, TableRow, TableCell } from "@mui/material";
import CustomTypography from "./Typography";
import { colors } from "../../styles/theme";
import { useTranslation } from "react-i18next";

interface CustomTableProps {
  columns: { label: string; key: string }[];
  data: { [key: string]: any }[];
  onRowClick?: (rowData: any) => void;
}

const CustomTable: React.FC<CustomTableProps> = ({ columns, data, onRowClick }) => {
  const { t } = useTranslation();
  return (
    <TableContainer component={Paper} sx={{ boxShadow: "none", padding: 2, direction: 'rtl', backgroundColor: 'transparent' }}>
      <Table sx={{ width: "100%" }}>
        <TableHead>
          <TableRow>
            {columns.map((column, index) => (
              <TableCell
                key={index}
                sx={{
                  textAlign: "right",
                  padding: "16px 20px",
                  backgroundColor: 'transparent',
                  borderBottom: 'none',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                <CustomTypography
                  variant="h4"
                  weight="medium"
                  color={colors.brand.color_9}
                  text={column.label}
                />
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.length > 0 ? (
            data.map((row, index) => (
              <TableRow
                key={index}
                onClick={() => {
                  if (onRowClick) {
                    console.log(row);
                    onRowClick(row);
                  }
                }} sx={{
                  width: '100%',
                  height: '57px',
                  paddingLeft: 24,
                  paddingRight: 24,
                  paddingTop: 16,
                  paddingBottom: 16,
                  background: colors.neutral.white,
                  borderBottom: `1px ${colors.brand.color_14} solid`,
                  cursor: onRowClick ? 'pointer' : 'auto'
                }}
              >
                {columns.map((column, colIndex) => {
                  const key = column.key;
                  return (
                    <TableCell
                      key={colIndex}
                      sx={{
                        textAlign: "right",
                        padding: "10px 20px",
                        backgroundColor: colors.neutral.white,
                        whiteSpace: key === 'dates' ? 'nowrap' : 'normal',
                      }}
                    >
                      <CustomTypography
                        variant="h4"
                        weight="regular"
                        color={colors.brand.color_9}
                        text={row[key] || t('dataNotAvailable')}
                      />
                    </TableCell>
                  );
                })}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} sx={{ textAlign: "center", padding: "10px 20px" }}>
                {t('noDataToDisplay')}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default CustomTable;
