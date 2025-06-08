import React, { useEffect, useState } from "react";
import { Table, TableBody, TableContainer, Paper, TableHead, TableRow, TableCell, TableFooter } from "@mui/material";
import CustomTypography from "./Typography";
import { colors } from "../../styles/theme";
import { useTranslation } from "react-i18next";
import { ChevronRightIcon } from '@heroicons/react/24/outline'
import { ChevronLeftIcon } from '@heroicons/react/24/outline'
import { Box } from "@mui/system";

interface CustomTableProps {
  columns: { label: string; key: string }[];
  data: { [key: string]: any }[];
  onRowClick?: (rowData: any, rowIndex: number) => void;
  showSummary?: boolean;
  alignLastColumnLeft?: boolean;
  expandedRowIndex?: number | null;
  renderExpandedRow?: (rowData: any, rowIndex: number) => React.ReactNode;
}

const CustomTable: React.FC<CustomTableProps> = ({ columns, data, onRowClick, showSummary, alignLastColumnLeft, expandedRowIndex, renderExpandedRow }) => {
  const { t } = useTranslation();

  const rowsPerPage = 15;
  const [currentPage, setCurrentPage] = useState(1);
  const [paginatedData, setPaginatedData] = useState(data);

  const totalRecords = showSummary ? data.length : 0;
  const totalPages = showSummary ? Math.ceil(totalRecords / rowsPerPage) : 1;

  useEffect(() => {
    if (showSummary) {
      const offset = (currentPage - 1) * rowsPerPage;
      setPaginatedData(data.slice(offset, offset + rowsPerPage));
    } else {
      setPaginatedData(data);
    }
  }, [currentPage, data, showSummary]);

  const handlePageChange = (value: number) => {
    setCurrentPage(value);
  };

  return (
    <TableContainer component={Paper} sx={{ boxShadow: "none", padding: 2, direction: 'rtl', backgroundColor: 'transparent' }}>
      <Table sx={{ width: "100%" }}>
        <TableHead>
          <TableRow>
            {columns.map((column, index) => (
              <TableCell
                key={index}
                sx={{
                  textAlign: alignLastColumnLeft && index === columns.length - 1 ? "left" : "right",
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
                  color={colors.c11}
                  text={column.label}
                />
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {paginatedData.length > 0 ? (
            paginatedData.map((row, index) => {
              const actualIndex = (currentPage - 1) * rowsPerPage + index;
              return (
                <React.Fragment key={index}>
                  <TableRow
                    // key={index}
                    onClick={() => {
                      if (onRowClick) {
                        onRowClick(row, actualIndex);
                      }
                    }} sx={{
                      width: '100%',
                      height: '57px',
                      paddingLeft: 24,
                      paddingRight: 24,
                      paddingTop: 16,
                      paddingBottom: 16,
                      background: colors.c6,
                      borderBottom: `1px ${colors.c15} solid`,
                      cursor: onRowClick ? 'pointer' : 'auto',
                    }}
                  >
                    {columns.map((column, colIndex) => {
                      const key = column.key;
                      return (
                        <TableCell
                          key={colIndex}
                          sx={{
                            textAlign: alignLastColumnLeft && colIndex === columns.length - 1 ? "left" : "right",
                            padding: "10px 20px",
                            backgroundColor: colors.c6,
                            whiteSpace: key === 'dates' ? 'nowrap' : 'normal',
                          }}
                        >
                          {typeof row[key] === 'string' || typeof row[key] === 'number' || typeof row[key] === 'boolean' ?
                            <CustomTypography
                              variant="h4"
                              weight="regular"
                              color={colors.c11}
                              text={String(row[key] || t('dataNotAvailable'))}
                            /> : row[key]}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                  {expandedRowIndex === actualIndex && renderExpandedRow && (
                    <TableRow>
                      <TableCell colSpan={columns.length} sx={{ padding: 0 }}>
                        {renderExpandedRow(row, actualIndex)}
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              );
            })
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} sx={{ textAlign: "center", padding: "10px 20px" }}>
                {t('noDataToDisplay')}
              </TableCell>
            </TableRow>
          )}
        </TableBody>

        {showSummary && (
          <TableFooter
            sx={{
              backgroundColor: colors.c6,
              borderBottom: `none`,
            }}>
            <TableRow>
              <TableCell colSpan={columns.length} sx={{
                textAlign: "right",
                padding: "15px 20px",
              }}>
                <Box sx={{
                  display: 'flex',
                  gap: 6
                }}>
                  <Box sx={{
                    display: 'flex',
                    gap: 0.5
                  }}>
                    <CustomTypography
                      text={`${(currentPage - 1) * rowsPerPage + 1}`}
                      variant="h4"
                      weight="medium"
                      color={colors.c11}
                    />
                    <CustomTypography
                      text={t('to')}
                      variant="h4"
                      weight="regular"
                      color={colors.c11}
                    />
                    <CustomTypography
                      text={`${Math.min(currentPage * rowsPerPage, totalRecords)}`}
                      variant="h4"
                      weight="medium"
                      color={colors.c11}
                    />
                    <CustomTypography
                      text={t('of')}
                      variant="h4"
                      weight="regular"
                      color={colors.c11}
                    />
                    <CustomTypography
                      text={`${totalRecords}`}
                      variant="h4"
                      weight="medium"
                      color={colors.c11}
                    />
                  </Box>
                  <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5
                  }}>
                    <ChevronRightIcon
                      style={{
                        width: '16px',
                        height: '16px',
                        color: colors.c11,
                        pointerEvents: currentPage === 1 ? 'none' : 'auto',
                        opacity: currentPage === 1 ? 0.5 : 1,
                        cursor: 'pointer',
                      }}
                      onClick={() => {
                        if (currentPage > 1) {
                          handlePageChange(currentPage - 1);
                        }
                      }}
                    />
                    <CustomTypography
                      text={t('page')}
                      variant="h4"
                      weight="regular"
                      color={colors.c11}
                    />
                    <CustomTypography
                      text={`${currentPage}`}
                      variant="h4"
                      weight="medium"
                      color={colors.c11}
                    />
                    <CustomTypography
                      text={t('of')}
                      variant="h4"
                      weight="regular"
                      color={colors.c11}
                    />
                    <CustomTypography
                      text={`${totalPages}`}
                      variant="h4"
                      weight="medium"
                      color={colors.c11}
                    />
                    <ChevronLeftIcon
                      style={{
                        width: '16px',
                        height: '16px',
                        color: colors.c11,
                        pointerEvents: currentPage === totalPages ? 'none' : 'auto',
                        opacity: currentPage === totalPages ? 0.5 : 1,
                        cursor: 'pointer',
                      }}
                      onClick={() => {
                        if (currentPage < totalPages) {
                          handlePageChange(currentPage + 1);
                        }
                      }}
                    />
                  </Box>
                </Box>
              </TableCell>
            </TableRow>
          </TableFooter>

        )}

      </Table>
    </TableContainer>
  );
};

export default CustomTable;
