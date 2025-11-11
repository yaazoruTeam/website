import { Box } from "@mui/material"
import CustomTypography from "../designComponent/Typography"
import { useTranslation } from "react-i18next"
import { CustomButton } from "../designComponent/Button"
import { colors } from "../../styles/theme"
import { useEffect, useState, useCallback } from "react"
import { getDeviceInfo, syncDevice } from "../../api/samsung"
import { Samsung } from "@model"
import MapLocationModal from "../Map/MapLocationModal"
import { MapPinIcon } from "@heroicons/react/24/outline"

// Component for displaying a single info field
const InfoField = ({ label, value }: { label: string; value: string | number | undefined }) => (
  <CustomTypography
    text={`${label}: ${value ?? "-"}`}
    variant="h4"
    weight="regular"
    color={colors.blue600}
  />
)

const BYTES_TO_GB_DIVISOR = 100_000_000;
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
  const [isMapModalOpen, setIsMapModalOpen] = useState(false)

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
      await fetchDeviceInfo()
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : t("errorSyncingDevice")
      setError(errorMessage)
      console.error("Error syncing device:", err)
    } finally {
      setSyncing(false)
    }
  }, [serialNumber, fetchDeviceInfo, t])

  const getDeviceLocation = (): { lat: number; lng: number } | null => {
    if (!deviceInfo?.locationLat || !deviceInfo?.locationLon) {
      console.warn('Device location data is missing')
      return null
    }

    const lat = parseFloat(deviceInfo.locationLat)
    const lng = parseFloat(deviceInfo.locationLon)

    if (isNaN(lat) || isNaN(lng)) {
      console.error('Invalid location coordinates:', { lat: deviceInfo.locationLat, lng: deviceInfo.locationLon })
      return null
    }

    if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      console.error('Location coordinates out of valid range:', { lat, lng })
      return null
    }

    return { lat, lng }
  }
  const handleLocationClick = () => {
    const location = getDeviceLocation()

    if (!location) {
      setError(t('locationDataNotAvailable'))
      return
    }

    console.log('📍 Opening map with device location:', location)
    setIsMapModalOpen(true)
  }

  useEffect(() => {
    fetchDeviceInfo()
  }, [serialNumber, fetchDeviceInfo])
  const deviceLocation = getDeviceLocation() || { lat: 32.0853, lng: 34.7818 }

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
          {/* <CustomButton
            label={t("deviceRinging")}
            buttonType="third"
            sx={{ backgroundColor: colors.blue100 }}
          /> */}
          <CustomButton
            label={t("refreshDevice")}
            buttonType="third"
            onClick={handleDeviceRefresh}
            disabled={syncing}
          />
          <CustomButton
            label={t("refreshData")}
            buttonType="second"
            onClick={fetchDeviceInfo}
            disabled={loading}
          />
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

          <InfoField label={t("lastConnected")} value={new Date(deviceInfo.lastConnected).toLocaleString('he-IL')} />
          <InfoField label={t("registeredOn")} value={new Date(deviceInfo.registeredOn).toLocaleString('he-IL')} />
          <InfoField label={t("deviceStatus")} value={deviceInfo.deviceStatus} />

          <InfoField label={t("simCurrent")} value={deviceInfo.currentSim} />
          <InfoField label={t("networkID")} value={deviceInfo.networkID} />
          <InfoField label={t("absorptionLevel")} value={deviceInfo.cellularStrength} />
          <InfoField label={t("IMEI_1")} value={deviceInfo.imei1} />
          <InfoField label={t("IMEI_2")} value={deviceInfo.imei2} />

          <InfoField label={t("battery")} value={`${deviceInfo.batteryLevel} %`} />
          <InfoField label={t("storageAvailable")} value={`${(Math.trunc(parseFloat(deviceInfo.availableStorage)/BYTES_TO_GB_DIVISOR))/10} GB`} />

          {/* Location Section with Map Button */}
          <InfoSection title={t("locationInfo")}>
            <InfoField
              label={t("lastLocationUpdate")}
              value={deviceInfo.locationTimeStamp
                ? new Date(deviceInfo.locationTimeStamp).toLocaleString('he-IL')
                : t("notAvailable")
              }
            />

            {/* כפתור מיקום במפה */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                mt: 1,
                cursor: getDeviceLocation() ? 'pointer' : 'not-allowed',
                padding: '12px 16px',
                borderRadius: '8px',
                backgroundColor: getDeviceLocation() ? colors.blueOverlay200 : colors.neutral200,
                transition: 'all 0.2s',
                opacity: getDeviceLocation() ? 1 : 0.5,
                '&:hover': getDeviceLocation() ? {
                  backgroundColor: colors.blueOverlay100,
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                } : {}
              }}
              onClick={handleLocationClick}
            >
              <MapPinIcon style={{ width: 24, height: 24, color: colors.blue900 }} />
              <CustomTypography
                text={t("viewOnMap")}
                variant="h4"
                weight="medium"
                color={colors.blue900}
              />
            </Box>
          </InfoSection>

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

      {/* Modal עם המפה */}
      <MapLocationModal
        open={isMapModalOpen}
        onClose={() => setIsMapModalOpen(false)}
        lat={deviceLocation.lat}
        lng={deviceLocation.lng}
        title={`${t("deviceLocation")} - ${serialNumber}`}
      />
    </Box>
  )
}

export default SamsungDetails