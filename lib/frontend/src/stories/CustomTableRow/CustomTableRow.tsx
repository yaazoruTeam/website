import React from 'react'
import { TableRow, TableCell } from '@mui/material'
import '@fontsource/heebo'
import Status from '../../components/designComponent/Status'
import { colors } from '../../styles/theme'

type StatusType = "active" | "inactive" | "blocked" | "canceled" | "imei_locked"
interface CustomTableRowProps {
  data: { [key: string]: string | number | boolean | StatusType | undefined }
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
          {key === 'status' && typeof value === 'string' && ['active', 'inactive', 'blocked', 'canceled', 'imei_locked'].includes(value) ? (
            <Status status={value as StatusType} />
          ) : (
            value
          )}
        </TableCell>
      ))}
    </TableRow>
  )
}

export default CustomTableRow
