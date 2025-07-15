import { colors } from "../../styles/theme";

export const chatStyles = {
  container: {
    position: 'relative' as const,
    width: 420,
    margin: '0 auto',
    marginBottom: 50,
    padding: 3,
    paddingTop: 8,
    background: colors.c6,
  },
  
  closeButton: {
    position: 'absolute' as const,
    top: 10,
    left: 10,
    padding: 0,
    backgroundColor: 'transparent',
    '&:hover': { backgroundColor: 'transparent' },
    '&:focus': { backgroundColor: 'transparent' },
    '&:active': { backgroundColor: 'transparent' },
  },
  
  closeIcon: {
    color: colors.c8,
    width: 28,
    height: 28,
    paddingLeft: 12,
    paddingTop: 5,
  },
  
  header: {
    height: 21,
    p: 2.5,
    background: colors.c5,
    borderRadius: 3,
    textAlign: 'center' as const,
  },
  
  messagesContainer: {
    paddingRight: 1,
    paddingLeft: 1,
    paddingBottom: 3,
    overflowY: 'scroll' as const,
    maxHeight: 400,
    height: 400,
    minHeight: 400,
    display: 'flex',
    flexDirection: 'column' as const,
    scrollbarWidth: 'none' as const,
    msOverflowStyle: 'none' as const,
    '&::-webkit-scrollbar': {
      display: 'none',
    },
  },
  
  inputContainer: {
    position: 'relative' as const,
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
  },
  
  textField: {
    flex: 1,
    textAlign: 'right' as const,
    background: 'transparent',
    border: 'none',
    fontSize: 18,
    fontFamily: 'Heebo',
    fontWeight: 400,
    color: colors.c10,
    outline: 'none',
    direction: 'rtl' as const,
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
  },
  
  emojiIcon: {
    width: 18,
    height: 18,
    color: colors.c38,
    cursor: 'pointer',
  },
  
  sendButton: {
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
  },
  
  sendIcon: {
    width: 13,
    height: 13,
    color: 'white',
    cursor: 'pointer',
    transform: 'rotate(-45deg)',
    marginBottom: 1,
    marginLeft: 2,
  },
  
  emojiPicker: {
    position: 'fixed' as const,
    zIndex: 9999,
  },
};

export const commentStyles = {
  messageBlock: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    gap: 1,
    paddingTop: 2,
    marginBottom: 2,
    width: '100%',
    boxSizing: 'border-box' as const,
  },
  
  profileImage: {
    width: 32,
    height: 32,
    borderRadius: '50%',
  },
  
  messageContent: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'flex-start',
    flexGrow: 1,
  },
  
  audioMessage: {
    display: "flex",
    alignItems: "center",
    gap: 1,
    maxWidth: "100%",
    p: 1.5,
    borderRadius: 1.5,
    backgroundColor: colors.c6,
    border: `1px solid ${colors.c37}`,
    minWidth: 160,
    position: "relative" as const,
  },
  
  microphoneIcon: {
    width: 20,
    height: 20,
    color: colors.c37,
    flexShrink: 0,
  },
  
  textMessage: {
    maxWidth: "100%",
    borderRadius: 1.5,
    backgroundColor: colors.c6,
    border: `1px solid ${colors.c37}`,
    color: colors.c11,
    textAlign: "right" as const,
    fontFamily: "Heebo",
    fontSize: 16,
    whiteSpace: "pre-wrap" as const,
    wordWrap: "break-word" as const,
    direction: "rtl" as const,
    padding: "10px 14px",
  },
  
  timeStamp: {
    textAlign: "right" as const,
    justifyContent: "center",
    display: "flex",
    flexDirection: "column" as const,
    color: colors.c38,
    fontSize: 14,
    fontFamily: 'Heebo',
    fontWeight: '400',
    wordWrap: 'break-word' as const,
    marginTop: 1,
  },
};

export const dateSeparatorStyles = {
  container: {
    width: '100%',
    justifyContent: 'flex-start',
    alignItems: 'center',
    display: 'inline-flex',
    margin: '20px 0 10px',
  },
  
  line: {
    flex: '1 1 0',
    height: 1.07,
    opacity: 0.2,
    background: colors.c38,
    borderRadius: 10,
  },
  
  dateText: {
    width: 167.89,
    textAlign: 'center' as const,
    justifyContent: 'center',
    display: 'flex',
    flexDirection: 'column' as const,
    color: colors.c38,
    fontSize: 14,
    fontFamily: 'Heebo',
    fontWeight: '400',
    wordWrap: 'break-word' as const,
  },
};
