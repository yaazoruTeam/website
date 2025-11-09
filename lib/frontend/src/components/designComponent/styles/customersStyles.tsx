import { styled, Box, BoxProps, TextField } from '@mui/material'
import { FlexRow, FlexRowSpaceBetween, FlexColumn } from './baseStyles'
import { colors } from '../../../styles/theme'
import { ChevronDownIcon, ChevronLeftIcon } from '@heroicons/react/24/outline'
import { CalendarIcon } from '@mui/x-date-pickers'
import { Customer } from '@model'

// =============
// CustomersList
// =============

// Container כוללת של קומפוננטת CustomersList
export const CustomersListContainer = styled(FlexColumn)({
  width: '100%',
  height: '50%',
  borderRadius: 8,
  justifyContent: 'flex-start',
  alignItems: 'flex-start',
  gap: 32,
})

// כותרת העליונה עם שם העמוד וכפתור הוספה
export const CustomersListHeader = styled(FlexRowSpaceBetween)({
  direction: 'rtl',
  alignItems: 'center',
})

// שורת הפילטרים (חיפוש, סטטוס, תאריך וכו')
export const CustomersListFilters = styled(FlexRow)({
  width: '100%',
  direction: 'rtl',
  marginTop: 16,
  gap: 16,
  justifyContent: 'flex-start',
  flexWrap: 'wrap',
  alignItems: 'center',
})

// תיבת פילטר יחידה
export const CustomersListFilterBox = styled(Box)({
  flex: 1,
  maxWidth: '15%',
  paddingLeft: 24,
})

// Container לטבלה עם הרשימה של הלקוחות
export const CustomersListTable = styled(FlexColumn)({
  width: '100%',
  justifyContent: 'flex-start',
  alignItems: 'flex-start',
  gap: 24,
})

// ==================
// CustomSearchSelect
// ==================

// מיכל הראשי של הסלקט
export const SelectContainer = styled(Box)({
  width: 100,
  height: 100,
  display: 'grid',
  position: 'relative',
  zIndex: 1,
})

// שכבת הסלקט עצמה
export const SelectWrapper = styled(Box)({
  gridArea: '1 / 1',
  width: '100%',
  height: '100%',
})

// סלקט מותאם עם רקע, גבול ו-radius
export const StyledSelect = styled('div')({
  backgroundColor: colors.neutral75,
  border: `1px solid ${colors.blueOverlay700}`,
  width: '200px',
  height: '50px',
  padding: '0 10px',
  display: 'flex',
  alignItems: 'center',
  textAlign: 'right',
  justifyContent: 'flex-end',
  position: 'relative',
  zIndex: 5,
})

// סטייל בסיסי לכל האייקונים
const IconBase = styled('div')({
  width: '16px',
  height: '16px',
  color: colors.blue900,
  position: 'absolute',
  top: 16,
  left: '10px',
})

// כל אייקון "יורש" מהבסיס
export const CustomSearchSelectChevronDownIcon = styled(ChevronDownIcon)(IconBase)
export const CustomSearchSelectChevronLeftIcon = styled(ChevronLeftIcon)(IconBase)
export const CustomSearchSelectCalendarIcon = styled(CalendarIcon)(IconBase)

// ===========
// AddCustomer
// ===========

export const AddCustomerContainer = styled(FlexColumn)({
  width: '100%',
  height: '100%',
  alignItems: 'flex-start',
  gap: '28px',
})

export const HeaderWrapper = styled(FlexRow)({
  alignSelf: 'stretch',
  justifyContent: 'flex-end',
  alignItems: 'flex-start',
  gap: '28px',
  width: '100%',
})

export const TitleWrapper = styled(FlexRow)({
  justifyContent: 'flex-start',
  alignItems: 'center',
  gap: '28px',
  width: '100%',
})

// ===============
// AddCustomerForm
// ===============

// עטיפת כל הטופס
export const FormContainer = styled(Box)<BoxProps>({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  minWidth: '1200px', // רוחב מינימלי קבוע כדי שהטופס לא יתכווץ
  height: '100%',
  borderRadius: 1.5,
  direction: 'rtl',
})

// כרטיס חיצוני
export const OuterCard = styled(FlexColumn)(({ theme }) => ({
  height: '100%',
  minWidth: '1200px', // רוחב מינימלי קבוע
  boxShadow: theme.shadows[1],
  justifyContent: 'flex-end',
}))

// תוכן פנימי
export const InnerContent = styled(FlexColumn)(({ theme }) => ({
  height: '100%',
  minWidth: '1200px', // רוחב מינימלי קבוע
  padding: theme.spacing(3.5),
  backgroundColor: theme.palette.background.paper,
  borderRadius: 0.75,
  gap: theme.spacing(3.5),
}))

// שורות שדות
export const FieldsRow = styled(FlexRow)<{ isMobile?: boolean }>(({ theme, isMobile }) => ({
  justifyContent: 'flex-end',
  gap: theme.spacing(3.5),
  flexWrap: isMobile ? 'wrap' : 'nowrap',
}))

// שורה של כתובת+עיר
export const AddressRow = styled(FlexRow)<{ isMobile?: boolean }>(({ theme, isMobile }) => ({
  width: '100%',
  maxWidth: '66%',
  justifyContent: 'flex-start',
  gap: theme.spacing(3.5),
  flexWrap: isMobile ? 'wrap' : 'nowrap',
}))

// שורת כפתור שמירה
export const ActionsRow = styled(FlexRow)(() => ({
  width: '100%',
  justifyContent: 'flex-end',
}))

// ================
// CustomerSelector
// ================

// עוטף ראשי של כל הקומפוננטה
export const CustomerSelectorSelectorContainer = styled(FlexColumn)(({ theme }) => ({
  width: '100%',
  height: '100%',
  padding: theme.spacing(3.5),
  backgroundColor: colors.neutral0,
  borderRadius: theme.shape.borderRadius,
  justifyContent: 'flex-start',
  alignItems: 'flex-end',
  gap: theme.spacing(3.5),
  direction: 'rtl',
}))

// עוטף עליון של הכותרת + השדות
export const CustomerSelectorHeaderSection = styled(FlexColumn)({
  width: '100%',
  direction: 'rtl',
})

// Box ל-noOptionsText
export const NoOptionsContainer = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
}))

// TextField מותאם ל-autocomplete
export const CustomerAutocompleteInput = styled(TextField)(() => ({
  borderRadius: '6px',
  background: colors.blue10,
  alignSelf: 'stretch',
  height: '44px',
  width: '100%',
  '& .MuiInputBase-root': {
    height: '44px',
    display: 'flex',
    alignItems: 'center',
    paddingRight: '12px',
    paddingLeft: '12px',
  },
  '& input': {
    textAlign: 'right',
    direction: 'rtl',
    padding: 0,
  },
  '@media (max-width: 600px)': {
    width: '100%',
    padding: '8px',
    gap: '8px',
  },
  '@media (min-width: 600px)': {
    width: '100%',
    padding: '10px',
  },
}))

// שורה של האוטוקומפליט + טלפונים + מייל
export const CustomerSelectorFieldsRow = styled(FlexRow)(({ theme }) => ({
  width: '100%',
  alignSelf: 'stretch',
  justifyContent: 'flex-end',
  alignItems: 'flex-start',
  gap: theme.spacing(3.5),
  display: 'inline-flex',
}))

// Box ראשון – עם justifyContent: 'flex-end' + display: 'flex'
export const CustomerSelectorBoxEndFlex = styled(FlexColumn)(() => ({
  width: 393.33,
  height: 83,
  alignItems: 'flex-end',
  gap: 1,
  justifyContent: 'flex-end',
  textAlign: 'right',
  direction: 'rtl',
}))

// Box שני – עם justifyContent: 'center' + display: 'inline-flex' + visibility דינמי
export const CustomerSelectorBoxCenter = styled(Box)<{ selectedCustomer: Customer.Model | null }>(({ selectedCustomer }) => ({
  width: 393.33,
  height: 90,
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'flex-end',
  gap: 1,
  display: 'inline-flex',
  visibility: selectedCustomer ? 'visible' : 'hidden',
}))

// מודל הוספת לקוח
export const CustomerSelectorModalContent = styled(Box)<{ isMobile: boolean }>(({ theme, isMobile }) => ({
  width: isMobile ? '100%' : 400,
  backgroundColor: '#fff',
  borderRadius: 2,
  padding: theme.spacing(3),
  direction: 'rtl',
}))
