# API Architecture - תיעוד הארכיטקטורה המשופרת 🚀

## הארכיטקטורה החדשה שלנו

עברנו לגישה **אחידה וגמישה** עם API מרכזי שתומך בכל תצורות האפשריות דרך configuration object.

## למה שיפרנו את apiHelpers?

### 🔄 **מה השתנה?**
עברנו מ-**6 פונקציות נפרדות** ל-**API אחיד** עם אפשרויות גמישות:

**לפני:**
- `apiGet()` - רגיל עם auth
- `safeApiGet()` - עם fallback
- `apiGetPublic()` - בלי auth  
- `safeGetPaginated()` - עם pagination + safe
- `getPaginatedData()` - עם pagination רגיל
- `apiPostPublic()` - POST בלי auth

**אחרי:**
- `apiGet(url, config)` - אחד שעושה הכל! 🎯

### ✅ **יתרונות של הגישה החדשה:**
- **עקביות מלאה** - אותו API לכל הפונקציות
- **גמישות מקסימלית** - שילוב כל האפשרויות בקריאה אחת
- **קוד נקי יותר** - פחות פונקציות לזכור
- **תחזוקה קלה** - שינוי במקום אחד משפיע על הכל
- **Type Safety משופר** - אפשרויות מוגדרות בממשק אחד

## הבעיות הישנות שפתרנו

### 1. חוסר עקביות בשימוש
**הבעיה הישנה:**
```typescript
// צריך היה לזכור מתי להשתמש בכל פונקציה
const users = await apiGet<User[]>('/users')           // רגיל
const payments = await safeGetPaginated<Payment>(...) // safe + pagination  
const stats = await apiGetPublic<Stats>('/stats')     // public
```

**הפתרון החדש:**
```typescript
// כל הפונקציות עובדות אותו דבר!
const users = await apiGet<User[]>('/users')
const payments = await apiGet<PaginatedResponse<Payment>>('/payments?page=1', { safe: true, fallback: { data: [], total: 0, page: 1, totalPages: 0 } })
const stats = await apiGet<Stats>('/stats', { requireAuth: false })
```

### 2. הכפלת קוד וחזרה על לוגיקה
**לפני:**
```typescript
// אותה לוגיקה כתובה 6 פעמים!
export const apiGet = async <T>(url: string): Promise<T> => {
  const headers = await getAuthHeaders()
  const response = await axios.get(`${baseURL}${url}`, { headers })
  return response.data
}

export const safeApiGet = async <T>(url: string, fallback: T): Promise<T> => {
  try {
    const headers = await getAuthHeaders()  // חזרה על קוד
    const response = await axios.get(`${baseURL}${url}`, { headers })
    return response.data
  } catch (error) {
    return fallback
  }
}
```

**אחרי:**
```typescript
// פונקציה מרכזית אחת עם כל הלוגיקה
const makeRequest = async <T>(method, url, data?, config: ApiConfig = {}) => {
  const { safe = false, fallback, requireAuth = true, ...axiosConfig } = config
  
  try {
    if (requireAuth) await getValidToken()
    const headers = requireAuth ? await getAuthHeaders() : { 'Content-Type': 'application/json' }
    
    // ביצוע הבקשה...
    return response.data
  } catch (error) {
    if (safe && fallback !== undefined) return fallback
    throw error
  }
}
```

## הפתרון החדש והמשופר

### 1. Token Manager (`core/tokenManager.ts`) - ללא שינוי
עדיין מנהל את כל הטיפול בטוקנים במקום אחד:

```typescript
export const getValidToken = async (): Promise<string> => {
  await handleTokenRefresh()
  const token = localStorage.getItem('token')
  if (!token) {
    throw new Error('No token found!')
  }
  return token
}

export const getAuthHeaders = async () => {
  const token = await getValidToken()
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  }
}
```

### 2. API Helpers החדש (`core/apiHelpers.ts`) - משופר לחלוטין!

#### הגדרת התצורה החדשה:
```typescript
export interface ApiConfig extends AxiosRequestConfig {
  /** האם להחזיר fallback במקום לזרוק שגיאה */
  safe?: boolean
  /** ערך ברירת מחדל במידה ו-safe=true */
  fallback?: any
  /** האם הבקשה צריכה authentication */
  requireAuth?: boolean
}
```

#### הפונקציה המרכזית:
```typescript
const makeRequest = async <T>(
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  url: string,
  data?: any,
  config: ApiConfig = {}
): Promise<T> => {
  const { safe = false, fallback, requireAuth = true, ...axiosConfig } = config
  
  try {
    // וידוא טוקן אם נדרש
    if (requireAuth) await getValidToken()
    
    // קבלת headers מותאמים
    const headers = requireAuth 
      ? await getAuthHeaders() 
      : { 'Content-Type': 'application/json' }
    
    // ביצוע הבקשה בהתאם לשיטה
    const response = await axios[method.toLowerCase()](`${baseURL}${url}`, ...)
    return response.data
  } catch (error) {
    console.error(`Error in ${method} ${url}:`, error)
    
    // אם safe mode - החזר fallback
    if (safe && fallback !== undefined) return fallback
    throw error
  }
}
```

#### פונקציות ה-API החדשות - אחידות וגמישות מלאה:
```typescript
export const apiGet = async <T>(url: string, config: ApiConfig = {}): Promise<T> => {
  return makeRequest<T>('GET', url, undefined, config)
}

export const apiPost = async <T>(url: string, data?: any, config: ApiConfig = {}): Promise<T> => {
  return makeRequest<T>('POST', url, data, config)
}

export const apiPut = async <T>(url: string, data?: any, config: ApiConfig = {}): Promise<T> => {
  return makeRequest<T>('PUT', url, data, config)
}

export const apiDelete = async <T>(url: string, config: ApiConfig = {}): Promise<T> => {
  return makeRequest<T>('DELETE', url, undefined, config)
}
```

#### פונקציות נוחות (מבוססות על החדשות):
```typescript
// פונקציות public (ללא authentication)
export const apiGetPublic = async <T>(url: string, config: ApiConfig = {}): Promise<T> => {
  return apiGet<T>(url, { ...config, requireAuth: false })
}

// פונקציות safe עם fallback מובנה
export const safeApiGet = async <T>(url: string, fallback: T, config: ApiConfig = {}): Promise<T> => {
  return apiGet<T>(url, { ...config, safe: true, fallback })
}

export const safePaginated = async <T>(
  endpoint: string,
  page: number = 1,
  config: ApiConfig = {}
): Promise<PaginatedResponse<T>> => {
  const fallback: PaginatedResponse<T> = { data: [], total: 0, page, totalPages: 0 }
  return apiGet<PaginatedResponse<T>>(`${endpoint}?page=${page}`, { 
    ...config, 
    safe: true, 
    fallback 
  })
}

// Aliases לתאימות עם קוד קיים
export const safeGetPaginated = safePaginated
export const safeGet = safeApiGet
export const getPaginatedData = <T>(endpoint: string, page: number = 1): Promise<PaginatedResponse<T>> => {
  return apiGet<PaginatedResponse<T>>(`${endpoint}?page=${page}`)
}
```

## היתרונות של הארכיטקטורה החדשה

### 1. עקביות מקסימלית 🎯
```typescript
// הכל באותו פורמט - קל לזכור!
const users = await apiGet<User[]>('/users')
const user = await apiPost<User>('/users', userData)
const updatedUser = await apiPut<User>('/users/123', userData)
await apiDelete('/users/123')
```

### 2. גמישות מלאה עם שילוב אפשרויות 🔧
```typescript
// שילוב כל האפשרויות בקריאה אחת
const data = await apiGet<Data>('/endpoint', {
  safe: true,                    // לא זורק שגיאה
  fallback: null,               // מחזיר null במקרה של כשל
  requireAuth: false,           // ללא authentication
  timeout: 10000,               // timeout מותאם אישית
  headers: { 'X-Custom': 'val' } // headers נוספים
})
```

### 3. קוד נקי ופשוט הרבה יותר 📝
```typescript
// לפני - מבולגן ולא עקבי:
const users = await apiGet<User[]>('/users')
const safePayments = await safeGetPaginated<Payment>('/payments', 1)
const publicStats = await apiGetPublic<Stats>('/stats')

// אחרי - נקי ועקבי:
const users = await apiGet<User[]>('/users', { safe: true, fallback: [] })
const payments = await apiGet<PaginatedResponse<Payment>>('/payments?page=1', { safe: true, fallback: { data: [], total: 0, page: 1, totalPages: 0 } })
const stats = await apiGet<Stats>('/stats', { requireAuth: false, safe: true, fallback: {} })
```

### 4. ניהול שגיאות מתקדם וחכם ⚡
```typescript
// למקרים שונים - התנהגות שונה
// Critical operation - נרצה לדעת אם נכשל
const result = await apiPost<Result>('/critical-action', data) // זורק שגיאה

// Optional feature - נמשיך גם אם נכשל  
const recommendations = await apiGet<Item[]>('/recommendations', { 
  safe: true, 
  fallback: [] 
}) // אף פעם לא זורק שגיאה
```

### 5. Type Safety מושלם עם TypeScript 🛡️
```typescript
interface ApiConfig extends AxiosRequestConfig {
  safe?: boolean        // האם להחזיר fallback
  fallback?: any       // ערך ברירת מחדל
  requireAuth?: boolean // האם צריך authentication
}

// TypeScript יזהה ויעזור עם השלמה אוטומטית!
```

### 6. תחזוקה פשוטה מאוד 🔧
- **קוד אחד** - כל השינויים במקום אחד
- **בדיקות פשוטות** - פונקציה אחת לבדוק
- **הוספת features** - קל להוסיף retry, caching, ועוד

### 7. תאימות לאחור מלאה ✅
```typescript
// הקוד הישן עדיין עובד!
export const safeGetPaginated = safePaginated // alias
export const safeGet = safeApiGet // alias
```

## דוגמאות לשימוש המעודכנות

### 1. בקשות בסיסיות - הכל באותו פורמט:
```typescript
import { apiGet, apiPost, apiPut, apiDelete } from './api/core/apiHelpers'

// קבלת נתונים
const users = await apiGet<User[]>('/users')
const user = await apiGet<User>('/users/123')

// יצירת נתונים חדשים
const newUser = await apiPost<User>('/users', userData)

// עדכון נתונים
const updatedUser = await apiPut<User>('/users/123', userData)

// מחיקת נתונים
await apiDelete('/users/123')
```

### 2. בקשות עם אפשרויות מתקדמות:
```typescript
// בקשה עם safe mode + timeout מותאם אישית
const users = await apiGet<User[]>('/users', {
  safe: true,
  fallback: [],
  timeout: 15000
})

// בקשה ללא authentication עם headers מיוחדים
const publicData = await apiGet<PublicData>('/public/data', {
  requireAuth: false,
  headers: { 'X-Client-Version': '1.0' }
})

// שילוב של כל האפשרויות
const criticalData = await apiPost<Result>('/critical-endpoint', formData, {
  safe: true,
  fallback: null,
  requireAuth: true,
  timeout: 30000,
  headers: { 'Content-Type': 'multipart/form-data' }
})
```

### 3. בקשות בטוחות עם fallback - דרכים שונות:
```typescript
// דרך 1: באמצעות config object (מומלץ!)
const users = await apiGet<User[]>('/users', {
  safe: true,
  fallback: []
})

// דרך 2: באמצעות הפונקציה הנוחה (לתאימות)
const users2 = await safeApiGet<User[]>('/users', [])

// דרך 3: pagination בטוחה
const usersPage = await safePaginated<User>('/users', 1)
// מחזיר: { data: User[], total: number, page: number, totalPages: number }
```

### 4. מקרים מתקדמים:
```typescript
// React component עם safe loading
const UserComponent = ({ userId }: { userId: string }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    const loadUser = async () => {
      // תמיד יחזיר תוצאה - לא יזרוק שגיאה
      const userData = await apiGet<User>(`/users/${userId}`, {
        safe: true,
        fallback: null
      })
      
      setUser(userData)
      setLoading(false) // תמיד נגיע לכאן!
    }
    
    loadUser()
  }, [userId])
  
  return loading ? <div>Loading...</div> : <UserDisplay user={user} />
}

// Form submission עם error handling
const saveUser = async (userData: User) => {
  try {
    // ללא safe - נרצה לדעת אם נכשל
    const result = await apiPost<User>('/users', userData)
    showSuccessMessage('User saved successfully!')
    return result
  } catch (error) {
    showErrorMessage('Failed to save user')
    throw error
  }
}
```

### 5. Conditional requests:
```typescript
// התנהגות שונה על פי תנאים
const loadData = async (isPublicUser: boolean) => {
  const config = {
    requireAuth: !isPublicUser,
    safe: true,
    fallback: isPublicUser ? {} : null,
    timeout: isPublicUser ? 5000 : 15000
  }
  
  return await apiGet<UserData>('/user-data', config)
}
```

## בניית API חדש - הדרך החדשה והפשוטה

כשרוצים להוסיף endpoint חדש, עכשיו יש לנו גמישות מלאה:

### דוגמה מלאה לAPI חדש:
```typescript
// api/newFeatureApi.ts
import { 
  apiGet, 
  apiPost, 
  apiPut, 
  apiDelete, 
  safePaginated 
} from './core/apiHelpers'
import { NewFeature } from '@model'

const ENDPOINT = '/newFeature'

// קבלת רשימה עם pagination בטוחה
export const getNewFeatures = async (page: number = 1) => {
  return safePaginated<NewFeature.Model>(ENDPOINT, page)
}

// קבלת פריט יחיד - עם אפשרות safe
export const getNewFeatureById = async (id: string, safe: boolean = false) => {
  return apiGet<NewFeature.Model>(`${ENDPOINT}/${id}`, {
    safe,
    fallback: safe ? null : undefined
  })
}

// יצירת פריט חדש
export const createNewFeature = async (data: NewFeature.Model) => {
  return apiPost<NewFeature.Model>(ENDPOINT, data)
}

// עדכון פריט
export const updateNewFeature = async (id: string, data: Partial<NewFeature.Model>) => {
  return apiPut<NewFeature.Model>(`${ENDPOINT}/${id}`, data)
}

// מחיקת פריט
export const deleteNewFeature = async (id: string) => {
  return apiDelete(`${ENDPOINT}/${id}`)
}

// חיפוש עם filters מותאמים אישית
export const searchNewFeatures = async (query: string, filters: any = {}) => {
  return apiGet<NewFeature.Model[]>(`${ENDPOINT}/search`, {
    params: { q: query, ...filters },
    safe: true,
    fallback: []
  })
}

// קבלת נתונים מובטחים עם retry logic
export const getNewFeatureWithRetry = async (id: string, maxRetries: number = 3) => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await apiGet<NewFeature.Model>(`${ENDPOINT}/${id}`)
    } catch (error) {
      if (attempt === maxRetries) {
        // אם זה הניסיון האחרון, החזר null
        return await apiGet<NewFeature.Model>(`${ENDPOINT}/${id}`, {
          safe: true,
          fallback: null
        })
      }
      // חכה קצת לפני הניסיון הבא
      await new Promise(resolve => setTimeout(resolve, 1000 * attempt))
    }
  }
}

// עבור נתונים public (ללא authentication)
export const getPublicNewFeatures = async () => {
  return apiGet<NewFeature.Model[]>(`${ENDPOINT}/public`, {
    requireAuth: false,
    safe: true,
    fallback: []
  })
}
```

### דוגמה לAPI עם אפשרויות מתקדמות:
```typescript
// api/advancedApi.ts
import { apiGet, apiPost } from './core/apiHelpers'

// עבור נתונים כבדים עם timeout ארוך
export const getHeavyData = async (id: string) => {
  return apiGet<HeavyData>(`/heavy-calculation/${id}`, {
    timeout: 60000, // דקה שלמה
    safe: true,
    fallback: { status: 'timeout', data: null }
  })
}

// עבור uploads עם progress tracking
export const uploadFileWithProgress = async (file: FormData, onProgress?: (progress: number) => void) => {
  return apiPost<UploadResult>('/upload', file, {
    headers: { 'Content-Type': 'multipart/form-data' },
    timeout: 300000, // 5 דקות
    onUploadProgress: onProgress ? (progressEvent) => {
      const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total)
      onProgress(progress)
    } : undefined
  })
}

// עבור real-time data עם short timeout
export const getRealTimeData = async () => {
  return apiGet<RealTimeData>('/realtime', {
    timeout: 3000, // 3 שניות בלבד
    safe: true,
    fallback: { timestamp: Date.now(), data: 'offline' }
  })
}
```

## מתי להשתמש בכל אפשרות? 🎯

### 🔴 **ברירת מחדל (זורק שגיאה)**
**מתי?** כשצריך לדעת שמשהו נכשל
- Form submissions
- Critical operations  
- Data validation
- User actions שדורשות feedback

```typescript
// המשתמש צריך לדעת אם השמירה נכשלה
const saveUser = await apiPost<User>('/user', userData)

// עדכון קריטי שחייב להצליח
const updatePayment = await apiPut<Payment>('/payment/123', paymentData)
```

### 🟡 **Safe Mode (עם fallback)**
**מתי?** כשנרצה להמשיך גם אם יש שגיאה
- Loading data for display
- Optional features
- Background operations
- Recommendations, statistics

```typescript
// אם ההמליצות נכשלות, פשוט לא נציג אותן
const recommendations = await apiGet<Item[]>('/recommendations', {
  safe: true,
  fallback: []
})

// נתונים סטטיסטיים שלא קריטיים
const stats = await apiGet<Stats>('/dashboard/stats', {
  safe: true,
  fallback: { visits: 0, users: 0 }
})
```

### 🔵 **Public (ללא authentication)**
**מתי?** כשלא צריך להיות מחובר
- Public APIs
- Before login
- Static content
- Landing pages

```typescript
// נתונים ציבוריים
const publicStats = await apiGet<Stats>('/public/stats', {
  requireAuth: false
})

// לפני התחברות
const loginOptions = await apiGet<LoginOptions>('/auth/options', {
  requireAuth: false
})
```

### 🟣 **שילובים מתקדמים**
```typescript
// נתונים ציבוריים + safe
const publicData = await apiGet<Data>('/public/optional-data', {
  requireAuth: false,
  safe: true,
  fallback: null
})

// עם timeout מותאם אישית
const slowData = await apiGet<Data>('/slow-endpoint', {
  timeout: 30000,
  safe: true,
  fallback: { status: 'timeout' }
})

// עם headers מיוחדים
const apiData = await apiGet<Data>('/api/data', {
  headers: { 'X-API-Version': 'v2' },
  safe: true,
  fallback: []
})
```

## השוואה: לפני VS אחרי

### ❌ **לפני - בלבול ואי עקביות:**
```typescript
// צריך לזכור איזה פונקציה להשתמש
const users = await apiGet<User[]>('/users')           // זורק שגיאה
const payments = await safeGetPaginated<Payment>(...) // לא זורק שגיאה
const stats = await apiGetPublic<Stats>('/stats')     // public + לא זורק
const data = await safeApiGet<Data>('/data', {})      // safe בלבד
const public2 = await apiPostPublic<any>('/contact')  // public POST

// 5 פונקציות שונות, 5 דרכי שימוש שונות!
```

### ✅ **אחרי - עקביות וגמישות:**
```typescript
// הכל באותו פורמט, אפשרויות גמישות
const users = await apiGet<User[]>('/users')                              // ברירת מחדל
const payments = await apiGet<PaginatedResponse<Payment>>('/payments?page=1', { safe: true, fallback: { data: [], total: 0, page: 1, totalPages: 0 } })
const stats = await apiGet<Stats>('/stats', { requireAuth: false })      // public
const data = await apiGet<Data>('/data', { safe: true, fallback: {} })   // safe
const contact = await apiPost<any>('/contact', formData, { requireAuth: false }) // public POST

// פונקציה אחת, אפשרויות אינסופיות!
```

## סיכום התרגום

הגישה החדשה שלנו נותנת לנו:
- ✅ **עקביות מלאה** - אותו API לכל הפונקציות
- ✅ **גמישות מקסימלית** - שילוב כל האפשרויות בקריאה אחת  
- ✅ **קוד נקי הרבה יותר** - פחות פונקציות לזכור
- ✅ **Type Safety מושלם** - כל האפשרויות מוגדרות בממשק אחד
- ✅ **ביצועים טובים יותר** - אופטימיזציות מותאמות אישית
- ✅ **תחזוקה פשוטה** - שינוי במקום אחד משפיע על הכל
- ✅ **תאימות לאחור** - הקוד הישן עדיין עובד

**התוצאה:** מערכת API אחידה, חזקה וגמישה שמקלה על הפיתוח והתחזוקה! 🚀

---

## Migration Guide - איך לעבור לגישה החדשה?

### קוד ישן שעדיין עובד (תאימות לאחור):
```typescript
// הפונקציות האלה עדיין עובדות!
const users = await safeGetPaginated<User>('/users', 1)
const data = await safeApiGet<Data>('/data', {})
const public = await apiGetPublic<Stats>('/stats')
```

### קוד חדש מומלץ:
```typescript
// עדיף להשתמש בגישה החדשה
const users = await apiGet<PaginatedResponse<User>>('/users?page=1', { safe: true, fallback: { data: [], total: 0, page: 1, totalPages: 0 } })
const data = await apiGet<Data>('/data', { safe: true, fallback: {} })
const public = await apiGet<Stats>('/stats', { requireAuth: false })
```

**המעבר הדרגתי מומלץ - אין צורך לשנות הכל בבת אחת!** 📈
