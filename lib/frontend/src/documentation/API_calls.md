# API Architecture - תיעוד הארכיטקטורה הנוכחית

## הארכיטקטורה שלנו

בחרנו בגישה **functional** פשוטה ונקייה עם פונקציות עצמאיות במקום מחלקות מורכבות.

## למה בחרנו ב-apiHelpers?

### ✅ **יתרונות של הגישה הפונקציונלית:**
- **פשוט לשימוש** - קריאה ישירה לפונקציה
- **קל להבנה** - אין צורך להבין OOP
- **מהיר לכתיבה** - פחות boilerplate
- **functional programming** - גישה נקייה ומודרנית

### ❌ **חסרונות של גישת המחלקות:**
- **מורכב יותר** - צריך להבין OOP
- **יותר מילולי** - `apiClient.get()` במקום `apiGet()`
- **פחות גמיש** - קשה יותר לשנות

## הבעיות שפתרנו

### 1. קוד חוזר בטיפול בטוקן
**לפני:**
```typescript
const newToken = await handleTokenRefresh();
if (!newToken) {
  return { data: [], total: 0, totalPages: 0 };
}
const token = localStorage.getItem("token");
if (!token) {
  throw new Error("No token found!");
}
```

**אחרי:**
```typescript
// הכל מרוכז בפונקציה אחת
const headers = await getAuthHeaders()
```

### 2. קוד חוזר בבקשות HTTP
**לפני:**
```typescript
const response: AxiosResponse<Customer.Model> = await axios.get(url, {
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  },
})
```

**אחרי:**
```typescript
// בקשה פשוטה ונקייה
return await apiClient.get<Customer.Model>(url)
```

## הפתרון שלנו

### 1. Token Manager (`core/tokenManager.ts`)
מנהל את כל הטיפול בטוקנים במקום אחד:

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

### 2. API Helpers (`core/apiHelpers.ts`)
פונקציות פשוטות וישירות לכל בקשות ה-HTTP:

```typescript
// בקשות עם טוקן
export const apiGet = async <T>(url: string): Promise<T> => {
  const headers = await getAuthHeaders()
  const response = await axios.get(`${baseURL}${url}`, { headers })
  return response.data
}

export const apiPost = async <T>(url: string, data?: any): Promise<T> => {
  const headers = await getAuthHeaders()
  const response = await axios.post(`${baseURL}${url}`, data, { headers })
  return response.data
}

// בקשות ללא טוקן
export const apiGetPublic = async <T>(url: string): Promise<T> => {
  const response = await axios.get(`${baseURL}${url}`)
  return response.data
}

// בקשות בטוחות עם fallback
export const safeApiGet = async <T>(url: string, fallback: T): Promise<T> => {
  try {
    return await apiGet<T>(url)
  } catch (error) {
    console.error(`Safe GET failed for ${url}:`, error)
    return fallback
  }
}

// pagination מובנה
export const safeGetPaginated = async <T>(
  endpoint: string, 
  page: number = 1
): Promise<PaginatedResponse<T>> => {
  try {
    return await apiGet<PaginatedResponse<T>>(`${endpoint}?page=${page}`)
  } catch (error) {
    return { data: [], total: 0, page, totalPages: 0 }
  }
}
```

## היתרונות של הארכיטקטורה שלנו

### 1. פשטות מקסימלית
```typescript
// פשוט ונקי
const users = await apiGet<User[]>('/users')
const user = await apiPost<User>('/users', userData)
```

### 2. ניהול שגיאות מובנה
כל הפונקציות כוללות טיפול בשגיאות מובנה

### 3. Safe functions עם fallback
```typescript
// אם יש שגיאה, מחזיר array ריק במקום לקרוס
const users = await safeGetPaginated<User>('/users', 1)
```

### 4. Type Safety מלא
שימוש ב-Generics מבטיח בטיחות טיפוסים

### 5. אין learning curve
כל מפתח יכול להשתמש מיד - זה סתם פונקציות!

### 6. גמישות מלאה
קל להוסיף פונקציות חדשות או לשנות קיימות

## דוגמאות לשימוש

### בקשות בסיסיות:
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

### בקשות ללא טוקן:
```typescript
import { apiGetPublic, apiPostPublic } from './api/core/apiHelpers'

// דרך ללא אימות
const publicData = await apiGetPublic<any>('/public/data')
const result = await apiPostPublic<any>('/public/contact', formData)
```

### בקשות בטוחות עם fallback:
```typescript
import { safeApiGet, safeGetPaginated } from './api/core/apiHelpers'

// אם יש שגיאה, מחזיר array ריק
const users = await safeGetPaginated<User>('/users', 1)

// אם יש שגיאה, מחזיר fallback object
const user = await safeApiGet<User>('/users/123', {} as User)
```

### Pagination:
```typescript
import { getPaginatedData, safeGetPaginated } from './api/core/apiHelpers'

// עם error handling מובנה
const result = await safeGetPaginated<User>('/users', 1)
// result: { data: User[], total: number, page: number, totalPages: number }

// ללא error handling (יזרוק exception)
const result2 = await getPaginatedData<User>('/users', 2)
```

## בניית API חדש

כשרוצים להוסיף endpoint חדש, פשוט יוצרים פונקציה:

```typescript
// api/newFeatureApi.ts
import { apiGet, apiPost, safeGetPaginated } from './core/apiHelpers'
import { NewFeature } from '@model'

const ENDPOINT = '/newFeature'

export const getNewFeatures = async (page: number = 1) => {
  return safeGetPaginated<NewFeature.Model>(ENDPOINT, page)
}

export const getNewFeatureById = async (id: string) => {
  return apiGet<NewFeature.Model>(`${ENDPOINT}/${id}`)
}

export const createNewFeature = async (data: NewFeature.Model) => {
  return apiPost<NewFeature.Model>(ENDPOINT, data)
}
```

זהו! פשוט, נקי וקל להבנה.

## סיכום

הגישה שלנו עם `apiHelpers` היא:
- **📝 פשוטה** - סתם פונקציות, בלי מחלקות מורכבות
- **⚡ מהירה** - פחות קוד לכתיבה
- **🔧 גמישה** - קל לשנות ולהוסיף
- **👥 נגישה** - כל מפתח מבין מיד
- **🛡️ בטוחה** - Type safety מלא עם TypeScript
- **🔄 עקבית** - כל הבקשות דרך אותן פונקציות
- **⚠️ עמידה** - Safe functions עם fallback

**התוצאה: קוד נקי, פשוט ויעיל שקל לתחזוקה ופיתוח!** ✨
