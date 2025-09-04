import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import { Paper, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TableRow } from '@mui/material'
import { Box } from '@mui/system'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { colors } from '../../styles/theme'
import CustomTypography from './Typography'

export type TableRowData = Record<string, React.ReactNode>

interface CustomTableProps {
  columns: { label: string, key: string }[]
  data: TableRowData[]
  onRowClick?: (rowData: TableRowData, rowIndex: number) => void
  showSummary?: { page: number, limit: number, total: number, totalPages: number, onPageChange: (page: number) => void }
  alignLastColumnLeft?: boolean
  expandedRowIndex?: number | null
  renderExpandedRow?: (rowData: TableRowData, rowIndex: number) => React.ReactNode
}

const CustomTable: React.FC<CustomTableProps> = ({ columns, data, onRowClick, showSummary, alignLastColumnLeft, expandedRowIndex, renderExpandedRow }) => {
  const { t } = useTranslation()

  return (
    <TableContainer
      component={Paper}
      sx={{ boxShadow: 'none', padding: 2, direction: 'rtl', backgroundColor: 'transparent' }}
    >
      <Table sx={{ width: '100%' }}>
        <TableHead>
          <TableRow>
            {columns.map((column, index) => (
              <TableCell
                key={index}
                sx={{
                  textAlign: alignLastColumnLeft && index === columns.length - 1 ? 'left' : 'right',
                  padding: '16px 20px',
                  backgroundColor: 'transparent',
                  borderBottom: 'none',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                <CustomTypography
                  variant='h4'
                  weight='medium'
                  color={colors.c11}
                  text={column.label}
                />
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.length > 0 ? (
            data.map((row, index) => {
              const actualIndex = showSummary
                ? ((showSummary.page ? showSummary.page - 1 : 0) * showSummary.limit + index)
                : index
              return (
                <React.Fragment key={index}>
                  <TableRow
                    // key={index}
                    onClick={() => {
                      if (onRowClick) {
                        onRowClick(row, actualIndex)
                      }
                    }}
                    sx={{
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
                      const key = column.key
                      return (
                        <TableCell
                          key={colIndex}
                          sx={{
                            textAlign:
                              alignLastColumnLeft && colIndex === columns.length - 1
                                ? 'left'
                                : 'right',
                            padding: '10px 20px',
                            backgroundColor: colors.c6,
                            whiteSpace: key === 'dates' ? 'nowrap' : 'normal',
                          }}
                        >
                          {typeof row[key] === 'string' ||
                            typeof row[key] === 'number' ||
                            typeof row[key] === 'boolean' ? (
                            <CustomTypography
                              variant='h4'
                              weight='regular'
                              color={colors.c11}
                              text={String(row[key] || t('dataNotAvailable'))}
                            />
                          ) : (
                            row[key]
                          )}
                        </TableCell>
                      )
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
              )
            })
          ) : (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                sx={{ textAlign: 'center', padding: '10px 20px' }}
              >
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
            }}
          >
            <TableRow>
              <TableCell
                colSpan={columns.length}
                sx={{
                  textAlign: 'right',
                  padding: '15px 20px',
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    gap: 6,
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      gap: 0.5,
                    }}
                  >
                    <CustomTypography
                      text={`${(showSummary.page - 1) * showSummary.limit + 1}`}
                      variant='h4'
                      weight='medium'
                      color={colors.c11}
                    />
                    <CustomTypography
                      text={t('to')}
                      variant='h4'
                      weight='regular'
                      color={colors.c11}
                    />
                    <CustomTypography
                      text={`${Math.min(showSummary.page * showSummary.limit, showSummary.total)}`}
                      variant='h4'
                      weight='medium'
                      color={colors.c11}
                    />
                    <CustomTypography
                      text={t('of')}
                      variant='h4'
                      weight='regular'
                      color={colors.c11}
                    />
                    <CustomTypography
                      text={`${showSummary.total}`}
                      variant='h4'
                      weight='medium'
                      color={colors.c11}
                    />
                  </Box>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.5,
                    }}
                  >
                    <ChevronRightIcon
                      style={{
                        width: '16px',
                        height: '16px',
                        color: colors.c11,
                        pointerEvents: showSummary.page === 1 ? 'none' : 'auto',
                        opacity: showSummary.page === 1 ? 0.5 : 1,
                        cursor: 'pointer',
                      }}
                      onClick={() => {
                        if (showSummary.page > 1) {
                          showSummary.onPageChange(showSummary.page - 1)
                        }
                      }}
                    />
                    <CustomTypography
                      text={t('page')}
                      variant='h4'
                      weight='regular'
                      color={colors.c11}
                    />
                    <CustomTypography
                      text={`${showSummary.page}`}
                      variant='h4'
                      weight='medium'
                      color={colors.c11}
                    />
                    <CustomTypography
                      text={t('of')}
                      variant='h4'
                      weight='regular'
                      color={colors.c11}
                    />
                    <CustomTypography
                      text={`${showSummary.totalPages}`}
                      variant='h4'
                      weight='medium'
                      color={colors.c11}
                    />
                    <ChevronLeftIcon
                      style={{
                        width: '16px',
                        height: '16px',
                        color: colors.c11,
                        pointerEvents: showSummary.page === showSummary.totalPages ? 'none' : 'auto',
                        opacity: showSummary.page === showSummary.totalPages ? 0.5 : 1,
                        cursor: 'pointer',
                      }}
                      onClick={() => {
                        if (showSummary.page < showSummary.totalPages) {
                          showSummary.onPageChange(showSummary.page + 1)
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
  )
}

export default CustomTable
