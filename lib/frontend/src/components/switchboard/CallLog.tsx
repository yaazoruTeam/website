import { useState } from 'react'
import { Box } from '@mui/material'
import CustomTypography from '../designComponent/Typography'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { CustomButton } from '../designComponent/Button'
import { ArrowDownOnSquareIcon, ArrowPathIcon } from '@heroicons/react/24/outline'
import PhoneNumber from './PhoneNumer'
import { formatDateToString } from '../designComponent/FormatDate'
import CustomTable from '../designComponent/CustomTable'
import { Switchboard, CallRecord } from '@model'
import { getCallHistory } from '../../api/switchboard'

//to do: טיפוס זמני לשנות לטיפוס הנכון
type CallLogEntry = Switchboard.CallLogEntry

const CallLog: React.FC = () => {
  const { t } = useTranslation()
  const { callId } = useParams()
  const [calls, setCalls] = useState<CallLogEntry[]>([
    //to do:Change the data type to match the actual data.
    {
      country: '972-79-606-4286',
      target: '1-973-964-0286',
      date: Date.now(),
      durationCall: '01:04:23',
      timeCall: '23:44:00 pm',
      costInShekels: '03.00',
      penniesPerMinute: '04.00',
    },
  ])

  //to to:useEffect to fetch the data from the server

  const columns = [
    { label: t('country'), key: 'country' },
    { label: t('target'), key: 'target' },
    { label: t('date'), key: 'date' },
    { label: t('durationCall'), key: 'durationCall' },
    { label: t('timeCall'), key: 'timeCall' },
    { label: t('costInShekels'), key: 'costInShekels' },
    { label: t('penniesPerMinute'), key: 'penniesPerMinute' },
  ]

  const tableData = calls.map((call) => ({
    country: <PhoneNumber country='Israel' phoneNumber={call.country} />,
    target: <PhoneNumber country='USA' phoneNumber={call.target} />,
    date: formatDateToString(new Date(call.date)),
    durationCall: call.durationCall,
    timeCall: call.timeCall,
    costInShekels: call.costInShekels,
    penniesPerMinute: call.penniesPerMinute,
  }))

  console.log('callId', callId)

  const downloadFile = async () => {
    try {
      // קריאה לשרת לקבלת הנתונים
      const callRecords = await getCallHistory()
      
      if (!callRecords || callRecords.length === 0) {
        alert(t('noDataAvailable'))
        return
      }

      // יצירת headers של CSV
      const headers = [
        'מזהה',
        'מזהה לקוח',
        'מספר המתקשר',
        'מספר חייוג',
        'CID יוצא',
        'יעד',
        'משך (שניות)',
        'עלות',
        'סוג קריאה',
        'ספק',
        'סטטוס',
        'זמן התחלה',
        'שם לקוח',
      ]

      // יצירת שורות CSV מהנתונים
      const rows = callRecords.map((record: CallRecord.Model) => [
        record.id,
        record.customerId,
        record.callerId,
        record.dialedNumber,
        record.outgoingCid,
        record.destination,
        record.duration,
        record.cost.toFixed(2),
        record.callType,
        record.provider,
        record.status,
        new Date(record.startTime).toLocaleString('he-IL'),
        record.customer
          ? `${record.customer.first_name} ${record.customer.last_name}`
          : '',
      ])

      // עיצוב CSV עם BOM לתמיכה בעברית
      const csvContent = [
        '\uFEFF', // BOM for UTF-8
        headers.join(','),
        ...rows.map((row: (string | number)[]) =>
          row
            .map((cell: string | number) => {
              // עטיפת תאים שמכילים פסיקים או מרכאות בגרשיים
              const stringCell = String(cell)
              if (stringCell.includes(',') || stringCell.includes('"') || stringCell.includes('\n')) {
                return `"${stringCell.replace(/"/g, '""')}"` // Escape quotes
              }
              return stringCell
            })
            .join(',')
        ),
      ].join('\n')

      // יצירת blob וקישור להורדה
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      const url = URL.createObjectURL(blob)

      link.setAttribute('href', url)
      link.setAttribute('download', `call-history-${new Date().toISOString().split('T')[0]}.csv`)
      link.style.visibility = 'hidden'

      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      // ניקוי הזיכרון
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error downloading call history:', error)
      alert(t('downloadError') || 'שגיאה בהורדת הקובץ')
    }
  }

  const refresh = () => {
    //to do: refresh list - Re-fetch the data - send to useEffect again
    console.log('Refreshing...')
    setCalls([
      //to do: Change this to fetch the actual data from the server
      {
        country: '972-79-606-4286',
        target: '1-973-964-0286',
        date: Date.now(),
        durationCall: '01:04:23',
        timeCall: '23:44:00 pm',
        costInShekels: '03.00',
        penniesPerMinute: '04.00',
      },
    ])
  }

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Box>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'end',
              gap: '10px',
            }}
          >
            <CustomTypography variant='h1' weight='bold' text={`${t('callLog')} /`} />
            <CustomTypography variant='h2' weight='regular' text={`${callId}`} />
          </Box>
          {/*to do : לבדוק מאיפה מגיעים הנתונים של זה ולשנות את זה לנתונים האמיתיים אחרי קראית שרת.*/}
          <CustomTypography
            variant='h3'
            weight='regular'
            text={`${t('total')} 146 ${t('calls')} ${t('during')} 06:32:42 ${t('hours')} $3.765`}
          />
        </Box>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
          }}
        >
          <CustomButton
            label={t('downloadingFile')}
            icon={<ArrowDownOnSquareIcon />}
            sx={{ flexDirection: 'row-reverse' }}
            onClick={downloadFile}
          />
          <CustomButton
            label={t('refresh')}
            icon={<ArrowPathIcon />}
            sx={{ flexDirection: 'row-reverse' }}
            onClick={refresh}
          />
        </Box>
      </Box>
      <CustomTable columns={columns} data={tableData} />
    </Box>
  )
}

export default CallLog
