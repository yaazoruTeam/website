import React from 'react';
import { MicrophoneIcon } from "@heroicons/react/24/outline";
import { Box } from '@mui/material';
import CustomTypography from '../designComponent/Typography';
import { colors } from '../../styles/theme';
import profilePicture from '../../assets/profilePicture.svg';
import { commentStyles } from './styles';
import { Comment } from '@model';

interface ClientComment extends Comment.Model {
  isPending?: boolean;
  isAudio?: boolean;
  audioDuration?: number;
  audioUrl?: string;
}

interface CommentItemProps {
  comment: ClientComment;
  isRecordingState: boolean;
  currentTempAudioCommentId: string | null;
  formatDuration: (seconds: number) => string;
}

const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  isRecordingState,
  currentTempAudioCommentId,
  formatDuration,
}) => {
  const formattedTime = comment.created_at.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  return (
    <Box sx={commentStyles.messageBlock}>
      {/* תמונת פרופיל */}
      <Box
        component='img'
        src={profilePicture}
        alt='profile'
        sx={commentStyles.profileImage}
      />

      {/* תוכן ההודעה + שעה */}
      <Box sx={commentStyles.messageContent}>
        {comment.isAudio ? (
          <Box sx={commentStyles.audioMessage}>
            <MicrophoneIcon style={commentStyles.microphoneIcon} />
            <CustomTypography
              text={
                isRecordingState && comment.comment_id === currentTempAudioCommentId
                  ? "🔴 מקליט..."
                  : comment.isPending
                  ? "⌛ תמלול בהמתנה..."
                  : comment.content
              }
              variant="h4"
              weight="medium"
              color={colors.blue900}
              sx={{
                wordWrap: "break-word",
                flexGrow: 1,
              }}
            />
            {comment.audioDuration !== undefined &&
              (isRecordingState || !comment.isPending) && (
                <CustomTypography
                  text={formatDuration(comment.audioDuration)}
                  variant="h4"
                  weight="regular"
                  color={colors.blue300}
                  sx={{
                    wordWrap: "break-word",
                    lineHeight: 1,
                    flexShrink: 0,
                  }}
                />
              )}
          </Box>
        ) : (
          <Box sx={commentStyles.textMessage}>
            {comment.isPending && !comment.isAudio
              ? `⌛ ${comment.content}`
              : comment.content}
          </Box>
        )}

        {/* שעה */}
        <Box sx={commentStyles.timeStamp}>
          {formattedTime}
        </Box>
      </Box>
    </Box>
  );
};

export default CommentItem;
