import { useTranslation } from 'react-i18next'
import CustomTypography from '../designComponent/Typography'
import { Box } from '@mui/material'
import { CustomButton } from '../designComponent/Button'
import { CustomTextField } from '../designComponent/Input'
import { Cog8ToothIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { useForm } from 'react-hook-form'
import { colors } from '../../styles/theme'
import CustomTable, { TableRowData } from '../designComponent/CustomTable'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Switchboard as  SwitchboardModel} from '@model'

//to do: טיפוס זמני לשנות לטיפוס הנכון
type SwitchboardAccount = SwitchboardModel.SwitchboardAccount

const Switchboard: React.FC = () => {
  const { t } = useTranslation()
  const { control } = useForm<{ search: string }>()
  const navigate = useNavigate()

  //@ts-ignore
  //to do : לשנות את זה למערך מסוד המרכזיה וליצור useEffect ששולף את הנתונים הנכונים מהשרת
  const [switchboardAccounts, setSwitchboardAccounts] = useState<SwitchboardAccount[]>([
    {
      ID: 1111,
      customerName: 'יעזורו',
      email: 'yaazoru@gmail.com',
      notes: 'אין לי מה לכתוב...',
      balanceForUse: 100,
    },
  ])

  const settings = () => {
    console.log('settings')
  }
  const columns = [
    { label: t('ID'), key: 'ID' },
    { label: t('customerName'), key: 'customerName' },
    { label: t('email'), key: 'email' },
    { label: t('notes'), key: 'notes' },
    { label: t('balanceForUse'), key: 'balanceForUse' },
    { label: '', key: 'settings' },
  ]
  //to do : להתאים את זה למודל
  const tableData = switchboardAccounts.map((switchboard) => ({
    ID: switchboard.ID,
    customerName: switchboard.customerName,
    email: switchboard.email,
    notes: switchboard.notes,
    balanceForUse: switchboard.balanceForUse,
    settings: (
      <Cog8ToothIcon
        onClick={(e) => {
          e.stopPropagation()
          settings()
        }}
      />
    ),
  }))
  //to do : לשנות את זה למודל
  const onClickAccountSwitchboard = (_rowData: TableRowData, rowIndex: number) => {
    const rowData = switchboardAccounts[rowIndex]
    navigate(`/switchboard/callcenter/${rowData.ID}`, {
      state: {
        ID: rowData.ID,
      },
    })
  }
  return (
    <>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <CustomTypography text={t('allAccounts')} weight='bold' variant='h1' />
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            // gap:'24px'
          }}
        >
          <Box
            sx={{
              width: '250px',
              height: '44px',
              mx: '24px',
              border: `1px solid ${colors.blueOverlay700}`,
              paddingLeft: '10px',
              borderRadius: '8px',
            }}
          >
            <CustomTextField
              placeholder={t('search')}
              icon={<MagnifyingGlassIcon />}
              control={control}
              name='search'
            // sx={{ border: `1px solid ${colors.blueOverlay700}`, width: '250px' }}
            />
          </Box>
          <CustomButton label={t('addAnAccount')} buttonType='first' state='default' />
        </Box>
      </Box>
      <CustomTable columns={columns} data={tableData} onRowClick={onClickAccountSwitchboard} />
    </>
  )
}

export default Switchboard
