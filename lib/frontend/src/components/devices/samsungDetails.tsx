import { Box } from "@mui/material"
import CustomTypography from "../designComponent/Typography"
import { useTranslation } from "react-i18next"
import { CustomButton } from "../designComponent/Button"
import { colors } from "../../styles/theme"
import { useEffect } from "react"
import { getDeviceInfo } from "../../api/samsung"

const SamsungDetails = ({ serialNumber }: { serialNumber: string }) => {
  const { t } = useTranslation()

  useEffect(() => {
    const fetchDeviceInfo = async () => {
      try {        
        const deviceInfo = await getDeviceInfo(serialNumber)
        console.log('Device Info:', deviceInfo)
      } catch (error) {
        console.error('Error fetching device info:', error)
      }
    }
    fetchDeviceInfo()
  }, [serialNumber])

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {/* Header Section */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "16px 20px",
          backgroundColor: colors.neutral75,
          borderRadius: "8px",
        }}
      >
        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <CustomTypography
            text={t("filterData")}
            variant="h3"
            weight="medium"
            color={colors.blue900}
          />
          <CustomTypography
            text={serialNumber}
            variant="h3"
            weight="regular"
            color={colors.blue600}
          />
        </Box>
        <Box sx={{ display: "flex", gap: 2 }}>
          <CustomButton
            label={t("deviceRinging")}
            buttonType="third"
            sx={{ backgroundColor: colors.blue100 }}
          />
          <CustomButton label={t("refreshDevice")} buttonType="third" />
          <CustomButton label={t("refreshData")} buttonType="second" />
        </Box>
      </Box>
    </Box>
  )
}

export default SamsungDetails