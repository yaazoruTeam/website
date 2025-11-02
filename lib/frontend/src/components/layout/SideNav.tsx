import React, { useState } from 'react'
import { Box, Drawer, List, ListItem, IconButton, Tooltip } from '@mui/material'
import { Link } from 'react-router-dom' 

import logoIcon from '../../assets/logoIcon.svg'
import { colors } from '../../styles/theme'
import CustomTypography from '../designComponent/Typography'

interface SideNavProps {
  listItems: Array<{
    iconWhite: string
    iconBlue: string
    link: string
    text: string
  }>
  isOpen: boolean
  onToggle: () => void
}

const COLLAPSED_WIDTH = 80 
const EXPANDED_WIDTH = 200 
const MENU_ITEM_HEIGHT = 66

const MenuIcon = () => (
  <svg 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
)

const SideNav: React.FunctionComponent<SideNavProps> = ({ listItems, isOpen, onToggle }) => {
  const [selectedLink, setSelectedLink] = useState<string>('')
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)

  const handleLinkClick = (link: string) => {
    setSelectedLink(link)
  }

  return (
    <Drawer
      sx={{
        width: isOpen ? EXPANDED_WIDTH : COLLAPSED_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: isOpen ? EXPANDED_WIDTH : COLLAPSED_WIDTH,
          backgroundColor: colors.blue600,
          color: colors.neutral0,
          borderRadius: '22px 0px 0px 22px',
          display: 'flex',
          flexDirection: 'column',
          transition: 'width 0.3s ease-in-out',
          overflow: 'visible',
          zIndex: 1200,
        },
      }}
      variant='permanent'
      anchor='right'
    >
      {/* כפתור פתיחה/סגירה */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '60px',
          padding: '10px',
          borderBottom: `1px solid ${colors.blue500}`,
        }}
      >
        <IconButton
          onClick={onToggle}
          sx={{
            color: colors.neutral0,
            '&:hover': {
              backgroundColor: colors.blue500,
            },
          }}
        >
          <MenuIcon />
        </IconButton>
      </Box>

      {/* לוגו */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100px',
          padding: '10px',
          cursor: 'pointer',
        }}
      >
        <Link 
          to="/dashboard" 
          onClick={() => handleLinkClick('/dashboard')} 
        >
          <img
            src={logoIcon}
            alt='Logo'
            style={{
              width: isOpen ? '67px' : '50px',
              height: isOpen ? '64px' : '48px',
              transition: 'all 0.3s ease-in-out',
            }}
          />
        </Link>
      </Box>

      {/* רשימת פריטי תפריט */}
      <List sx={{ padding: 0, position: 'relative' }}>
        {listItems.map((li, index) => {
          const isSelected = selectedLink === li.link
          const isHovered = hoveredItem === li.link
          const showTooltip = !isOpen && !isHovered

          return (
            <Box
              key={index}
              sx={{
                position: 'relative',
                marginTop: '10px',
              }}
            >
              <Tooltip
                title={showTooltip ? li.text : ''}
                placement="left"
                arrow
              >
                <ListItem
                  component={Link}
                  to={li.link}
                  onClick={() => handleLinkClick(li.link)}
                  onMouseEnter={() => setHoveredItem(li.link)}
                  onMouseLeave={() => setHoveredItem(null)}
                  sx={{
                    color: isSelected ? colors.blue200 : colors.neutral0,
                    textAlign: 'center',
                    flexDirection: isOpen ? 'row' : 'column',
                    alignItems: 'center',
                    justifyContent: isOpen ? 'flex-start' : 'center',
                    gap: isOpen ? 2 : 0.5,
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    minHeight: MENU_ITEM_HEIGHT,
                    paddingLeft: isOpen ? '20px' : '10px',
                    paddingRight: '10px',
                    cursor: 'pointer',
                    backgroundColor: isHovered ? colors.blue500 : 'transparent',
                    borderRadius: isOpen ? '0' : '12px',
                    '&:hover': {
                      backgroundColor: colors.blue500,
                    },
                    // במצב ריחוף - הצגת התפריט המלא מעל האחרים
                    ...(isHovered && !isOpen && {
                      position: 'absolute',
                      top: 0,
                      right: 0,
                      width: EXPANDED_WIDTH,
                      backgroundColor: colors.blue600,
                      borderRadius: '22px 0 0 22px',
                      boxShadow: '-4px 0 15px rgba(0, 0, 0, 0.3)',
                      zIndex: 1400,
                      flexDirection: 'row',
                      justifyContent: 'flex-start',
                      paddingLeft: '20px',
                      border: `2px solid ${colors.blue500}`,
                    }),
                  }}
                >
                  {/* אייקון */}
                  <Box
                    sx={{
                      position: 'relative',
                      width: '32px',
                      height: '32px',
                      flexShrink: 0,
                    }}
                  >
                    <img
                      src={isSelected ? li.iconBlue : li.iconWhite}
                      alt={`${li.text} icon`}
                      style={{
                        width: '32px',
                        height: '32px',
                      }}
                    />
                  </Box>

                  {/* טקסט */}
                  {(isOpen || isHovered) && (
                    <CustomTypography
                      text={li.text}
                      variant='h4'
                      weight='regular'
                      color={isSelected ? colors.blue200 : colors.neutral0}
                      sx={{
                        whiteSpace: 'nowrap',
                        opacity: isOpen || isHovered ? 1 : 0,
                        transition: 'opacity 0.2s ease-in-out',
                      }}
                    />
                  )}
                </ListItem>
              </Tooltip>
              
              {/* Spacer - שומר על המרחק בין האייקונים גם כשיש ריחוף */}
              {!isOpen && isHovered && (
                <Box sx={{ height: MENU_ITEM_HEIGHT, visibility: 'hidden' }} />
              )}
            </Box>
          )
        })}
      </List>
    </Drawer>
  )
}

export default SideNav