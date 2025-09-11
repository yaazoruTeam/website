import React, { useState, useEffect, useRef } from "react";
import { MicrophoneIcon } from "@heroicons/react/24/outline";
import { IconButton } from "@mui/material";
import CustomTypography from "../designComponent/Typography";
import { colors } from "../../styles/theme";
import { transcribeAudio } from "../../api/comment";
import { useTranslation } from "react-i18next";

interface AudioRecorderInputProps {
  onAudioRecorded: (
    audioBlob: Blob,
    transcription: string,
    duration: number
  ) => void;
  onError: (message: string) => void;
  onRecordingStateChange: (isRecording: boolean) => void;
}

const AudioRecorderInput: React.FC<AudioRecorderInputProps> = ({
  onAudioRecorded,
  onError,
  onRecordingStateChange,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingStartTimeRef = useRef<number>(0);
  const [currentRecordingDuration, setCurrentRecordingDuration] = useState<number>(0);

  const { t } = useTranslation();

  useEffect(() => {
    let timer: NodeJS.Timeout | undefined;

    if (isRecording) {
      recordingStartTimeRef.current = Date.now();
      timer = setInterval(() => {
        setCurrentRecordingDuration(
          Math.floor((Date.now() - recordingStartTimeRef.current) / 1000)
        );
      }, 1000);
    } else {
      if (timer) {
        clearInterval(timer);
      }
      setCurrentRecordingDuration(0);
    }

    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [isRecording]);

  const toggleRecording = async () => {
    if (isRecording) {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
        mediaRecorderRef.current.stop();
      }
      setIsRecording(false);
      onRecordingStateChange(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        audioChunksRef.current = [];

        mediaRecorder.ondataavailable = (event) => {
          audioChunksRef.current.push(event.data);
        };

        mediaRecorder.onstop = async () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
          const finalDuration = Math.floor((Date.now() - recordingStartTimeRef.current) / 1000);

          try {
            const transcription = await transcribeAudio(audioBlob);
            onAudioRecorded(audioBlob, transcription, finalDuration);
          } catch (err) {
            console.error("שגיאה בתמלול", err);
            onError(t("ErrorTranscribingRecording.PleaseTryAgain."));
          } finally {
            stream.getTracks().forEach((track) => track.stop());
          }
        };
        

        mediaRecorderRef.current = mediaRecorder;
        mediaRecorder.start();
        setIsRecording(true);
        onRecordingStateChange(true);
      } catch (err) {
        console.error("שגיאה בהקלטה", err);
        onError(t("CouldNotStartRecording.CheckMicrophonePermissions."));
        setIsRecording(false);
        onRecordingStateChange(false);
      }
    }
  };

  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  return (
    <IconButton
      onClick={toggleRecording}
      sx={{
        backgroundColor: "transparent",
        border: "none",
        width: 32,
        height: 32,
        padding: 0,
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        "&:hover": {
          backgroundColor: "transparent",
        },
      }}
      title={isRecording ? t("stopRecording") : t("record")}
    >
      <MicrophoneIcon
        style={{
          width: 18,
          height: 18,
          color: isRecording ? colors.blue300 : colors.neutral350,
          cursor: "pointer",
        }}
      />
      {isRecording && (
        <CustomTypography
          text={formatDuration(currentRecordingDuration)}
          variant="h4"
          weight="regular"
          color={colors.blue300}
          sx={{ marginLeft: 0.5 }}
        />
      )}
    </IconButton>
  );
};

export default AudioRecorderInput;