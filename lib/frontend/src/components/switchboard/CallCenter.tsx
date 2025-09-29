import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import PhoneNumber from './PhoneNumer'
import { formatDateToString } from '../designComponent/FormatDate'
import CustomSwitch from '../designComponent/Switch'
import { Box } from '@mui/system'
import CustomTypography from '../designComponent/Typography'
import { CustomButton } from '../designComponent/Button'
import CustomTable from '../designComponent/CustomTable'
import { PencilSquareIcon } from '@heroicons/react/24/outline'
import { TrashIcon } from '@heroicons/react/24/outline'
import TableWithArrow from '../../assets/TableWithArrow.svg'
import ChangingDestinations from '../../assets/ChangingDestinations.svg'
import CallLog from '../../assets/CallLog.svg'
import ChangeAccountModal from './ChangeAccountModal'
import PurchasingNewNumber from './PurchasingNewNumber'
import SwitchboardTabs from './SwitchboardTabs'
import CustomSearchSelect from '../designComponent/CustomSearchSelect'
import { Switchboard } from '@model'

//to do: טיפוס זמני לשנות לטיפוס הנכון
type SwitchboardCall = Switchboard.SwitchboardCall
//to do: טיפוס זמני לשנות לטיפוס הנכון
type SwitchEventHandler = Switchboard.SwitchEventHandler
//to do: טיפוס זמני לשנות לטיפוס הנכון
type CallActionHandler = Switchboard.CallActionHandler

const CallCenter: React.FC = () => {
  const { t } = useTranslation()
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [calls, setCalls] = useState<SwitchboardCall[]>([
    {
      organizationName: '1234',
      number: '125-324-6587',
      country: 'Israel',
      target: '125-324-6587',
      fromDate: new Date(Date.now()),
      definedAsAnIdentifier: true,
      monthlyCost: 100,
      outgoingCalls: false,
    },
    {
      organizationName: '1111',
      number: '111-111-1111',
      country: 'USA',
      target: '111-111-1111',
      fromDate: new Date(Date.now()),
      definedAsAnIdentifier: true,
      monthlyCost: 100,
      outgoingCalls: false,
    },
  ])
  const [openSwitchAccount, setOpenSwitchAccount] = useState(false)
  const [openBuyNew, setOpenBuyNew] = useState(false)
  const [expandedRowIndex, setExpandedRowIndex] = useState<number | null>(null)

  const editCallCenter = () => {
    console.log('editCallCenter')
  }
  const callLog: CallActionHandler = (call) => {
    console.log('callLog', call)
    navigate(`./callLog/${call.target}`)
  }
  const switchAccount = () => {
    console.log('Switch account')
    setOpenSwitchAccount(true)
  }
  const tableWithArrow = () => {
    console.log('tableWithArrow')
  }
  const deleteCall = () => {
    console.log('deleteCall')
  }

  const handleRowClick = (rowIndex: number) => {
    setExpandedRowIndex(expandedRowIndex === rowIndex ? null : rowIndex)
  }

  //to do : לשנות ולהתאים את זה
  const columns = [
    { label: t('organizationName'), key: 'organizationName' },
    { label: t('number'), key: 'number' },
    { label: t('target'), key: 'target' },
    { label: t('fromDate'), key: 'fromDate' },
    { label: t('definedAsAnIdentifier'), key: 'definedAsAnIdentifier' },
    { label: t('monthlyCost'), key: 'monthlyCost' },
    { label: t('outgoingCalls'), key: 'outgoingCalls' },
    { label: '', key: 'icons' },
  ]
  const tableData = calls.map((call) => ({
    organizationName: call.organizationName,
    //to do : לבדוק איך בדיוק הנתונים ניראים ולהתאים את זה
    number: <PhoneNumber phoneNumber={call.number} country={call.country} />,
    target: <PhoneNumber phoneNumber={call.target} country={call.country} />,
    fromDate: formatDateToString(call.fromDate),
    definedAsAnIdentifier: (
      <Box
        onClick={(e) => {
          e.stopPropagation()
        }}
      >
        <CustomSwitch
          checked={call.definedAsAnIdentifier}
          onChange={(e) => {
            changeDefinedAsAnIdentifier(e)
          }}
        />
      </Box>
    ),
    monthlyCost: call.monthlyCost,
    outgoingCalls: (
      <Box
        onClick={(e) => {
          e.stopPropagation()
        }}
      >
        <CustomSwitch
          checked={call.outgoingCalls}
          onChange={(e) => {
            changeOutgoingCalls(e)
          }}
        />
      </Box>
    ),
    icons: (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '8px',
          width: '100%',
        }}
      >
        <PencilSquareIcon
          style={{ width: '24px', height: '24px', cursor: 'pointer' }}
          onClick={editCallCenter}
        />
        <img
          src={CallLog}
          alt='callLog'
          style={{ width: '24px', height: '24px', cursor: 'pointer' }}
          onClick={(e) => {
            e.stopPropagation()
            callLog(call)
          }}
        />
        <img
          src={ChangingDestinations}
          alt='changingDestinations'
          style={{ width: '24px', height: '24px', cursor: 'pointer' }}
          onClick={(e) => {
            e.stopPropagation()
            switchAccount()
          }}
        />
        <img
          src={TableWithArrow}
          alt='TableWithArrow'
          style={{ width: '24px', height: '24px', cursor: 'pointer' }}
          onClick={(e) => {
            e.stopPropagation()
            tableWithArrow()
          }}
        />
        <TrashIcon
          style={{ width: '24px', height: '24px', cursor: 'pointer' }}
          onClick={(e) => {
            e.stopPropagation()
            deleteCall()
          }}
        />
      </Box>
    ),
  }))

  const changeDefinedAsAnIdentifier: SwitchEventHandler = (e) => {
    //to do : קריאת שרת לשינוי של כיבוי או הדלקה של מוגדר כמזהה
    console.log('changeDefinedAsAnIdentifier', e)
    //שינוי הסטטוס לבינתיים
    setCalls((prevCalls) =>
      prevCalls.map((call, i) => (i === 0 ? { ...call, definedAsAnIdentifier: e } : call)),
    )
  }

  const changeOutgoingCalls: SwitchEventHandler = (e) => {
    //to do : קריאת שרת לשינוי של כיבוי או הדלקה של שיחות יוצאות
    console.log('changeOutgoingCalls', e)
    //שינוי הסטטוס לבינתיים
    setCalls((prevCalls) =>
      prevCalls.map((call, i) => (i === 0 ? { ...call, outgoingCalls: e } : call)),
    )
  }
  const editAccount = () => {
    console.log('editAccount')
  }
  const purchasingNewNumber = () => {
    console.log('purchasingNewNumber')
    setOpenBuyNew(true)
  }
  return (
    <Box>
      <ChangeAccountModal open={openSwitchAccount} onClose={() => setOpenSwitchAccount(false)} />
      <PurchasingNewNumber open={openBuyNew} onClose={() => setOpenBuyNew(false)} />
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          my: '24px',
        }}
      >
        <CustomTypography
          text={`${t('callCenter')}/ ${id}`} //to do : לשנות לשם הארגון לאחר שיהיה לי את הנתונים האמיתיים
          weight='bold'
          variant='h1'
        />
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
          }}
        >
          <CustomButton
            label={t('editAccount')}
            buttonType='third'
            state='active'
            onClick={editAccount}
          />
          <CustomButton label={t('purchasingNewNumber')} onClick={purchasingNewNumber} />
        </Box>
      </Box>
      <Box
        sx={{
          paddingTop: 1,
          marginBottom: -3,
          display: 'flex',
          width: '100%',
          direction: 'rtl',
          gap: 2,
          justifyContent: 'flex-start',
          flexWrap: 'wrap',
          alignItems: 'center',
        }}
      >
        <Box sx={{ flex: 1, maxWidth: '15%', paddingLeft: 3 }}>
          <CustomSearchSelect
            searchType='other'
            placeholder={t('customerName')}
            SwitchboardSelect
          />
        </Box>
        <Box sx={{ flex: 1, maxWidth: '15%', paddingLeft: 3 }}>
          <CustomSearchSelect searchType='other' placeholder={t('phoneNumber')} SwitchboardSelect />
        </Box>
        <Box sx={{ flex: 1, maxWidth: '15%', paddingLeft: 3 }}>
          <CustomSearchSelect searchType='other' placeholder={t('fromDate')} SwitchboardSelect />
        </Box>
        <Box sx={{ flex: 1, maxWidth: '15%', paddingLeft: 3 }}>
          <CustomSearchSelect
            searchType='other'
            placeholder={t('StatusNumbers')}
            SwitchboardSelect
          />
        </Box>
      </Box>
      <CustomTable
        columns={columns}
        data={tableData}
        onRowClick={(_, index) => handleRowClick(index)}
        expandedRowIndex={expandedRowIndex}
        renderExpandedRow={() => <SwitchboardTabs />}
      />
    </Box>
  )
}

export default CallCenter
