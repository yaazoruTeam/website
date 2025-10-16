# Tranzila Hosted Fields Integration

עיצוב מחדש ושיפור של מערכת התשלומים המאובטחים של טרנזילה בפרויקט.

## מה שונה מהקוד הקודם?

### 1. ארכיטקטורה חדשה ומקצועית
- **Hooks מותאמים אישית**: חלוקה לוגית לשני hooks נפרדים
  - `useTranzilaScript`: מנהל את טעינת הסקריפט של טרנזילה
  - `useTranzilaHostedFields`: מנהל את השדות המאובטחים והעסקאות

### 2. טיפול מקצועי בשגיאות
- **ממשק שגיאות מובנה**: הצגת שגיאות ברורות למשתמש
- **טיפול בחריגות**: Catch blocks מפורטים עם logging
- **מצבי טעינה**: מצב loading בזמן טעינת הסקריפט

### 3. TypeScript מקצועי
- **טיפוסים מדויקים**: הסרת כל ה-`any` והחלפה בטיפוסים ספציפיים
- **ממשקים ברורים**: הגדרת interfaces ברורים לכל נתון
- **Type Safety**: בטיחות מלאה בזמן קומפילציה

### 4. ניהול מצב משופר
- **State Management**: ניהול מצב הקומפוננט בצורה מובנית
- **Effect Management**: שימוש נכון ב-useEffect עם dependencies
- **Cleanup**: ניקוי נכון של resources בזמן unmount

## קבצים חדשים שנוצרו

### 1. `/src/hooks/useTranzilaScript.ts`
```typescript
// Hook לטעינת סקריפט טרנזילה
const { isLoaded, isLoading, error } = useTranzilaScript()
```

**תכונות:**
- טעינה אוטומטית של סקריפט טרנזילה
- בדיקת קיום הסקריפט לפני טעינה חוזרת
- טיפול בשגיאות טעינה
- מצבי loading ברורים

### 2. `/src/hooks/useTranzilaHostedFields.ts`
```typescript
// Hook לניהול שדות מאובטחים
const { isInitialized, charge, destroy } = useTranzilaHostedFields({
  sandbox: true,
  onSuccess: (response) => console.log('Success!'),
  onError: (errors) => console.log('Error:', errors)
})
```

**תכונות:**
- אתחול אוטומטי של שדות טרנזילה
- פונקציית charge אסינכרונית עם Promise
- טיפול מקצועי בשגיאות
- ניקוי אוטומטי של resources

### 3. `/src/tranzila.d.ts` (עודכן)
```typescript
// טיפוסי TypeScript מקצועיים עבור טרנזילה
interface TzlaHostedFieldsResponse {
  transaction_response: {
    ConfirmationCode?: string
    TransactionId?: string
    // ...
  }
}
```

## איך להשתמש בקוד החדש

### 1. הגדרת משתני סביבה
```env
# .env
VITE_TRANZILA_TERMINAL_NAME=yaazoru
VITE_TRANZILA_SANDBOX=true
```

### 2. שימוש בקומפוננט PaymentForm
```tsx
import PaymentForm, { PaymentFormHandle } from './PaymentForm'

const MyComponent = () => {
  const paymentRef = useRef<PaymentFormHandle>(null)
  
  const handlePayment = async () => {
    try {
      const result = await paymentRef.current?.chargeCcData(100) // 100 שקלים
      console.log('Payment successful:', result)
    } catch (error) {
      console.error('Payment failed:', error)
    }
  }

  return (
    <PaymentForm
      ref={paymentRef}
      onPaymentChange={(data) => console.log('Payment data:', data)}
      OnTimeChange={(data) => console.log('Time data:', data)}
    />
  )
}
```

### 3. שימוש ישיר ב-Hooks
```tsx
import { useTranzilaHostedFields } from '../hooks/useTranzilaHostedFields'

const MyPaymentComponent = () => {
  const { isInitialized, charge, error } = useTranzilaHostedFields({
    sandbox: true,
    onSuccess: (response) => {
      console.log('Payment successful!', response)
    },
    onError: (errors) => {
      console.error('Payment failed:', errors)
    }
  })

  const handlePayment = async () => {
    if (!isInitialized) {
      alert('Payment fields not ready')
      return
    }

    try {
      await charge({
        amount: 50,
        tran_mode: 'N',
        tokenize: true
      })
    } catch (error) {
      console.error('Payment error:', error)
    }
  }

  return (
    <div>
      {error && <div>Error: {error}</div>}
      <button onClick={handlePayment} disabled={!isInitialized}>
        Pay Now
      </button>
    </div>
  )
}
```

## בעיות שנפתרו

### 1. טעינת הסקריפט
**בעיה קודמת:** הסקריפט של טרנזילה לא נטען בכלל
```html
<!-- חסר ב-index.html -->
<script src="https://direct.tranzila.com/js/v2/tranzila-hosted-fields.js"></script>
```

**פתרון:** טעינה דינמית באמצעות hook מותאם

### 2. ניהול מצב השדות
**בעיה קודמת:** שדות אותחלו מספר פעמים וללא ניקוי נכון
```typescript
// קוד ישן - בעייתי
let fields: any = null
window.fieldsInitialized = boolean
```

**פתרון:** ניהול מצב מקצועי עם hooks ו-refs

### 3. טיפוסי TypeScript
**בעיה קודמת:** שימוש ב-`any` בכל מקום
```typescript
// קוד ישן
const response: any = await fields.charge(data: any, callback: any)
```

**פתרון:** טיפוסים מדויקים וממשקים ברורים

### 4. טיפול בשגיאות
**בעיה קודמת:** שגיאות לא מוצגות כראוי למשתמש
**פתרון:** ממשק שגיאות מובנה עם Alert components

## הוראות התקנה והפעלה

### 1. ודא שמשתני הסביבה מוגדרים
```bash
# בדוק ב-.env
VITE_TRANZILA_TERMINAL_NAME=yaazoru
VITE_TRANZILA_SANDBOX=true
```

### 2. התקן dependencies (אם חסרות)
```bash
npm install @mui/material @mui/icons-material react-hook-form
```

### 3. הפעל את השרת
```bash
npm run dev
```

### 4. בדוק ב-Console של הדפדפן
אמור להראות:
```
Tranzila hosted fields initialized successfully
```

## טיפים לפיתוח

### 1. מצב Sandbox
- השתמש ב-`sandbox: true` לפיתוח
- עבור לפרודקשן: `sandbox: false`

### 2. נתוני בדיקה
```typescript
// כרטיס אשראי לבדיקות (sandbox בלבד)
{
  credit_card_number: "4012888888881881",
  cvv: "123",
  expiry: "12/25",
  identity_number: "123456789"
}
```

### 3. Debugging
```typescript
// הפעל לוגים מפורטים
console.log('Tranzila fields instance:', fieldsInstance)
console.log('Available methods:', Object.keys(fieldsInstance))
```

## בעיות נפוצות ופתרונות

### 1. "TzlaHostedFields אינו זמין"
**סיבה:** הסקריפט לא נטען
**פתרון:** בדוק חיבור לאינטרנט ו-Console Errors

### 2. "השדות לא אותחלו"
**סיבה:** ה-DOM elements לא קיימים
**פתרון:** ודא שה-divs עם הזיהויים הנכונים קיימים

### 3. שגיאות TypeScript
**סיבה:** ייבוא לא נכון של הטיפוסים
**פתרון:** 
```typescript
import type { TzlaHostedFieldsResponse } from '../../tranzila'
```

## תמיכה ועדכונים

- תיעוד טרנזילה: https://docs.tranzila.com/docs/payments-billing/o033w842qo397-hosted-fields
- קוד מקור: `/src/components/monthlyPayment/PaymentForm.tsx`
- Hooks: `/src/hooks/useTranzila*.ts`

## לסיכום

הקוד החדש מספק:
✅ ארכיטקטורה מקצועית ונקייה  
✅ טיפוסי TypeScript מדויקים  
✅ טיפול מקצועי בשגיאות  
✅ ניהול מצב משופר  
✅ קוד לקריאה ותחזוקה  
✅ ביצועים משופרים  
✅ אבטחה מוגברת  