// React and external libraries
import React, { useState, useEffect, useRef, useCallback } from "react";
import { useTranslation } from "react-i18next";

// Material-UI
import { Alert, Box, IconButton, Snackbar } from "@mui/material";

// Heroicons
import { 
  XMarkIcon 
} from "@heroicons/react/24/outline";

// Internal components
import CustomTypography from "../designComponent/Typography";
import CommentItem from "./CommentItem";
import CommentInput from "./CommentInput";
import DateSeparator from "./DateSeparator";

// Models and types
import { Comment } from "../../model";
import { EntityType } from "../../model/src/Comment";
import { CreateCommentDto } from "../../model/src/CommentDtos";

// API
import {
  getCommentsByEntityTypeAndEntityId,
  createComment,
} from "../../api/comment";

// Styles and assets
import { colors } from "../../styles/theme";
import { chatStyles } from "./styles";

interface ChatBotProps {
  entityType: EntityType;
  entityId: string;
}

interface ClientComment extends Comment.Model {
  isPending?: boolean;
  isAudio?: boolean;
  audioDuration?: number;
  audioUrl?: string;
}

let tempIdCounter = 0;
const generateTempId = (): string => {
  tempIdCounter++;
  return `temp-${Date.now()}-${tempIdCounter}`;
};

const ChatBot: React.FC<ChatBotProps> = ({ entityType, entityId }) => {
  const [comments, setComments] = useState<ClientComment[]>([]);
  const [inputText, setInputText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isRecordingState, setIsRecordingState] = useState(false);
  const [shouldScrollToBottom, setShouldScrollToBottom] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const currentTempAudioCommentIdRef = useRef<string | null>(null);

  const { t } = useTranslation();

  const addCommentsToList = (newComments: ClientComment[], isLoadMore: boolean) => {
    if (isLoadMore) {
      setComments(prev => {
        const existingIds = new Set(prev.map(c => c.comment_id));
        const filtered = newComments.filter(c => !existingIds.has(c.comment_id));
        const allComments = [...filtered, ...prev];
        const sortedComments = allComments.sort((a, b) => 
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
        
        return sortedComments;
      });
    } else {
      const sorted = newComments.sort((a, b) => 
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );
      setComments(sorted);
      setShouldScrollToBottom(true);
    }
  };

  const fetchComments = useCallback(async (page: number, loadMore = false) => {
    try {
      if (loadMore) setIsLoadingMore(true);
      
      const response = await getCommentsByEntityTypeAndEntityId(entityType, entityId, page);
      
      addCommentsToList(response.data, loadMore);
      setHasMore(page < response.totalPages);
    } catch (err) {
      console.error("Failed to fetch comments:", err);
      setError(t("FailedToLoadComments.PleaseTryAgainLater."));
    } finally {
      if (loadMore) setIsLoadingMore(false);
    }
  }, [entityType, entityId, t]);

  const addTempComment = (tempComment: ClientComment) => {
    setComments(prev => {
      if (prev.some(c => String(c.comment_id) === String(tempComment.comment_id))) return prev;
      return [...prev, tempComment];
    });
    setShouldScrollToBottom(true);
  };

  const updateComment = (tempId: string, updatedComment: ClientComment) => {
    setComments(prev => prev.map(c => c.comment_id === tempId ? updatedComment : c));
  };

  const removeComment = (commentId: string) => {
    setComments(prev => prev.filter(c => c.comment_id !== commentId));
  };

  const sendComment = async () => {
    if (!inputText.trim()) return;

    const tempCommentId = generateTempId();
    const tempComment: ClientComment = {
      comment_id: tempCommentId,
      entity_type: entityType,
      entity_id: entityId,
      content: inputText,
      created_at: new Date(),
      isAudio: false,
    };

    addTempComment(tempComment);
    setInputText("");

    try {
      const commentData: CreateCommentDto = {
        entity_type: entityType,
        entity_id: entityId,
        content: tempComment.content,
        created_at: tempComment.created_at.toISOString(),
      };

      const sentComment = await createComment(commentData);
      updateComment(tempCommentId, sentComment);
    } catch (err) {
      console.error("Error sending comment:", err);
      setError(t("FailedToSendComment.PleaseTryAgain."));
      removeComment(tempCommentId);
    }
  };

  const handleAudioRecorded = useCallback(async (audioBlob: Blob, transcription: string, duration: number) => {
    const tempId = generateTempId();
    currentTempAudioCommentIdRef.current = tempId;
    
    const tempAudioComment: ClientComment = {
      comment_id: tempId,
      entity_type: entityType,
      entity_id: entityId,
      content: isRecordingState ? t("recordingInProgress") : t("transcriptionPending"),
      created_at: new Date(),
      isPending: true,
      isAudio: true,
      audioDuration: duration,
      audioUrl: URL.createObjectURL(audioBlob),
    };

    addTempComment(tempAudioComment);

    try {
      const commentData: CreateCommentDto = {
        entity_type: entityType,
        entity_id: entityId,
        content: transcription,
        created_at: new Date().toISOString(),
      };

      const sentComment = await createComment(commentData);
      updateComment(tempId, {
        ...sentComment,
        isAudio: true,
        audioUrl: tempAudioComment.audioUrl,
        audioDuration: duration,
        isPending: false,
      });
    } catch (err) {
      console.error("Error sending audio comment:", err);
      setError(t("FailedToSendAudioComment.PleaseTryAgain."));
      removeComment(tempId);
    } finally {
      currentTempAudioCommentIdRef.current = null;
    }
  }, [entityType, entityId, isRecordingState, t]);

  const handleScroll = useCallback(() => {
    if (!messagesContainerRef.current || isLoadingMore || !hasMore) return;

    const { scrollTop } = messagesContainerRef.current;
    
    if (scrollTop <= 50) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      fetchComments(nextPage, true);
    }
  }, [isLoadingMore, hasMore, currentPage, fetchComments]);

  const handleRecordingStateChange = useCallback((isRecording: boolean) => {
    setIsRecordingState(isRecording);
    if (isRecording) setInputText("");
  }, []);

  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  useEffect(() => {
    fetchComments(1);
  }, [fetchComments]);

  useEffect(() => {
    if (shouldScrollToBottom) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        setShouldScrollToBottom(false);
      }, 100);
    }
  }, [shouldScrollToBottom]);

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return (
    <Box sx={chatStyles.container}>
      <IconButton title={t('closed')} disableRipple sx={chatStyles.closeButton}>
        <XMarkIcon style={chatStyles.closeIcon} />
      </IconButton>
      
      <Box sx={chatStyles.header}>
        <CustomTypography
          text={t('customerComments')}
          variant='h2'
          weight='bold'
          color={colors.c11}
        />
      </Box>
      
      <Box 
        ref={messagesContainerRef} 
        sx={{
          ...chatStyles.messagesContainer,
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          '&::-webkit-scrollbar': { display: 'none' },
        }}
      >
        {isLoadingMore && (
          <Box sx={{ textAlign: 'center', padding: 2 }}>
            <CustomTypography
              text={t('loading')}
              variant='h4'
              weight='regular'
              color={colors.c38}
            />
          </Box>
        )}

        {comments.map((comment, index) => {
          const currentDate = comment.created_at.toDateString();
          const previousDate = index > 0 ? comments[index - 1].created_at.toDateString() : null;
          const showDateSeparator = currentDate !== previousDate;

          return (
            <React.Fragment key={`${comment.comment_id}-${index}`}>
              {showDateSeparator && <DateSeparator date={comment.created_at} />}
              <CommentItem
                comment={comment}
                isRecordingState={isRecordingState}
                currentTempAudioCommentId={currentTempAudioCommentIdRef.current}
                formatDuration={formatDuration}
              />
            </React.Fragment>
          );
        })}
        
        <div ref={messagesEndRef} />
      </Box>
      
      <CommentInput
        inputText={inputText}
        setInputText={setInputText}
        onSendComment={sendComment}
        onAudioRecorded={handleAudioRecorded}
        onError={setError}
        onRecordingStateChange={handleRecordingStateChange}
      />
      
      <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError(null)}>
        <Alert onClose={() => setError(null)} severity="error" sx={{ width: "100%" }}>
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ChatBot
