import React, { useState } from 'react'
import {
  Box,
  Paper,
  Typography,
  Button,
  Alert,
  Card,
  CardContent,
  CardActions,
  Divider,
  Chip,
  CircularProgress,
  LinearProgress
} from '@mui/material'
import { 
  CloudArrowUpIcon, 
  ArrowDownTrayIcon, 
  CheckCircleIcon, 
  ExclamationCircleIcon,
  DocumentTextIcon 
} from '@heroicons/react/24/outline'
import { uploadCustomerDeviceExcel, uploadDeviceExcel, downloadErrorFile } from '../../api/excel'
import { ExcelUploadResponse } from '../../api/excel'
import { useTranslation } from 'react-i18next'

interface UploadState {
  isUploading: boolean
  progress: number
  result: ExcelUploadResponse | null
  error: string | null
}

const ExcelUpload: React.FC = () => {
  const { t } = useTranslation()
  
  const [customerDeviceUpload, setCustomerDeviceUpload] = useState<UploadState>({
    isUploading: false,
    progress: 0,
    result: null,
    error: null
  })

  const [deviceUpload, setDeviceUpload] = useState<UploadState>({
    isUploading: false,
    progress: 0,
    result: null,
    error: null
  })

  const [successMessage, setSuccessMessage] = useState<string>('')
  const [errorMessage, setErrorMessage] = useState<string>('')

  const handleFileUpload = async (
    file: File,
    type: 'customerDevice' | 'device',
    setState: React.Dispatch<React.SetStateAction<UploadState>>
  ) => {
    // Clear previous messages
    setSuccessMessage('')
    setErrorMessage('')

    setState(prev => ({
      ...prev,
      isUploading: true,
      progress: 0,
      result: null,
      error: null
    }))

    try {
      const uploadFunction = type === 'customerDevice' ? uploadCustomerDeviceExcel : uploadDeviceExcel
      
      const result = await uploadFunction(file, (progress) => {
        setState(prev => ({
          ...prev,
          progress
        }))
      })

      setState(prev => ({
        ...prev,
        isUploading: false,
        result
      }))

      if (result.success) {
        setSuccessMessage(t('uploadSuccessful'))
      } else {
        setErrorMessage(t('uploadCompletedWithErrors'))
      }
    } catch (error) {
      console.error('Upload error:', error)
      const errorMsg = error instanceof Error ? error.message : t('uploadFailed')
      
      setState(prev => ({
        ...prev,
        isUploading: false,
        error: errorMsg
      }))
      
      setErrorMessage(errorMsg)
    }
  }

  const handleDownloadErrorFile = async (fileName: string) => {
    try {
      const blob = await downloadErrorFile(fileName)
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = fileName
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
      setSuccessMessage(t('downloadErrorFile'))
    } catch (error) {
      console.error('Error downloading file:', error)
      setErrorMessage(t('errorDownloadingFile'))
    }
  }

  const renderUploadCard = (
    title: string,
    description: string,
    uploadState: UploadState,
    onFileSelect: (file: File) => void,
    acceptedFiles: string = '.xlsx,.xls'
  ) => (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h6" gutterBottom color="primary">
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          {description}
        </Typography>

        {uploadState.isUploading && (
          <Box sx={{ my: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <CircularProgress
                variant="determinate"
                value={uploadState.progress}
                size={24}
                sx={{ mr: 1 }}
              />
              <Typography variant="body2">
                {uploadState.progress}% {t('completed')}
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={uploadState.progress}
              sx={{ borderRadius: 1 }}
            />
          </Box>
        )}

        {uploadState.result && (
          <Alert
            severity={uploadState.result.success ? 'success' : 'warning'}
            sx={{ my: 2 }}
            icon={uploadState.result.success ? <CheckCircleIcon className="h-5 w-5" /> : <ExclamationCircleIcon className="h-5 w-5" />}
          >
            <Typography variant="body2">{uploadState.result.message}</Typography>
            <Box sx={{ mt: 1, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Chip
                label={`${t('totalRows')}: ${uploadState.result.results.totalRows}`}
                size="small"
                variant="outlined"
              />
              <Chip
                label={`${t('successes')}: ${uploadState.result.results.successCount}`}
                size="small"
                color="success"
                variant="outlined"
              />
              {uploadState.result.results.errorsCount > 0 && (
                <Chip
                  label={`${t('errors')}: ${uploadState.result.results.errorsCount}`}
                  size="small"
                  color="error"
                  variant="outlined"
                />
              )}
              <Chip
                label={`${t('successRate')}: ${uploadState.result.results.successRate}`}
                size="small"
                color="info"
                variant="outlined"
              />
            </Box>
          </Alert>
        )}

        {uploadState.error && (
          <Alert severity="error" sx={{ my: 2 }}>
            <Typography variant="body2">{uploadState.error}</Typography>
          </Alert>
        )}
      </CardContent>

      <CardActions sx={{ p: 2, pt: 0 }}>
        <Box sx={{ display: 'flex', gap: 1, width: '100%', flexDirection: 'column' }}>
          <Button
            variant="contained"
            component="label"
            startIcon={<CloudArrowUpIcon className="h-5 w-5" />}
            disabled={uploadState.isUploading}
            fullWidth
          >
            {t('selectExcelFile')}
            <input
              type="file"
              hidden
              accept={acceptedFiles}
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) {
                  onFileSelect(file)
                }
              }}
            />
          </Button>

          {uploadState.result?.errorFile?.generated && uploadState.result.errorFile.fileName && (
            <Button
              variant="outlined"
              startIcon={<ArrowDownTrayIcon className="h-5 w-5" />}
              onClick={() => handleDownloadErrorFile(uploadState.result!.errorFile!.fileName!)}
              fullWidth
            >
              {t('downloadErrorFile')}
            </Button>
          )}
        </Box>
      </CardActions>
    </Card>
  )

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 3 }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h4" gutterBottom color="primary">
            <Box component="span" sx={{ mr: 1, verticalAlign: 'middle', display: 'inline-flex' }}>
              <DocumentTextIcon className="h-6 w-6" />
            </Box>
            {t('excelUpload')}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {t('uploadExcelFiles')}
          </Typography>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
          <Box sx={{ flex: '1 1 400px', minWidth: '400px' }}>
            {renderUploadCard(
              t('customersAndDevices'),
              t('customerDeviceDescription'),
              customerDeviceUpload,
              (file) => handleFileUpload(file, 'customerDevice', setCustomerDeviceUpload)
            )}
          </Box>

          <Box sx={{ flex: '1 1 400px', minWidth: '400px' }}>
            {renderUploadCard(
              t('devicesOnly'),
              t('deviceOnlyDescription'),
              deviceUpload,
              (file) => handleFileUpload(file, 'device', setDeviceUpload)
            )}
          </Box>
        </Box>

        <Box sx={{ mt: 3 }}>
          <Alert severity="info">
            <Typography variant="body2">
              <strong>{t('importantNotes')}:</strong>
              <br />
              • {t('ensureExcelFormat')}
              <br />
              • {t('checkColumnsMatch')}
              <br />
              • {t('errorFileGenerated')}
              <br />
              • {t('uploadMayTakeTime')}
            </Typography>
          </Alert>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Success/Error Messages */}
        {successMessage && (
          <Alert severity="success" sx={{ mb: 2 }}>
            <Typography variant="body2">{successMessage}</Typography>
          </Alert>
        )}

        {errorMessage && (
          <Alert severity="error" sx={{ mb: 2 }}>
            <Typography variant="body2">{errorMessage}</Typography>
          </Alert>
        )}

        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" gutterBottom color="primary">
            📋 {t('requiredFileStructure')}
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
            {/* לקוחות ומכשירים */}
            <Box sx={{ flex: '1 1 400px', minWidth: '400px' }}>
              <Alert severity="success" sx={{ mb: 2 }}>
                <Typography variant="h6" gutterBottom>
                  📊 {t('customerDeviceFile')}
                </Typography>
                <Typography variant="body2" paragraph>
                  <strong>{t('requiredFields')}:</strong>
                </Typography>
                <Box component="ul" sx={{ margin: 0, paddingLeft: 2 }}>
                  <li><code>device_number</code> - {t('deviceNumber')}</li>
                  <li><code>SIM_number</code> - {t('SIM_number')}</li>
                  <li><code>IMEI_1</code> - {t('imeiNumber')}</li>
                  <li><code>serialNumber</code> - {t('serialNumber')}</li>
                  <li><code>model</code> - {t('model')}</li>
                  <li><code>receivedAt</code> - {t('receivedDate')}</li>
                  <li><code>first_name</code> - {t('firstName')}</li>
                  <li><code>last_name</code> - {t('lastName')}</li>
                  <li><code>city</code> - {t('city')}</li>
                  <li><code>address1</code> - {t('address')}</li>
                  <li><code>phone_number</code> - {t('phone')}</li>
                  <li><code>email</code> - {t('email')}</li>
                  <li><code>id_number</code> - {t('idNumber')}</li>
                </Box>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  <strong>{t('optionalFields')}:</strong>
                </Typography>
                <Box component="ul" sx={{ margin: 0, paddingLeft: 2 }}>
                  <li><code>additional_phone</code> - {t('additionalPhone')}</li>
                </Box>
              </Alert>
            </Box>

            {/* מכשירים בלבד */}
            <Box sx={{ flex: '1 1 400px', minWidth: '400px' }}>
              <Alert severity="warning" sx={{ mb: 2 }}>
                <Typography variant="h6" gutterBottom>
                  📱 {t('deviceOnlyFile')}
                </Typography>
                <Typography variant="body2" paragraph>
                  <strong>{t('requiredFields')}:</strong>
                </Typography>
                <Box component="ul" sx={{ margin: 0, paddingLeft: 2 }}>
                  <li><code>device_number</code> - {t('deviceNumber')}</li>
                  <li><code>SIM_number</code> - {t('SIM_number')}</li>
                  <li><code>IMEI_1</code> - {t('imeiNumber')}</li>
                  <li><code>serialNumber</code> - {t('serialNumber')}</li>
                </Box>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  <strong>{t('optionalFields')}:</strong>
                </Typography>
                <Box component="ul" sx={{ margin: 0, paddingLeft: 2 }}>
                  <li><code>model</code> - {t('model')} ({t('recommended')})</li>
                </Box>
              </Alert>
            </Box>
          </Box>

          {/* הנחיות נוספות */}
          <Alert severity="info" sx={{ mt: 2 }}>
            <Typography variant="body2">
              <strong>💡 {t('importantTips')}:</strong>
              <br />
              • {t('columnNamesCaseSensitive')}
              <br />
              • {t('firstRowHeaders')}
              <br />
              • {t('noEmptyRowsAtStart')}
              <br />
              • {t('phoneImeiCanBeNumbers')}
              <br />
              • {t('dateFormats')}
            </Typography>
          </Alert>
        </Box>
      </Paper>
    </Box>
  )
}

export default ExcelUpload
