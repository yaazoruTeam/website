import { styled, Box, BoxProps } from '@mui/material'
import { FlexRow, FlexRowSpaceBetween, FlexColumn } from './baseStyles'
import { colors } from '../../../styles/theme'
import { ChevronDownIcon, ChevronLeftIcon } from '@heroicons/react/24/outline'
import { CalendarIcon } from '@mui/x-date-pickers'

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
  backgroundColor: colors.c15,
  border: `1px solid ${colors.c22}`,
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
  color: colors.c11,
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
  height: '100%',
  borderRadius: 1.5,
  direction: 'rtl',
})

// כרטיס חיצוני
export const OuterCard = styled(FlexColumn)(({ theme }) => ({
  height: '100%',
  boxShadow: theme.shadows[1],
  justifyContent: 'flex-end',
}))

// תוכן פנימי
export const InnerContent = styled(FlexColumn)(({ theme }) => ({
  height: '100%',
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