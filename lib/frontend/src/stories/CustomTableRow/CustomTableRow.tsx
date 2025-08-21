import React from 'react'
import { TableRow, TableCell } from '@mui/material'
import '@fontsource/heebo'
import Status from '../../components/designComponent/Status'
import { colors } from '../../styles/theme'

interface CustomTableRowProps {
  data: { [key: string]: unknown }
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
            textAlign: 'right',
            color: colors.c11,
            fontSize: 17,
            fontFamily: 'Heebo',
            fontWeight: '400',
            // wordWrap: "break-word",
            borderBottom: `1px ${colors.c15} solid`,
          }}
          key={index}
        >
          {key === 'status' && typeof value === 'string' ? (
            <Status status={value as 'active' | 'inactive' | 'blocked' | 'canceled' | 'imei_locked'} />
          ) : React.isValidElement(value) ? (
            value
          ) : (
            String(value || '')
          )}
        </TableCell>
      ))}
    </TableRow>
  )
}

export default CustomTableRow
