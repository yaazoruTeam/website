import { Box } from "@mui/material"
import CustomTypography from "../designComponent/Typography"
import { useTranslation } from "react-i18next"
import { CustomButton } from "../designComponent/Button"
import { colors } from "../../styles/theme"
import { useEffect, useState, useCallback } from "react"
import { getDeviceInfo, syncDevice } from "../../api/samsung"
import { Samsung } from "@model"

// Component for displaying a single info field
const InfoField = ({ label, value }: { label: string; value: string | number | undefined }) => (
  <CustomTypography
    text={`${label}: ${value ?? "-"}`}
    variant="h4"
    weight="regular"
    color={colors.blue600}
  />
)

// Component for status fields with visual indicators
const StatusField = ({ label, status }: { label: string; status?: string }) => {
  const getStatusColor = (status?: string) => {
    switch (status) {
      case "Ok":
        return colors.green500
      case "Pending":
        return colors.orange500
      case "Error":
        return colors.red500
      default:
        return colors.blue600
    }
  }

  return (
    <CustomTypography
      text={`${label}: ${status ?? "-"}`}
      variant="h4"
      weight="regular"
      color={getStatusColor(status)}
    />
  )
}

// Section component for grouping related information
const InfoSection = ({ title, children }: { title?: string; children: React.ReactNode }) => (
  <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
    {title && (
      <CustomTypography
        text={title}
        variant="h3"
        weight="medium"
        color={colors.blue900}
        sx={{ marginBottom: 1 }}
      />
    )}
    {children}
  </Box>
)

const SamsungDetails = ({ serialNumber }: { serialNumber: string }) => {
  const { t } = useTranslation()
  const [deviceInfo, setDeviceInfo] = useState<Samsung.DeviceInfo | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [syncing, setSyncing] = useState(false)
  const [syncSuccess, setSyncSuccess] = useState<string | null>(null)

  const fetchDeviceInfo = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const deviceInfoData = await getDeviceInfo(serialNumber)
      setDeviceInfo(deviceInfoData)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error fetching device info"
      setError(errorMessage)
      console.error("Error fetching device info:", err)
    } finally {
      setLoading(false)
    }
  }, [serialNumber])

  const handleDeviceRefresh = useCallback(async () => {
    setSyncing(true)
    setSyncSuccess(null)
    setError(null)
    try {
      await syncDevice(serialNumber, false)
      setSyncSuccess(t("deviceSyncedSuccessfully"))
      // אחרי רענון מוצלח, אנחנו מעדכנים את הנתונים
      await fetchDeviceInfo()
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : t("errorSyncingDevice")
      setError(errorMessage)
      console.error("Error syncing device:", err)
    } finally {
      setSyncing(false)
    }
  }, [serialNumber, fetchDeviceInfo, t])

  useEffect(() => {
    fetchDeviceInfo()
  }, [serialNumber, fetchDeviceInfo])

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
          <CustomButton label={t("refreshDevice")} buttonType="third" onClick={handleDeviceRefresh} disabled={syncing} />
          <CustomButton label={t("refreshData")} buttonType="second" onClick={fetchDeviceInfo} disabled={loading} />
        </Box>
      </Box>

      {error && (
        <Box sx={{ padding: 2, backgroundColor: colors.red100, borderRadius: "8px" }}>
          <CustomTypography
            text={error}
            variant="h4"
            weight="regular"
            color={colors.red500}
          />
        </Box>
      )}

      {syncSuccess && (
        <Box sx={{ padding: 2, backgroundColor: colors.green100, borderRadius: "8px" }}>
          <CustomTypography
            text={syncSuccess}
            variant="h4"
            weight="regular"
            color={colors.green500}
          />
        </Box>
      )}

      {loading ? (
        <Box sx={{ display: "flex", gap: 2, flexDirection: "column" }}>
          <CustomTypography
            text={t("loading")}
            variant="h4"
            weight="regular"
            color={colors.blue600}
          />
        </Box>
      ) : deviceInfo ? (
        <>
          <InfoSection>
            <InfoField label={t("clientVersion")} value={deviceInfo.clientAppVersion} />
            <InfoField label={t("modelDevice")} value={deviceInfo.deviceModel} />
            <InfoField label={t("androidVersion")} value={deviceInfo.androidVer} />
          </InfoSection>
          <InfoField label={t("deviceStatus")} value={deviceInfo.deviceStatus} />


          <InfoField label={t("simCurrent")} value={deviceInfo.currentSim} />
          <InfoField label={t("networkID")} value={deviceInfo.networkID} />
          <InfoField label={t("absorptionLevel")} value={deviceInfo.cellularStrength} />
          <InfoField label={t("IMEI_1")} value={deviceInfo.imei1} />
          <InfoField label={t("IMEI_2")} value={deviceInfo.imei2} />


          <InfoField label={t("battery")} value={deviceInfo.batteryLevel} />
          <InfoField label={t("storageAvailable")} value={deviceInfo.availableStorage} />

          {/* Operation Status Information */}
          <InfoSection title={t("dataStatus")}>
            <StatusField label={t("rebootStatus")} status={deviceInfo.rebootStatus} />
            <StatusField label={t("installAppStatus")} status={deviceInfo.installAppStatus} />
            <StatusField label={t("applyProfileStatus")} status={deviceInfo.applyProfileStatus} />
            <StatusField label={t("caStatus")} status={deviceInfo.caStatus} />
            <StatusField label={t("apnStatus")} status={deviceInfo.apnStatus} />
            <StatusField label={t("domainFilterStatus")} status={deviceInfo.domainFilterStatus} />
          </InfoSection>
        </>
      ) : (
        <CustomTypography
          text={t("noData")}
          variant="h4"
          weight="regular"
          color={colors.blue600}
        />
      )}
    </Box>
  )
}

export default SamsungDetails