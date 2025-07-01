import { MicrophoneIcon, PaperAirplaneIcon } from "@heroicons/react/24/outline";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { FaceSmileIcon } from "@heroicons/react/24/outline";
import React, { useState, useEffect, useRef, useCallback } from "react";
import ReactDOM from "react-dom";
import { colors } from "../../styles/theme";
import { Alert, Box, IconButton, Snackbar, TextField } from "@mui/material";
import CustomTypography from "../designComponent/Typography";
import { Comment } from "../../model";
import { EntityType } from "../../model/src/Comment";
import { CreateCommentDto } from "../../model/src/Dtos";
import {
  getCommentsByEntityTypeAndEntityId,
  createComment,
} from "../../api/comment";
import AudioRecorderInput from "./AudioRecorderInput";
import { formatDateToString } from "../designComponent/FormatDate";
import profilePicture from "../../assets/profilePicture.svg";
import EmojiPicker from "emoji-picker-react";
import { useTranslation } from "react-i18next";

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

const ChatBot: React.FC<ChatBotProps> = ({ entityType, entityId }) => {
  const [comments, setComments] = useState<ClientComment[]>([]);
  const [inputText, setInputText] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [emojiPickerPosition, setEmojiPickerPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isRecordingState, setIsRecordingState] = useState(false);
  const currentTempAudioCommentIdRef = useRef<string | null>(null);

  const { t } = useTranslation()

  const ENTITY_TYPE = entityType;
  const ENTITY_ID = entityId;

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await getCommentsByEntityTypeAndEntityId(
          ENTITY_TYPE,
          ENTITY_ID,
          1
        );
        setComments(response.data);
      } catch (err) {
        console.error("Failed to fetch comments:", err);
        setError(t("FailedToLoadComments.PleaseTryAgainLater."));
      }
    };

    fetchComments();
  }, [ENTITY_TYPE, ENTITY_ID, t]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [comments]);

  useEffect(() => {
    if (showEmojiPicker && inputRef.current) {
      const inputRect = inputRef.current.getBoundingClientRect()
      const pickerHeight = 350
      const pickerWidth = 300
      const margin = 10

      setEmojiPickerPosition({
        top: inputRect.top - pickerHeight - margin,
        left: inputRect.right - pickerWidth,
      })
    } else {
      setEmojiPickerPosition(null)
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target as Node) &&
        !document.getElementById('emoji-portal-root')?.contains(event.target as Node)
      ) {
        setShowEmojiPicker(false)
      }
    }

    if (showEmojiPicker) {
      document.addEventListener('mousedown', handleClickOutside)
    } else {
      document.removeEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showEmojiPicker])

  const sendComment = async () => {
    if (!inputText.trim()) return;

    const tempCommentId = `temp-${Date.now()}`;
    const tempComment: ClientComment = {
      comment_id: tempCommentId,
      entity_type: ENTITY_TYPE,
      entity_id: ENTITY_ID,
      content: inputText,
      created_at: new Date(),
      isAudio: false,
    };

    setComments((prev) => [...prev, tempComment]);
    setInputText("");
    setShowEmojiPicker(false);

    try {
      const commentDataToSend: CreateCommentDto = {
        entity_type: ENTITY_TYPE,
        entity_id: ENTITY_ID,
        content: tempComment.content,
        created_at: tempComment.created_at.toISOString(),
      };

      const sentComment = await createComment(commentDataToSend);

      setComments((prev) =>
        prev.map((c) => (c.comment_id === tempCommentId ? sentComment : c))
      );
    } catch (err) {
      console.error("Error sending comment to server:", err);
      setError(t("FailedToSendComment.PleaseTryAgain."));
      setComments((prev) => prev.filter((c) => c.comment_id !== tempCommentId));
    }
  }

  const handleAudioRecorded = useCallback(
    async (audioBlob: Blob, transcription: string, duration: number) => {
      const tempId = `temp-audio-${Date.now()}`;
      currentTempAudioCommentIdRef.current = tempId;
      const initialContent = isRecordingState
        ? "🔴 מקליט..."
        : "⌛ תמלול בהמתנה...";
      const tempAudioComment: ClientComment = {
        comment_id: tempId,
        entity_type: ENTITY_TYPE,
        entity_id: ENTITY_ID,
        content: initialContent,
        created_at: new Date(),
        isPending: true,
        isAudio: true,
        audioDuration: duration,
        audioUrl: URL.createObjectURL(audioBlob),
      };

      setComments((prev) => [...prev, tempAudioComment]);

      try {
        const finalComment: CreateCommentDto = {
          entity_type: ENTITY_TYPE,
          entity_id: ENTITY_ID,
          content: transcription,
          created_at: new Date().toISOString(),
        };

        const sentComment = await createComment(finalComment);

        setComments((prev) =>
          prev.map((c) =>
            c.comment_id === tempId
              ? {
                  ...sentComment,
                  isAudio: true,
                  audioUrl: tempAudioComment.audioUrl,
                  audioDuration: duration,
                  isPending: false,
                }
              : c
          )
        );
      } catch (err) {
        console.error("Error transcribing/sending audio comment:", err);
        setError(t("FailedToSendAudioComment.PleaseTryAgain."));
        setComments((prev) =>
          prev.filter((c) => String(c.comment_id) !== tempId)
        );
      } finally {
        currentTempAudioCommentIdRef.current = null;
      }
    },
    [ENTITY_TYPE, ENTITY_ID, t]
  );

  const handleRecordingStateChange = useCallback((isRecording: boolean) => {
    setIsRecordingState(isRecording);
    if (isRecording) {
      setInputText("");
    }
  }, []);

  const handleCloseError = () => {
    setError(null);
  };

  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  return (
    <Box
      className='chat-container'
      sx={{
        position: 'relative',
        width: 420,
        margin: '0 auto',
        marginBottom: 50,
        padding: 3,
        paddingTop: 8,
        background: colors.c6,
      }}
    >
      <IconButton
        title={t('closed')}
        disableRipple
        sx={{
          position: 'absolute',
          top: 10,
          left: 10,
          padding: 0,
          backgroundColor: 'transparent',
          '&:hover': { backgroundColor: 'transparent' },
          '&:focus': { backgroundColor: 'transparent' },
          '&:active': { backgroundColor: 'transparent' },
        }}
      >
        <XMarkIcon
          style={{
            color: colors.c8,
            width: 28,
            height: 28,
            paddingLeft: 12,
            paddingTop: 5,
          }}
        />
      </IconButton>
      <Box
        sx={{
          height: 21,
          p: 2.5,
          background: colors.c5,
          borderRadius: 3,
          textAlign: 'center',
        }}
      >
        <CustomTypography
          text={t('customerComments')}
          variant='h2'
          weight='bold'
          color={colors.c11}
        />
      </Box>
      <Box
        className='chat-messages'
        sx={{
          paddingRight: 1,
          paddingLeft: 1,
          paddingBottom: 3,
          overflowY: 'auto',
        }}
      >
        {comments.map((comment) => {
          const date = comment.created_at;

          const formattedDateForDisplay = formatDateToString(date);

          const formattedTime = new Date(date).toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          })

          return (
            <React.Fragment key={comment.comment_id}>
              {/* פס תאריך */}
              <Box
                sx={{
                  width: '100%',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  display: 'inline-flex',
                  margin: '20px 0 10px',
                }}
              >
                <Box
                  sx={{
                    flex: '1 1 0',
                    height: 1.07,
                    opacity: 0.2,
                    background: colors.c38,
                    borderRadius: 10,
                  }}
                />
                <CustomTypography
                  text={formattedDateForDisplay}
                  variant="h5"
                  weight="medium"
                  sx={{
                    width: 167.89,
                    textAlign: 'center',
                    justifyContent: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    color: colors.c38,
                    fontSize: 14,
                    fontFamily: 'Heebo',
                    fontWeight: '400',
                    wordWrap: 'break-word',
                  }}
                />
                <Box
                  sx={{
                    flex: '1 1 0',
                    height: 1.07,
                    opacity: 0.2,
                    background: colors.c38,
                    borderRadius: 10,
                  }}
                />
              </Box>

              {/* בלוק ההודעה עם תמונה בצד ימין */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'flex-start',
                  gap: 1,
                  paddingTop: 2,
                  marginBottom: 2,
                  width: '100%',
                  boxSizing: 'border-box',
                }}
              >
                {/* תמונת פרופיל מימין */}
                <Box
                  component='img'
                  src={profilePicture}
                  alt='profile'
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                  }}
                />

                {/* תוכן ההודעה + שעה מתחת */}
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    flexGrow: 1,
                  }}
                >
                  {comment.isAudio ? (
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        maxWidth: "100%",
                        p: 1.5,
                        borderRadius: 1.5,
                        backgroundColor: colors.c6,
                        border: `1px solid ${colors.c37}`,
                        minWidth: 160,
                        position: "relative",
                      }}
                    >
                      {comment.isAudio && (
                        <MicrophoneIcon
                          style={{
                            width: 20,
                            height: 20,
                            color: colors.c37,
                            flexShrink: 0,
                          }}
                        />
                      )}
                      <CustomTypography
                        text={
                          isRecordingState &&
                          String(comment.comment_id) ===
                            currentTempAudioCommentIdRef.current
                            ? "🔴 מקליט..."
                            : comment.isPending
                            ? "⌛ תמלול בהמתנה..."
                            : comment.content
                        }
                        variant="h4"
                        weight="medium"
                        color={colors.c11}
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
                            color={colors.c37}
                            sx={{
                              wordWrap: "break-word",
                              lineHeight: 1,
                              flexShrink: 0,
                            }}
                          />
                        )}
                    </Box>
                  ) : (
                    <Box
                      sx={{
                        maxWidth: "100%",
                        borderRadius: 1.5,
                        backgroundColor: colors.c6,
                        border: `1px solid ${colors.c37}`,
                        color: colors.c11,
                        textAlign: "right",
                        fontFamily: "Heebo",
                        fontSize: 16,
                        whiteSpace: "pre-wrap",
                        wordWrap: "break-word",
                        direction: "rtl",
                        padding: "10px 14px",
                      }}
                    >
                      {comment.isPending && !comment.isAudio
                        ? `⌛ ${comment.content}`
                        : comment.content}{" "}
                    </Box>
                  )}

                  {/* שעה מתחת להודעה בצד ימין */}
                  <Box
                    sx={{
                      textAlign: "right",
                      justifyContent: "center",
                      display: "flex",
                      flexDirection: "column",
                      color: colors.c38,
                      fontSize: 14,
                      fontFamily: 'Heebo',
                      fontWeight: '400',
                      wordWrap: 'break-word',
                      marginTop: 1,
                    }}
                  >
                    {formattedTime}
                  </Box>
                </Box>
              </Box>
            </React.Fragment>
          )
        })}
        <div ref={messagesEndRef} />
      </Box>
      <Box
        sx={{
          position: 'relative',
          padding: 1,
          background: 'white',
          overflow: 'hidden',
          borderRadius: 0.8,
          outline: `1px ${colors.c39} solid`,
          outlineOffset: '-1px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 1,
          marginTop: 2,
        }}
      >
        <TextField
          ref={inputRef}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={t('WriteComment')}
          variant='standard'
          sx={{
            flex: 1,
            textAlign: 'right',
            background: 'transparent',
            border: 'none',
            fontSize: 18,
            fontFamily: 'Heebo',
            fontWeight: 400,
            color: colors.c10,
            outline: 'none',
            direction: 'rtl',
            '& .MuiInputBase-input::placeholder': {
              color: colors.c10,
              opacity: 1,
            },
            '& .MuiInputBase-root': {
              '&::before': {
                borderBottom: 'none !important',
              },
              '&::after': {
                borderBottom: 'none !important',
              },
              border: 'none',
              outline: 'none',
            },
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") sendComment();
          }}
        />
        {/* אייקון חיוך */}
        <FaceSmileIcon
          style={{
            width: 18,
            height: 18,
            color: colors.c38,
            cursor: 'pointer',
          }}
          title={t('AddingEmoji')}
          onClick={() => setShowEmojiPicker((prev) => !prev)}
        />
        <AudioRecorderInput
          onAudioRecorded={handleAudioRecorded}
          onError={setError}
          onRecordingStateChange={handleRecordingStateChange}
        />
        <IconButton
          onClick={sendComment}
          sx={{
            backgroundColor: colors.c37,
            border: 'none',
            borderRadius: 0.4,
            width: 20,
            height: 20,
            padding: 0,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            '&:hover': {
              backgroundColor: colors.c37,
            },
          }}
          title={t('send')}
        >
          <PaperAirplaneIcon
            style={{
              width: 13,
              height: 13,
              color: 'white',
              cursor: 'pointer',
              transform: 'rotate(-45deg)',
              marginBottom: 1,
              marginLeft: 2,
            }}
            title={t("send")}
          />
        </IconButton>
        {showEmojiPicker &&
          emojiPickerPosition &&
          ReactDOM.createPortal(
            <Box
              sx={{
                position: 'fixed',
                top: emojiPickerPosition.top,
                left: emojiPickerPosition.left,
                zIndex: 9999,
              }}
            >
              <EmojiPicker
                onEmojiClick={(emojiData) => setInputText((prev) => prev + emojiData.emoji)}
              />
            </Box>,
            document.getElementById('emoji-portal-root') as HTMLElement,
          )}
      </Box>
      {/* הודעת שגיאה בתחתית המסך */}
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={handleCloseError}
      >
        <Alert
          onClose={handleCloseError}
          severity="error"
          sx={{ width: "100%" }}
        >
          {error}
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default ChatBot
