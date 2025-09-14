import React from 'react'
import { Box } from '@mui/material'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { colors } from '../../styles/theme'
import CustomTypography from './Typography'
import { useTranslation } from 'react-i18next'

/**
 * סוגי הנתונים הנתמכים בקומפוננטה
 */
export type DataType = 
  | 'customers'      // לקוחות
  | 'devices'        // מכשירים
  | 'branches'       // סניפים
  | 'comments'       // הערות
  | 'general'        // כללי

/**
 * סוגי ההודעות הנתמכים
 */
export type MessageType = 
  | 'date'           // לא נמצא בטווח תאריכים
  | 'status'         // לא נמצא עם סטטוס מסוים
  | 'search'         // לא נמצא בחיפוש
  | 'filter'         // לא נמצא עם פילטר
  | 'general'        // הודעה כללית

export interface NoDataMessageProps {
  /** סוג הנתונים שאין להצגה */
  dataType: DataType
  /** סוג ההודעה */
  messageType?: MessageType
  /** פונקציה לסגירת ההודעה */
  onClose?: () => void
  /** האם להציג כפתור סגירה */
  showCloseButton?: boolean
  /** הודעה מותאמת אישית (אופציונלית) */
  customMessage?: string
  /** אייקון מותאם אישית (אופציונלית) */
  customIcon?: string
  /** גובה מינימלי של הקומפוננטה */
  minHeight?: string | number
  /** מצב קומפקטי עבור שימוש בטבלות */
  compact?: boolean
}

/**
 * קומפוננטה גנרית להצגת הודעה כאשר אין נתונים להצגה
 * 
 * @example
 * ```tsx
 * // שימוש בסיסי
 * <NoDataMessage dataType="customers" />
 * 
 * // עם סוג הודעה ספציפי
 * <NoDataMessage 
 *   dataType="devices" 
 *   messageType="date" 
 *   onClose={() => console.log('closed')}
 * />
 * 
 * // עם הודעה מותאמת
 * <NoDataMessage 
 *   dataType="branches" 
 *   customMessage="לא נמצאו סניפים באזור הנבחר"
 * />
 * ```
 */
const NoDataMessage: React.FC<NoDataMessageProps> = ({ 
  dataType,
  messageType = 'general',
  onClose,
  showCloseButton = true,
  customMessage,
  customIcon,
  minHeight = '300px',
  compact = false
}) => {
  const { t } = useTranslation()

  /**
   * מחזיר את מפתח התרגום המתאים בהתבסס על סוג הנתונים וסוג ההודעה
   */
  const getTranslationKey = (): string => {
    const baseKey = `no${dataType.charAt(0).toUpperCase() + dataType.slice(1)}Found`
    
    switch (messageType) {
      case 'date':
        return `${baseKey}Date`
      case 'status':
        return `${baseKey}Status`
      case 'search':
        return `${baseKey}Search`
      case 'filter':
        return `${baseKey}Filter`
      default:
        return `${baseKey}General`
    }
  }

  /**
   * מחזיר את האייקון המתאים בהתבסס על סוג הנתונים
   */
  const getIcon = (): string => {
    if (customIcon) return customIcon

    switch (dataType) {
      case 'customers':
        return '👥'
      case 'devices':
        return '📱'
      case 'branches':
        return '🏢'
      case 'comments':
        return '💬'
      default:
        return '🔍'
    }
  }

  const translationKey = getTranslationKey()
  const message = customMessage || t(translationKey)
  const icon = getIcon()

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: '100%',
        minHeight: compact ? '150px' : minHeight,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: compact ? 2 : 3,
        borderRadius: compact ? 2 : 3,
        backgroundColor: colors.neutral0,
        border: compact ? `1px solid ${colors.orange500}` : `2px solid ${colors.orange500}`,
        padding: compact ? 3 : 4,
        position: 'relative',
        boxShadow: compact ? `0 2px 10px ${colors.neutralShadow}` : `0 4px 20px ${colors.neutralShadow}`,
        boxSizing: 'border-box',
      }}
    >
      {/* כפתור סגירה */}
      {showCloseButton && onClose && (
        <Box
          onClick={onClose}
          sx={{
            position: 'absolute',
            top: 16,
            right: 16,
            width: 32,
            height: 32,
            borderRadius: '50%',
            backgroundColor: colors.neutral500,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            '&:hover': {
              backgroundColor: colors.blue600,
              transform: 'scale(1.1)',
            },
          }}
        >
          <XMarkIcon
            style={{
              width: '18px',
              height: '18px',
              color: colors.neutral0,
            }}
          />
        </Box>
      )}

      {/* אייקון ראשי */}
      <Box
        sx={{
          width: compact ? 60 : 80,
          height: compact ? 60 : 80,
          borderRadius: '50%',
          backgroundColor: colors.orange10,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: compact ? 1 : 2,
        }}
      >
        <CustomTypography 
          text={icon} 
          variant={compact ? 'h2' : 'h1'} 
          weight='regular' 
          color={colors.orange500} 
        />
      </Box>

      {/* טקסט ההודעה */}
      <CustomTypography 
        text={message} 
        variant={compact ? 'h3' : 'h2'} 
        weight='bold' 
        color={colors.blue900} 
      />
    </Box>
  )
}

export default NoDataMessage