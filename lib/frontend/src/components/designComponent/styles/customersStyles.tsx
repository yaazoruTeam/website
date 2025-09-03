import { styled, Box } from '@mui/material'
import { FlexRow, FlexRowSpaceBetween, FlexColumn } from './baseStyles'

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