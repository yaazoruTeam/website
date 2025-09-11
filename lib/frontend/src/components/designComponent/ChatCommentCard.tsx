import React from 'react'
import { colors } from '../../styles/theme'
import CustomTypography from './Typography'
import {
  ChatCommentCardContainer,
  ChatCommentCardMainBox,
  ChatCommentCardInnerBox,
  ChatCommentCardContentSection,
  ChatCommentCardCommentSection,
  ChatCommentCardCommentBox,
  ChatCommentCardChatButtonContainer
} from './styles/chatCommentCardStyles'

interface ChatCommentCardProps {
  customerName?: string
  commentsType: string
  lastCommentDate: string
  lastComment: string
  chatButton?: React.ReactNode
}

const ChatCommentCard: React.FC<ChatCommentCardProps> = ({
  commentsType,
  lastCommentDate,
  lastComment,
  chatButton,
}) => {
  return (
    <ChatCommentCardContainer>
      <CustomTypography
        text={commentsType}
        variant='h3'
        weight='medium'
        color={colors.blueOverlay650}
        sx={{
          textAlign: 'right',
          wordWrap: 'break-word',
        }}
      />
      <ChatCommentCardMainBox>
        <ChatCommentCardInnerBox>
          <ChatCommentCardContentSection>
            {/* Date */}
            <CustomTypography
              text={lastCommentDate}
              variant='h3'
              weight='regular'
              color={colors.blueOverlay650}
              sx={{
                textAlign: 'flex-start',
                wordWrap: 'break-word',
                width: '100%',
              }}
            />
            <ChatCommentCardCommentSection>
              <ChatCommentCardCommentBox>
                <CustomTypography
                  text={lastComment}
                  variant='h3'
                  weight='regular'
                  color={colors.neutral700}
                  sx={{
                    flex: '1 1 0',
                    textAlign: 'right',
                    wordWrap: 'break-word',
                    whiteSpace: 'pre-wrap',
                    overflowWrap: 'break-word',
                  }}
                />
              </ChatCommentCardCommentBox>

              {chatButton && (
                <ChatCommentCardChatButtonContainer>
                  {chatButton}
                </ChatCommentCardChatButtonContainer>
              )}
            </ChatCommentCardCommentSection>
          </ChatCommentCardContentSection>
        </ChatCommentCardInnerBox>
      </ChatCommentCardMainBox>
    </ChatCommentCardContainer>
  )
}

export default ChatCommentCard
