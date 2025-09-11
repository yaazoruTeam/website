import { Box, styled } from '@mui/material'
import { FlexBase, FlexColumn } from './baseStyles'
import { colors } from '../../../styles/theme'
import { FlexRowSpaceBetween } from './calendarStyles'

// Main container for the entire ChatCommentCard
export const ChatCommentCardContainer = styled(FlexColumn)({
  width: '100%',
  gap: '10px',
  alignItems: 'flex-start',
})

// Main box with gray background
export const ChatCommentCardMainBox = styled(FlexBase)({
  width: '100%',
  paddingLeft: '10px',
  paddingRight: '10px',
  paddingTop: '20px',
  paddingBottom: '20px',
  background: colors.blue10,
  borderRadius: '6px',
  flexDirection: 'column',
  justifyContent: 'flex-start',
  alignItems: 'flex-end',
  gap: '10px',
  minHeight: 'auto',
})

// Inner box container
export const ChatCommentCardInnerBox = styled(FlexRowSpaceBetween)({
  alignSelf: 'stretch',
  alignItems: 'flex-start',
})

// Content section (date and comments)
export const ChatCommentCardContentSection = styled(FlexColumn)({
  flex: '1 1 0',
  minHeight: 'auto',
  justifyContent: 'flex-start',
  alignItems: 'flex-end',
  gap: '10px',
})

// Comment section wrapper
export const ChatCommentCardCommentSection = styled(FlexRowSpaceBetween)({
  alignItems: 'flex-start',
  gap: '40px',
  direction: 'rtl',
})

// Comment box with blue border
export const ChatCommentCardCommentBox = styled(FlexBase)({
//   width: '40%',
  padding: '10px',
  borderRadius: '5px',
  border: `1px solid ${colors.blue300}`,
  justifyContent: 'center',
  alignItems: 'flex-start',
  gap: '10px',
  minHeight: 'auto',
})

// Chat button container
export const ChatCommentCardChatButtonContainer = styled(FlexBase)({
  width: '60px',
  height: '60px',
  flexShrink: 0,
  position: 'relative',
  top: '-40px',
})

// AddCustomerForm ChatBot specific styled components
export const CustomerFormContainer = styled(FlexColumn)({
  width: '100%',
  height: '100%',
  borderRadius: '12px',
  direction: 'rtl',
})

export const CustomerFormInnerContainer = styled(FlexColumn)({
  height: '100%',
  boxShadow: `0 2px 4px ${colors.neutralShadow}`,
  justifyContent: 'flex-end',
})

export const CustomerFormContentBox = styled(FlexColumn)({
  height: '100%',
  padding: '28px',
  backgroundColor: 'background.paper',
  borderRadius: '6px',
  gap: '28px',
})

export const CustomerCommentsSection = styled(Box)({
  width: '100%',
  marginTop: '16px',
})

export const CustomerFormButtonSection = styled(FlexBase)({
  width: '100%',
  justifyContent: 'flex-end',
})

// Chat Modal styled components
export const ChatModalOverlay = styled(FlexBase)({
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: colors.neutralShadow,
  zIndex: 9999,
  justifyContent: 'flex-start',
})

export const ChatModalContainer = styled(FlexColumn)({
  marginTop: '38px',
  marginRight: '-3px',
  backgroundColor: colors.neutral0,
  borderTopLeftRadius: '6px',
  borderBottomLeftRadius: '6px',
  boxShadow: `0 10px 25px ${colors.neutralShadow}`,
})