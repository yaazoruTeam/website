import { Box } from '@mui/material'
import { useEffect, useState } from 'react'
import { getWidelyDetails } from '../../api/widely'
import { WidelyDeviceDetails } from '../../model'

const WidelyDetails = ({ simNumber }: { simNumber: string }) => {
  const [widelyDetails, setWidelyDetails] = useState<WidelyDeviceDetails.Model | null>(null)

  useEffect(() => {
    const fetchWidelyDetails = async () => {
      const details: WidelyDeviceDetails.Model = await getWidelyDetails(simNumber)
      setWidelyDetails(details)
    }
    fetchWidelyDetails()
  }, [simNumber])

  return (
    <>
      <Box>{widelyDetails?.iccid}</Box>
    </>
  )
}

export default WidelyDetails
