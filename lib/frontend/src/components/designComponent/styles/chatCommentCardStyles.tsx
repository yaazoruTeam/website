import { styled } from '@mui/material'
import { FlexBase, FlexColumn } from './baseStyles'
import { colors } from '../../../styles/theme'

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
  background: colors.feild,
  borderRadius: '6px',
  flexDirection: 'column',
  justifyContent: 'flex-start',
  alignItems: 'flex-end',
  gap: '10px',
  minHeight: 'auto',
})

// Inner box container
export const ChatCommentCardInnerBox = styled(FlexBase)({
  alignSelf: 'stretch',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  width: '100%',
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
export const ChatCommentCardCommentSection = styled(FlexBase)({
  width: '100%',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  gap: '40px',
  direction: 'rtl',
})

// Comment box with blue border
export const ChatCommentCardCommentBox = styled(FlexBase)({
//   width: '40%',
  padding: '10px',
  borderRadius: '5px',
  border: `1px solid ${colors.c37}`,
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