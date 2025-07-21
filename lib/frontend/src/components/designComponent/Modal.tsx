import { Box, Modal } from '@mui/material'

interface CustomModalProps {
  open: boolean
  onClose: () => void
  children: React.ReactNode
  maxWidth?: number | string
  padding?: number | string
  showBackdropBlur?: boolean
}

const CustomModal: React.FC<CustomModalProps> = ({
  open,
  onClose,
  children,
  maxWidth = 500,
  padding = 5,
  showBackdropBlur = true,
}) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backdropFilter: showBackdropBlur ? 'blur(4px)' : 'none',
      }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth,
          padding,
          background: 'white',
          borderRadius: 3,
          display: 'flex',
          flexDirection: 'column',
          direction: 'rtl',
        }}
      >
        {children}
      </Box>
    </Modal>
  )
}

export default CustomModal
