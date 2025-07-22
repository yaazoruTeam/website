import React, { useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { PaperAirplaneIcon, FaceSmileIcon } from "@heroicons/react/24/outline";
import { Box, IconButton, TextField } from '@mui/material';
import EmojiPicker from "emoji-picker-react";
import { useTranslation } from "react-i18next";
import AudioRecorderInput from './AudioRecorderInput';
import { chatStyles } from './styles';

interface CommentInputProps {
  inputText: string;
  setInputText: (text: string) => void;
  onSendComment: () => void;
  onAudioRecorded: (audioBlob: Blob, transcription: string, duration: number) => void;
  onError: (error: string) => void;
  onRecordingStateChange: (isRecording: boolean) => void;
}

const CommentInput: React.FC<CommentInputProps> = ({
  inputText,
  setInputText,
  onSendComment,
  onAudioRecorded,
  onError,
  onRecordingStateChange,
}) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [emojiPickerPosition, setEmojiPickerPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { t } = useTranslation();

  const handleEmojiClick = () => {
    setShowEmojiPicker((prev) => !prev);
    
    if (!showEmojiPicker && inputRef.current) {
      const inputRect = inputRef.current.getBoundingClientRect();
      const pickerHeight = 350;
      const pickerWidth = 300;
      const margin = 10;

      setEmojiPickerPosition({
        top: inputRect.top - pickerHeight - margin,
        left: inputRect.right - pickerWidth,
      });
    } else {
      setEmojiPickerPosition(null);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      onSendComment();
    }
  };

  return (
    <>
      <Box sx={chatStyles.inputContainer}>
        <TextField
          ref={inputRef}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={t('WriteComment')}
          variant='standard'
          sx={chatStyles.textField}
          onKeyDown={handleKeyDown}
        />
        
        <FaceSmileIcon
          style={chatStyles.emojiIcon}
          title={t('AddingEmoji')}
          onClick={handleEmojiClick}
        />
        
        <AudioRecorderInput
          onAudioRecorded={onAudioRecorded}
          onError={onError}
          onRecordingStateChange={onRecordingStateChange}
        />
        
        <IconButton
          onClick={onSendComment}
          sx={chatStyles.sendButton}
          title={t('send')}
        >
          <PaperAirplaneIcon
            style={chatStyles.sendIcon}
            title={t("send")}
          />
        </IconButton>
      </Box>

      {showEmojiPicker &&
        emojiPickerPosition &&
        ReactDOM.createPortal(
          <Box
            sx={{
              ...chatStyles.emojiPicker,
              top: emojiPickerPosition.top,
              left: emojiPickerPosition.left,
            }}
          >
            <EmojiPicker
              onEmojiClick={(emojiData) => {
                setInputText(inputText + emojiData.emoji);
                setShowEmojiPicker(false);
              }}
            />
          </Box>,
          document.getElementById('emoji-portal-root') as HTMLElement,
        )}
    </>
  );
};

export default CommentInput;
