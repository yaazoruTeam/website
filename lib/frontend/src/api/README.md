# API Refactoring - תיעוד השינויים

## מה עשינו?

ביצענו רפקטורינג מקיף לארכיטקטורת ה-API כדי להפוך את הקוד ליותר מקצועי, מתומצת ונקי.

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

## הפתרון החדש

### 1. Token Manager (`core/tokenManager.ts`)
מנהל את כל הטיפול בטוקנים במקום אחד:

```typescript
export const getValidToken = async (): Promise<string> => {
  const newToken = await handleTokenRefresh()
  if (!newToken) {
    throw new Error('Token refresh failed!')
  }
  return localStorage.getItem('token') || ''
}

export const getAuthHeaders = async () => {
  const token = await getValidToken()
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  }
}
```

### 2. API Client (`core/apiClient.ts`)
לקח מרכזי לכל בקשות ה-HTTP:

```typescript
class ApiClient {
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const headers = await getAuthHeaders()
    const response = await this.client.get(url, { ...config, headers })
    return response.data
  }
  
  // בקשות ללא טוקן
  async getPublic<T>(url: string): Promise<T> {
    const response = await this.client.get(url)
    return response.data
  }
}
```

### 3. Base API Class (`core/baseApi.ts`)
מחלקת בסיס לכל ה-APIs:

```typescript
export class BaseApi {
  protected async getPaginated<T>(url: string, page: number = 1): Promise<PaginatedResponse<T>> {
    return await apiClient.get<PaginatedResponse<T>>(`${url}?page=${page}`)
  }
  
  protected async getById<T>(id: string): Promise<T> {
    return await apiClient.get<T>(`${this.baseUrl}/${id}`)
  }
  
  protected async create<T>(data: T): Promise<T> {
    return await apiClient.post<T>(this.baseUrl, data)
  }
}
```

### 4. API Classes
כל API מקבל מחלקה נפרדת:

```typescript
class CustomerApi extends BaseApi {
  constructor() {
    super('customer')
  }

  async getCustomers(page: number = 1): Promise<PaginatedCustomersResponse> {
    return this.getPaginated<Customer.Model>(this.baseUrl, page)
  }

  async getCustomerById(customerId: string): Promise<Customer.Model> {
    return this.getById<Customer.Model>(customerId)
  }
}

export const customerApi = new CustomerApi()
```

## השינויים שביצענו בקבצים

### קבצים שעודכנו:
1. `customerApi.ts` - מ-85 שורות ל-67 שורות
2. `widely.ts` - מ-144 שורות ל-57 שורות  
3. `userApi.ts` - מ-60+ שורות ל-35 שורות
4. `itemsApi.ts` - מ-80+ שורות ל-40 שורות
5. `comment.ts` - מ-115 שורות ל-75 שורות
6. `device.ts` - מ-80+ שורות ל-55 שורות
7. `creditDetails.ts` - מ-60+ שורות ל-40 שורות
8. `monthlyPaymentApi.ts` - חדש, מחליף monhlyPaymentApi.ts
9. `paymentCreditLink.ts` - מ-35 שורות ל-35 שורות
10. `customerDevice.ts` - מ-60+ שורות ל-50 שורות
11. `monthlyPaymentManagement.ts` - עודכן לארכיטקטורה חדשה
12. `payments.ts` - עודכן לארכיטקטורה חדשה

### קבצים חדשים:
1. `core/tokenManager.ts` - ניהול טוקנים מרכזי
2. `core/apiClient.ts` - לקח HTTP מרכזי
3. `core/baseApi.ts` - מחלקת בסיס לכל ה-APIs
4. `index.ts` - ייצוא מרכזי של כל ה-APIs

### קבצים שנמחקו:
1. `token.tsx` - הועבר ל-`core/tokenManager.ts`
2. `monhlyPaymentApi.ts` - הוחלף ב-`monthlyPaymentApi.ts`

## היתרונות של הארכיטקטורה החדשה

### 1. הפחתת קוד משמעותית
- **לפני:** כל פונקציה - 20+ שורות קוד
- **אחרי:** כל פונקציה - 1-3 שורות קוד

### 2. ניהול שגיאות מרכזי
כל השגיאות מטופלות במקום אחד ב-`apiClient`

### 3. Type Safety משופר
שימוש ב-Generics מבטיח בטיחות טיפוסים

### 4. תחזוקה קלה יותר
שינויים נעשים במקום אחד ומשפיעים על כל ה-APIs

### 5. בדיקות יותר קלות
כל API יכול להיבדק בנפרד

### 6. תאימות לאחור
כל הפונקציות הישנות עדיין עובדות

## דוגמה לשימוש

### הדרך הישנה:
```typescript
import { getCustomers, getCustomerById } from './api/customerApi'

const customers = await getCustomers(1)
const customer = await getCustomerById('123')
```

### הדרך החדשה (מומלצת):
```typescript
import { customerApi } from './api'

const customers = await customerApi.getCustomers(1)
const customer = await customerApi.getCustomerById('123')
```

### או עדיין הדרך הישנה (תאימות לאחור):
```typescript
import { getCustomers, getCustomerById } from './api'

const customers = await getCustomers(1)
const customer = await getCustomerById('123')
```

## סיכום

הרפקטורינג הזה הפך את הקוד ל:
- **קצר יותר** - הפחתה של כ-50% בכמות הקוד
- **נקי יותר** - אין יותר קוד חוזר
- **מקצועי יותר** - ארכיטקטורה נקייה ומסודרת
- **גמיש יותר** - קל להוסיף APIs חדשים
- **בטוח יותר** - Type Safety משופר
- **נוח לתחזוקה** - שינויים במקום אחד
