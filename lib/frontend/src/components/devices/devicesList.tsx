import React, { useState } from 'react'
import { Box, useMediaQuery } from '@mui/material'
import { CustomButton } from '../designComponent/Button'
import { colors } from '../../styles/theme'
import CustomTypography from '../designComponent/Typography'
import { useTranslation } from 'react-i18next'
import { Device } from '@model'
import CustomTable from '../designComponent/CustomTable'
import StatusTag from '../designComponent/Status'
import { useNavigate } from 'react-router-dom'
import CustomSearchSelect from '../designComponent/CustomSearchSelect'
import FilterResetButton from '../designComponent/FilterResetButton'

interface DevicesListProps {
  devices: Device.Model[]
  total: number
  page: number
  limit: number
  onPageChange: (page: number) => void
  onFilterChange: (filter: unknown) => void
}

const DevicesList: React.FC<DevicesListProps> = ({ devices, total, page, limit, onPageChange, onFilterChange }) => {
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
    { label: t('deviceNumber'), key: 'device_number' },
    { label: t('mehalchaNumber'), key: 'mehalcha_number' },
    { label: t('openingDate'), key: 'opening_date' },
    { label: t('purchaseDate'), key: 'purchase_date' },
    { label: '', key: 'status' },
  ]

  const tableData = (devices ?? []).map((device) => ({
    device_id: device.device_id,
    device_number: device.device_number,
    mehalcha_number: device.mehalcha_number,
    opening_date: '-', // TODO: Add opening_date field to device model
    purchase_date: '-', // TODO: Add purchase_date field to device model
    status:
      device.status === 'active' ? (
        <StatusTag status='active' />
      ) : (
        <StatusTag status='inactive' />
      ),
  }))

  const onClickDevice = (device: unknown) => {
    navigate(`/device/card/${device.device_id}`)
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
      {showAddDevice ? (
        <Box>
          {/* TODO: Create AddDevice component or use deviceForm */}
          <CustomTypography text={t('addingNewDevice')} variant='h2' weight='bold' color={colors.c11} />
        </Box>
      ) : (
        <>
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
              color={colors.c11}
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
              <FilterResetButton onReset={handleResetFilters} />
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
              onRowClick={onClickDevice}
              showSummary={{
                total,
                page,
                totalPages,
                limit,
                onPageChange,
              }}
              alignLastColumnLeft={true}
            />
          </Box>
        </>
      )}
    </Box>
  )
}

export default DevicesList
