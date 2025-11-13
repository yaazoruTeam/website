import React, { useState } from 'react'
import { Box, useMediaQuery } from '@mui/material'
import { CustomButton } from '../designComponent/Button'
import { colors } from '../../styles/theme'
import CustomTypography from '../designComponent/Typography'
import { useTranslation } from 'react-i18next'
import { SimCard } from '@model'
import CustomTable, { TableRowData } from '../designComponent/CustomTable'
import StatusTag from '../designComponent/Status'
import { useNavigate } from 'react-router-dom'
import CustomSearchSelect from '../designComponent/CustomSearchSelect'
import FilterResetButton from '../designComponent/FilterResetButton'
import AddDeviceForm from './AddDeviceForm'
import { formatDateToString } from '../designComponent/FormatDate'

type DeviceFilterType =
  | { type: 'status'; value: 'active' | 'inactive' }
  | { type: 'date'; value: { start: Date; end: Date } }
  | null

interface DevicesListProps {
  devices: SimCard.Model[]
  total: number
  page: number
  limit: number
  onPageChange: (page: number) => void
  onFilterChange: (filter: DeviceFilterType) => void
  onRefresh: () => void
  isResetDisabled: boolean
}

const DevicesList: React.FC<DevicesListProps> = ({ devices, total, page, limit, onPageChange, onFilterChange, onRefresh, isResetDisabled }) => {
  const totalPages = Math.ceil(total / limit)
  const { t } = useTranslation()
  const [showAddDevice, setShowAddDevice] = useState(false)
  const isMobile = useMediaQuery('(max-width:600px)')
  const navigate = useNavigate()
  const [resetTrigger, setResetTrigger] = useState(false)

  const handleResetFilters = () => {
    onFilterChange(null)
    onPageChange(1)
    setResetTrigger(true)
    setTimeout(() => setResetTrigger(false), 0)
  }

  const columns = [
    { label: t('simNumber'), key: 'simNumber' },
    { label: t('deviceNumber'), key: 'device_number' },
    { label: t('serialNumber'), key: 'serialNumber' },
    { label: t('IMEI'), key: 'IMEI' },
    { label: t('deviceModel'), key: 'model' },
    { label: t('purchaseDate'), key: 'purchaseDate' },
    { label: t('plan'), key: 'plan' },
    { label: '', key: 'status' },
  ]

  const tableData = (devices ?? []).map((item: SimCard.Model) => {

    return {
      simCard_id: item.simCard_id,
      simNumber: item.simNumber,
      device_number: item.device?.device_number ? item.device.device_number : '-',
      serialNumber: item.device?.serialNumber ? item.device.serialNumber : '-',
      IMEI: item.device?.IMEI_1 ? item.device.IMEI_1 : '-',
      model: item.device?.model ? item.device.model : '-',
      purchaseDate: item.receivedAt ? `${formatDateToString(item.receivedAt)}` : '-',
      plan: item.plan,
      status: item.device
        ? (item.status === 'active' ? <StatusTag status='active' /> : <StatusTag status='inactive' />)
        : <StatusTag status='active' />,
    }
  })

  const onClickDevice = (item: SimCard.Model) => {
    // Navigate to device card using the SIM card ID
    navigate(`/device/card/${item.simCard_id}`)
  }

  const handleAddDeviceSuccess = () => {
    setShowAddDevice(false)
    onRefresh()
  }

  const handleRowClick = (rowData: TableRowData, _rowIndex: number) => {
    const simCardId = rowData.simCard_id
    const item = devices.find(d => {
      const id = (d as any).simCard_id || (d as any).device_id
      return id === simCardId
    })
    if (item) {
      onClickDevice(item)
    }
  }

  return (
    <Box
      sx={{
        width: '100%',
        height: '50%',
        borderRadius: 2,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        gap: 4,
      }}
    >
      <AddDeviceForm
        open={showAddDevice}
        onClose={() => setShowAddDevice(false)}
        onSuccess={handleAddDeviceSuccess}
      />

      <Box
        sx={{
          direction: 'rtl',
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <CustomTypography
          text={t('deviceManagement')}
          variant='h1'
          weight='bold'
          color={colors.blue900}
        />

        <CustomButton
          label={t('addingNewDevice')}
          size={isMobile ? 'small' : 'large'}
          state='default'
          buttonType='first'
          onClick={() => setShowAddDevice(true)}
        />
      </Box>
      <Box
        sx={{
          width: '100%',
          direction: 'rtl',
          marginTop: 2,
          display: 'flex',
          gap: 2,
          justifyContent: 'flex-start',
          flexWrap: 'wrap',
          alignItems: 'center',
        }}
      >
        <Box sx={{ flex: 1, maxWidth: '15%', paddingLeft: 3 }}>
          <CustomSearchSelect
            searchType='status'
            placeholder={t('deviceStatus')}
            onStatusSelect={(status: 'active' | 'inactive') => {
              onFilterChange(status ? { type: 'status', value: status } : null)
              onPageChange(1)
            }}
            resetTrigger={resetTrigger}
          />
        </Box>
        <Box sx={{ flex: 1, maxWidth: '15%', paddingLeft: 3 }}>
          <CustomSearchSelect
            searchType='date'
            placeholder={t('DateInRange')}
            onDateRangeSelect={(start: Date, end: Date) => {
              onFilterChange({ type: 'date', value: { start, end } })
              onPageChange(1)
            }}
            resetTrigger={resetTrigger}
          />
        </Box>
        <Box sx={{ flex: 1, maxWidth: '15%', paddingLeft: 3 }}>
          <FilterResetButton onReset={handleResetFilters} disabled={isResetDisabled} />
        </Box>
      </Box>

      <Box
        sx={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          alignItems: 'flex-start',
          gap: 3,
        }}
      >
        <CustomTable
          columns={columns}
          data={tableData}
          onRowClick={handleRowClick}
          showSummary={{
            total,
            page,
            totalPages,
            limit,
            onPageChange,
          }}
          dataType="devices"
        />
      </Box>
    </Box>
  )
}

export default DevicesList
