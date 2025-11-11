import React, { useState, useEffect } from 'react'
import { Box, Select, MenuItem, Tooltip, Dialog, DialogTitle, DialogContent, DialogActions, CircularProgress, SelectChangeEvent } from '@mui/material'
import { CustomButton } from '../designComponent/Button'
import CustomTypography from '../designComponent/Typography'
import { useTranslation } from 'react-i18next'
import { Samsung } from '@model'
import { getGroups, moveDeviceToGroup } from '../../api/samsung'
import { colors } from '../../styles/theme'
import { InformationCircleIcon } from '@heroicons/react/24/outline'

interface GroupSelectorProps {
  serialNumber: string
  currentGroupId: number
  currentGroupName: string
  onGroupChanged: () => void
}

// קבוצות מותרות להחלפה - רק 4 ו-5
const ALLOWED_GROUP_IDS = [4, 5]

const GroupSelector: React.FC<GroupSelectorProps> = ({ 
  serialNumber, 
  currentGroupId, 
  currentGroupName,
  onGroupChanged 
}) => {
  const { t } = useTranslation()
  const [groups, setGroups] = useState<Samsung.GroupInfo[]>([])
  const [selectedGroupId, setSelectedGroupId] = useState<number>(currentGroupId)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [moving, setMoving] = useState(false)

  // טעינת רשימת הקבוצות
  useEffect(() => {
    const fetchGroups = async () => {
      setLoading(true)
      setError(null)
      try {
        const groupsList = await getGroups()
        const allowedGroups = groupsList.groups.filter(g => 
          ALLOWED_GROUP_IDS.includes(g.groupID)
        )
        setGroups(allowedGroups)
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : t('error')
        setError(errorMessage)
        console.error('Error fetching groups:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchGroups()
  }, [t])

  const handleGroupChange = (event: SelectChangeEvent<number>) => {
    const newGroupId = Number(event.target.value)
    setSelectedGroupId(newGroupId)
    
    if (newGroupId !== currentGroupId) {
      setShowConfirmDialog(true)
    }
  }

  const handleConfirmChange = async () => {
    setMoving(true)
    setError(null)
    
    try {
      await moveDeviceToGroup(serialNumber, selectedGroupId)
      setShowConfirmDialog(false)
      onGroupChanged()
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : t('errorChangingGroup')
      setError(errorMessage)
      console.error('Error changing group:', err)
      setSelectedGroupId(currentGroupId)
    } finally {
      setMoving(false)
    }
  }

  const handleCancelChange = () => {
    setSelectedGroupId(currentGroupId)
    setShowConfirmDialog(false)
  }

  const selectedGroup = groups.find(g => g.groupID === selectedGroupId)

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <CustomTypography
          text={t('currentGroup')}
          variant="h4"
          weight="medium"
          color={colors.blue900}
        />
        <CustomTypography
          text={currentGroupName}
          variant="h4"
          weight="regular"
          color={colors.blue600}
        />
      </Box>

      {error && (
        <Box sx={{ padding: 2, backgroundColor: colors.red100, borderRadius: '8px' }}>
          <CustomTypography
            text={error}
            variant="h4"
            weight="regular"
            color={colors.red500}
          />
        </Box>
      )}

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Box sx={{ flex: 1, maxWidth: '300px' }}>
          <Select
            value={selectedGroupId}
            onChange={handleGroupChange}
            disabled={loading || groups.length === 0}
            fullWidth
            sx={{
              backgroundColor: colors.neutral0,
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: colors.neutral0,
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: colors.blue500,
              },
            }}
          >
            {groups.map((group) => (
              <MenuItem key={group.groupID} value={group.groupID}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
                  <CustomTypography
                    text={group.groupName}
                    variant="h4"
                    weight="regular"
                    color={colors.blue900}
                  />
                  <Tooltip
                    title={
                      <Box sx={{ padding: 1 }}>
                        <CustomTypography
                          text={`${t('groupDescription')}: ${group.description || t('noDescriptionAvailable')}`}
                          variant="h5"
                          weight="regular"
                          color={colors.neutral0}
                        />
                        <CustomTypography
                          text={`${t('groupCapacity')}: ${group.groupCapacity}`}
                          variant="h5"
                          weight="regular"
                          color={colors.neutral0}
                        />
                        <CustomTypography
                          text={`${t('groupCreated')}: ${new Date(group.createTime).toLocaleDateString('he-IL')}`}
                          variant="h5"
                          weight="regular"
                          color={colors.neutral0}
                        />
                      </Box>
                    }
                    arrow
                    placement="right"
                  >
                    <InformationCircleIcon 
                      style={{ 
                        width: 20, 
                        height: 20, 
                        color: colors.blue500,
                        cursor: 'pointer'
                      }} 
                    />
                  </Tooltip>
                </Box>
              </MenuItem>
            ))}
          </Select>
        </Box>

        {loading && <CircularProgress size={24} />}
      </Box>

      <Dialog 
        open={showConfirmDialog} 
        onClose={handleCancelChange}
        PaperProps={{
          sx: {
            borderRadius: '12px',
            padding: 2,
            minWidth: '400px',
          }
        }}
      >
        <DialogTitle>
          <CustomTypography
            text={t('confirmGroupChange')}
            variant="h3"
            weight="bold"
            color={colors.blue900}
          />
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, paddingTop: 2 }}>
            <CustomTypography
              text={`${t('areYouSureChangeGroup')} "${selectedGroup?.groupName}"?`}
              variant="h4"
              weight="regular"
              color={colors.blue700}
            />
            <CustomTypography
              text={t('groupChangeWarning')}
              variant="h5"
              weight="regular"
              color={colors.orange500}
            />
            
            {selectedGroup && (
              <Box 
                sx={{ 
                  padding: 2, 
                  backgroundColor: colors.blueOverlay100, 
                  borderRadius: '8px',
                  marginTop: 1
                }}
              >
                <CustomTypography
                  text={t('groupInfo')}
                  variant="h4"
                  weight="bold"
                  color={colors.blue900}
                  sx={{ marginBottom: 1 }}
                />
                <CustomTypography
                  text={`${t('groupDescription')}: ${selectedGroup.description || t('noDescriptionAvailable')}`}
                  variant="h5"
                  weight="regular"
                  color={colors.blue700}
                />
                <CustomTypography
                  text={`${t('groupCapacity')}: ${selectedGroup.groupCapacity}`}
                  variant="h5"
                  weight="regular"
                  color={colors.blue700}
                />
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ padding: 3, gap: 2 }}>
          <CustomButton
            label={t('cancel')}
            buttonType="third"
            onClick={handleCancelChange}
            disabled={moving}
          />
          <CustomButton
            label={moving ? t('movingDevice') : t('confirm')}
            buttonType="first"
            onClick={handleConfirmChange}
            disabled={moving}
          />
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default GroupSelector
