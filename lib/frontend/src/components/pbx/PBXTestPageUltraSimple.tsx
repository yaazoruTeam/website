/**
 * PBX Test Page (Ultra Simple) - עמוד בדיקה ללא hooks מורכבים
 */

import React from 'react'
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button
} from '@mui/material'
import {
  Phone as PhoneIcon
} from '@mui/icons-material'

const PBXTestPageUltraSimple: React.FC = () => {
  console.log('🔧 PBXTestPageUltraSimple loaded - NO HOOKS!')
  
  // אין יותר state - משתמשים רק ב-DOM manipulation

  // בדיקת חיבור פשוטה (ללא עדכון UI במהלך הביצוע)
  const testConnection = async () => {
    console.log('🔍 testConnection started')
    
    try {
      console.log('📡 Making fetch request to PBX initialize')
      const response = await fetch('http://localhost:3006/controller/pbx/initialize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      console.log('📨 Response received:', response.status, response.statusText)
      
      if (response.ok) {
        const data = await response.json()
        console.log('📄 Response data:', data)
        if (data.success) {
          console.log('✅ PBX Connection SUCCESS:', data.message)
          // נוסיף את התוצאה רק בסוף
          return { success: true, message: data.message }
        } else {
          console.log('❌ PBX Connection FAILED:', data.error?.message)
          return { success: false, message: data.error?.message || 'חיבור נכשל' }
        }
      } else {
        const errorMsg = `שגיאת שרת: ${response.status} ${response.statusText}`
        console.log('❌ HTTP Error:', errorMsg)
        return { success: false, message: errorMsg }
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'שגיאה לא ידועה'
      console.error('❌ testConnection error:', errorMsg)
      return { success: false, message: errorMsg }
    }
  }

  // הרצת כל הבדיקות (ללא state updates כדי למנוע re-renders)
  const runAllTests = async () => {
    console.log('🚀 Starting runAllTests')
    
    // מוצא את הכפתור ומשנה את הטקסט שלו ישירות
    const button = document.querySelector('[data-testid="run-tests-button"]') as HTMLButtonElement
    if (button) {
      button.disabled = true
      button.innerHTML = '⏳ רץ...'
    }
    
    try {
      console.log('🔄 Running all PBX tests')
      
      // 1. בדיקת חיבור
      console.log('1. Testing connection...')
      const connectionResult = await testConnection()
      console.log('Connection result:', connectionResult)
      
      // 2. בדיקת בריאות
      console.log('2. Testing health check...')
      const healthResponse = await fetch('http://localhost:3006/controller/pbx/health')
      const healthData = await healthResponse.json()
      console.log('Health result:', healthData.success ? 'OK' : 'FAILED')
      
      // 3. בדיקת סטטוס מערכת
      console.log('3. Testing system status...')
      const statusResponse = await fetch('http://localhost:3006/controller/pbx/status')
      const statusData = await statusResponse.json()
      console.log('Status result:', statusData.success ? 'OK' : 'FAILED')
      
      // 4. בדיקת שיחות פעילות
      console.log('4. Testing active calls...')
      const callsResponse = await fetch('http://localhost:3006/controller/pbx/active-calls')
      const callsData = await callsResponse.json()
      console.log('Active calls result:', callsData.success ? `OK (${callsData.count} calls)` : 'FAILED')
      
      // סיכום כל הבדיקות
      const summary = `🎯 סיכום בדיקות אוטומטיות:

1. ${connectionResult.success ? '✅' : '❌'} חיבור: ${connectionResult.success ? 'הצליח' : 'נכשל'}
2. ${healthData.success ? '✅' : '❌'} בריאות: ${healthData.success ? 'תקין' : 'שגיאה'}
3. ${statusData.success ? '✅' : '❌'} סטטוס: ${statusData.success ? 'פעיל' : 'שגיאה'}  
4. ${callsData.success ? '✅' : '❌'} שיחות פעילות: ${callsData.success ? `${callsData.count || 0} שיחות` : 'שגיאה'}

📝 הערה: בדיקות ידניות (ניתוב, DID, יצירת שיחה) דורשות הרצה נפרדת`
      
      alert(summary)
      console.log('🏁 runAllTests completed successfully')
      
    } catch (error) {
      console.error('❌ Error in runAllTests:', error)
      const errorMsg = `שגיאה ב-runAllTests: ${error instanceof Error ? error.message : 'שגיאה לא ידועה'}`
      alert(`❌ ${errorMsg}`)
    }
    
    // מחזיר את הכפתור למצב הרגיל
    if (button) {
      button.disabled = false
      button.innerHTML = '🏃‍♂️ הרץ כל הבדיקות'
    }
  }

  // פונקציה פשוטה לכפתור "בדוק חיבור"
  const simpleConnectionTest = async () => {
    const result = await testConnection()
    alert(result.success ? `✅ הצלחה: ${result.message}` : `❌ כשל: ${result.message}`)
  }

  // בדיקת Health Check
  const testHealthCheck = async () => {
    console.log('🏥 testHealthCheck started')
    
    try {
      const response = await fetch('http://localhost:3006/controller/pbx/health', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      if (response.ok) {
        const data = await response.json()
        console.log('🏥 Health check data:', data)
        const message = data.success 
          ? `✅ מערכת תקינה! סטטוס: ${JSON.stringify(data.data)}`
          : `❌ מערכת לא תקינה: ${data.error?.message}`
        alert(message)
      } else {
        alert(`❌ שגיאת שרת: ${response.status} ${response.statusText}`)
      }
    } catch (error) {
      console.error('❌ testHealthCheck error:', error)
      alert(`❌ שגיאה בבדיקת תקינות: ${error instanceof Error ? error.message : 'שגיאה לא ידועה'}`)
    }
  }

  // בדיקת Route Call
  const testRouteCall = async () => {
    console.log('📞 testRouteCall started')
    
    const did = prompt('הכנס מספר DID (נקרא):')
    const cid = prompt('הכנס מספר CID (מתקשר):')
    
    if (!did || !cid) {
      alert('❌ נדרש להכניס גם DID וגם CID')
      return
    }
    
    try {
      const response = await fetch('http://localhost:3006/controller/pbx/route', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          did: did,
          cid: cid,
          variables: {
            test_call: 'true',
            timestamp: new Date().toISOString()
          }
        }),
      })
      
      const data = await response.json()
      
      if (data.success) {
        alert(`✅ ניתוב הצליח!\nיעד: ${data.data?.destination}\nספק: ${data.data?.provider}\nעדיפות: ${data.data?.rulePriority}`)
      } else {
        alert(`❌ ניתוב נכשל: ${data.error?.message}`)
      }
    } catch (error) {
      console.error('❌ testRouteCall error:', error)
      alert(`❌ שגיאה בניתוב שיחה: ${error instanceof Error ? error.message : 'שגיאה לא ידועה'}`)
    }
  }

  // בדיקת Validate DID
  const testValidateDID = async () => {
    console.log('🔍 testValidateDID started')
    
    const did = prompt('הכנס מספר DID לבדיקה:')
    
    if (!did) {
      alert('❌ נדרש להכניס מספר DID')
      return
    }
    
    try {
      const response = await fetch('http://localhost:3006/controller/pbx/validate-did', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          did: did,
          format: 'detailed'
        }),
      })
      
      const data = await response.json()
      
      if (data.success && data.data?.data?.valid) {
        const virtualNumber = data.data.data.virtualNumber
        const message = virtualNumber 
          ? `✅ DID תקף!\nמספר: ${virtualNumber.number}\nקוד מדינה: ${virtualNumber.countryCode}\nעלות חודשית: ${virtualNumber.monthlyCost}`
          : `✅ DID תקף!\nהודעה: ${data.data.data.message}`
        alert(message)
      } else {
        alert(`❌ DID לא תקף: ${data.data?.data?.message || data.error?.message}`)
      }
    } catch (error) {
      console.error('❌ testValidateDID error:', error)
      alert(`❌ שגיאה בבדיקת DID: ${error instanceof Error ? error.message : 'שגיאה לא ידועה'}`)
    }
  }

  // בדיקת Originate Call
  const testOriginateCall = async () => {
    console.log('☎️ testOriginateCall started')
    
    const callerNumber = prompt('הכנס מספר מתקשר:')
    const calledNumber = prompt('הכנס מספר נקרא:')
    
    if (!callerNumber || !calledNumber) {
      alert('❌ נדרש להכניס גם מספר מתקשר וגם נקרא')
      return
    }
    
    try {
      const response = await fetch('http://localhost:3006/controller/pbx/originate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          callerNumber: callerNumber,
          calledNumber: calledNumber,
          timeout: 30,
          variables: {
            test_originate: 'true',
            timestamp: new Date().toISOString()
          },
          earlyMedia: false
        }),
      })
      
      const data = await response.json()
      
      if (data.success) {
        alert(`✅ שיחה החלה בהצלחה!\nמזהה שיחה: ${data.data?.callId}\nסטטוס: ${data.data?.status}\nSession ID: ${data.data?.sessionId || 'לא זמין'}`)
      } else {
        alert(`❌ יצירת שיחה נכשלה: ${data.error?.message}`)
      }
    } catch (error) {
      console.error('❌ testOriginateCall error:', error)
      alert(`❌ שגיאה ביצירת שיחה: ${error instanceof Error ? error.message : 'שגיאה לא ידועה'}`)
    }
  }

  // בדיקת קבלת שיחות פעילות
  const testActiveCalls = async () => {
    console.log('📱 testActiveCalls started')
    
    try {
      const response = await fetch('http://localhost:3006/controller/pbx/active-calls', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      const data = await response.json()
      
      if (data.success) {
        const activeCalls = data.data || []
        if (activeCalls.length === 0) {
          alert('📭 אין שיחות פעילות כרגע')
        } else {
          const callsList = activeCalls.map((call: {
            callerNumber: string;
            calledNumber: string;
            status: string;
          }, index: number) => 
            `שיחה ${index + 1}: ${call.callerNumber} -> ${call.calledNumber} (${call.status})`
          ).join('\n')
          alert(`📱 שיחות פעילות (${activeCalls.length}):\n\n${callsList}`)
        }
      } else {
        alert(`❌ שגיאה בקבלת שיחות פעילות: ${data.error?.message}`)
      }
    } catch (error) {
      console.error('❌ testActiveCalls error:', error)
      alert(`❌ שגיאה בקבלת שיחות פעילות: ${error instanceof Error ? error.message : 'שגיאה לא ידועה'}`)
    }
  }

  // בדיקת סטטוס מערכת
  const testSystemStatus = async () => {
    console.log('⚙️ testSystemStatus started')
    
    try {
      const response = await fetch('http://localhost:3006/controller/pbx/status', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      const data = await response.json()
      
      if (data.success) {
        const status = data.data
        const message = `⚙️ סטטוס מערכת PBX:\n\n` +
          `חיבור: ${status.connected ? '✅ מחובר' : '❌ מנותק'}\n` +
          `גרסה: ${status.version || 'לא זמין'}\n` +
          `זמן פעילות: ${status.uptime || 'לא זמין'}\n` +
          `שיחות פעילות: ${status.activeCalls || 0}\n` +
          `עומס מערכת: ${status.load || 'לא זמין'}`
        alert(message)
      } else {
        alert(`❌ שגיאה בקבלת סטטוס מערכת: ${data.error?.message}`)
      }
    } catch (error) {
      console.error('❌ testSystemStatus error:', error)
      alert(`❌ שגיאה בקבלת סטטוס מערכת: ${error instanceof Error ? error.message : 'שגיאה לא ידועה'}`)
    }
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        🔧 מערכת בדיקות PBX - מלא
      </Typography>
      
      <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
        מערכת בדיקות מקיפה למערכת מרכזיה PBX: בדיקות אוטומטיות וידניות
      </Typography>
      
      <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
        {/* כרטיס בקרה */}
        <Box sx={{ flex: '1 1 400px', minWidth: '400px' }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                🎮 בקרת בדיקות
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
                <Button
                  variant="contained"
                  onClick={runAllTests}
                  data-testid="run-tests-button"
                  startIcon={<PhoneIcon />}
                >
                  🏃‍♂️ הרץ כל הבדיקות
                </Button>
                
                <Button
                  variant="outlined"
                  onClick={simpleConnectionTest}
                >
                  🔗 בדוק חיבור
                </Button>
              </Box>

              {/* קבוצת כפתורי בדיקות נוספים */}
              <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={testHealthCheck}
                  sx={{ minWidth: 120 }}
                >
                  🏥 בריאות
                </Button>
                
                <Button
                  variant="outlined"
                  size="small"
                  onClick={testRouteCall}
                  sx={{ minWidth: 120 }}
                >
                  📞 ניתוב
                </Button>
                
                <Button
                  variant="outlined"
                  size="small"
                  onClick={testValidateDID}
                  sx={{ minWidth: 120 }}
                >
                  🔍 בדיקת DID
                </Button>
              </Box>

              <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={testOriginateCall}
                  sx={{ minWidth: 120 }}
                >
                  ☎️ יצור שיחה
                </Button>
                
                <Button
                  variant="outlined"
                  size="small"
                  onClick={testActiveCalls}
                  sx={{ minWidth: 120 }}
                >
                  📱 שיחות פעילות
                </Button>
                
                <Button
                  variant="outlined"
                  size="small"
                  onClick={testSystemStatus}
                  sx={{ minWidth: 120 }}
                >
                  ⚙️ סטטוס מערכת
                </Button>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>סוגי בדיקות:</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  🤖 <strong>אוטומטי:</strong> בריאות, סטטוס, שיחות פעילות
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  👤 <strong>ידני:</strong> ניתוב, בדיקת DID, יצירת שיחות
                </Typography>
                <Typography variant="subtitle2" sx={{ mt: 2, fontWeight: 'bold' }}>סטטוס:</Typography>
                <Typography variant="body2" color="success.main">
                  ✅ מוכן לבדיקה (6 סוגי בדיקות זמינים)
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* תוצאות בדיקות */}
        <Box sx={{ flex: '1 1 400px', minWidth: '400px' }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                📊 תוצאות בדיקות
              </Typography>

              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                <strong>בדיקות אוטומטיות:</strong> התוצאות יוצגו ב-popup מסכם<br/>
                <strong>בדיקות ידניות:</strong> דורשות קלט מהמשתמש ויציגו תוצאה מיידית
              </Typography>

              <Box sx={{ 
                p: 2, 
                bgcolor: 'grey.50', 
                borderRadius: 1,
                border: '1px solid',
                borderColor: 'grey.200'
              }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                  💡 הוראות שימוש:
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  1. התחל עם <strong>"הרץ כל הבדיקות"</strong> לבדיקות אוטומטיות
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  2. השתמש בכפתורים הספציפיים לבדיקות ידניות
                </Typography>
                <Typography variant="body2">
                  3. בדיקות הניתוב והיצירה דורשות מספרי טלפון תקפים
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  )
}

export default PBXTestPageUltraSimple