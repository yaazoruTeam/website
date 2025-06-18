import { PaperAirplaneIcon } from '@heroicons/react/24/outline'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { FaceSmileIcon } from '@heroicons/react/24/outline'
import { PaperClipIcon } from '@heroicons/react/24/outline'
import React, { useState, useEffect, useRef } from 'react'
import ReactDOM from 'react-dom'
import { colors } from '../../styles/theme'
import { Box, IconButton, TextField } from '@mui/material'
import CustomTypography from '../designComponent/Typography'
import profilePicture from '../../assets/profilePicture.svg'
import EmojiPicker from 'emoji-picker-react'
import { useTranslation } from 'react-i18next'

interface Message {
  text: string
  imageUrl?: string
  timestamp: string
}

const ChatBot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputText, setInputText] = useState('')
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [emojiPickerPosition, setEmojiPickerPosition] = useState<{
    top: number
    left: number
  } | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const { t } = useTranslation()

  useEffect(() => {
    // TODO: כשתהיה לך גישה לשרת - החליפי את הקוד הזה בקריאת axios.get('/api/messages')
    const fakeData: Message[] = [
      {
        text: 'נולום ארווס סאפיאן - פוסיליס קוויס, אקווזמן קוואזי במר מודוף. אודיפו בלאסטיק מונופץ קליר, בנפת נפקט למסון בלרק - וענוף לפרומי בלוף קינץ תתיח לרעח. לת צשחמי ליבם סולגק. בראיט ולחת צורק מונחף, בגורמי מגמש. תרבנך וסתעד לכנו סתשם השמה - לתכי מורגם בורק? לתיג ישבעס.',
        timestamp: new Date().toISOString(),
      },
      {
        text: 'ושבעגט ליבם סולגק. בראיט ולחת צורק מונחף, בגורמי מגמש. תרבנך וסתעד לכנו סתשם השמה - לתכי מורגם בורק? לתיג ישבעס.',
        timestamp: new Date().toISOString(),
      },
    ]

    // הדמיית עיכוב בשרת
    setTimeout(() => {
      setMessages(fakeData)
    }, 500)
  }, [])

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

  const sendMessage = async () => {
    if (!inputText.trim()) return

    const newMessage: Message = {
      text: inputText,
      timestamp: new Date().toISOString(),
    }

    setMessages((prev) => [...prev, newMessage])
    setInputText('')
    setShowEmojiPicker(false)

    // TODO: כשתתחברי לשרת - שלחי את ההודעה לשרת עם axios.post('/api/messages', newMessage)
    try {
      console.log('הודעה נשלחה (סימולציה):', newMessage)
      // await axios.post('/api/messages', newMessage);
    } catch (err) {
      console.error('שגיאה בשליחה לשרת:', err)
    }
  }

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
        {messages.map((msg, i) => {
          const date = new Date(msg.timestamp)

          const formattedDate = `${String(date.getDate()).padStart(
            2,
            '0',
          )}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getFullYear()).slice(2)}`

          const formattedTime = date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
          })

          return (
            <React.Fragment key={i}>
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
                  text={formattedDate}
                  variant='h5'
                  weight='medium'
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
                  <Box
                    sx={{
                      maxWidth: '100%',
                      borderRadius: 1.5,
                      backgroundColor: colors.c6,
                      border: `1px solid ${colors.c37}`,
                      color: colors.c11,
                      textAlign: 'right',
                      fontFamily: 'Heebo',
                      fontSize: 16,
                      whiteSpace: 'pre-wrap',
                      wordWrap: 'break-word',
                      direction: 'rtl',
                      padding: '10px 14px',
                    }}
                  >
                    {msg.imageUrl ? (
                      <Box
                        component='img'
                        src={msg.imageUrl}
                        alt='uploaded'
                        sx={{ maxWidth: '100%', borderRadius: 1.5 }}
                      />
                    ) : (
                      msg.text
                    )}
                  </Box>

                  {/* שעה מתחת להודעה בצד ימין */}
                  <Box
                    sx={{
                      textAlign: 'right',
                      justifyContent: 'center',
                      display: 'flex',
                      flexDirection: 'column',
                      color: '#989BA1',
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
            if (e.key === 'Enter') sendMessage()
          }}
        />
        <input
          type='file'
          id='fileInput'
          accept='image/*'
          style={{ display: 'none' }}
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (!file) return

            if (file.type.startsWith('image/')) {
              const reader = new FileReader()
              reader.onloadend = () => {
                const newMessage: Message = {
                  text: '',
                  imageUrl: reader.result as string,
                  timestamp: new Date().toISOString(),
                }
                setMessages((prev) => [...prev, newMessage])
              }
              reader.readAsDataURL(file)
            } else {
              const newMessage: Message = {
                text: `📎 ${file.name}`,
                timestamp: new Date().toISOString(),
              }
              setMessages((prev) => [...prev, newMessage])
            }

            e.target.value = ''
          }}
        />
        <PaperClipIcon
          style={{
            width: 18,
            height: 18,
            color: colors.c38,
            cursor: 'pointer',
          }}
          title='צרף קובץ'
          onClick={() => {
            document.getElementById('fileInput')?.click()
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
        <IconButton
          onClick={sendMessage}
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
            title={t('send')}
            onClick={() => setShowEmojiPicker((prev) => !prev)}
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
    </Box>
  )
}

export default ChatBot
