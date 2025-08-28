# תיעוד בדיקות MonthlyPayment Controller

## סקירה כללית
קובץ הבדיקות של MonthlyPayment Controller מכיל בדיקות מקיפות לניהול תשלומים חודשיים במערכת. הבדיקות בודקות את התנהגות הבקר בתרחישים שונים כולל יצירה, קריאה, עדכון ומחיקה של תשלומים חודשיים. הבדיקות כוללות אימות קיום לקוחות, חיפוש לפי סטטוס וארגון, תמיכה בעמוד, וטיפול בשגיאות. הבדיקות משתמשות ב-mocking של מודל הנתונים ופונקציות הנתונים.

## תיעוד פונקציות

### should create a new monthly payment successfully
בודקת יצירה מוצלחת של תשלום חודשי חדש עם אימות קיום הלקוח ובדיקת כל השדות הנדרשים.

### should handle customer not found error
בודקת טיפול בשגיאה כאשר הלקוח שהתשלום החודשי מקושר אליו לא קיים במערכת.

### should handle sanitization body errors
בודקת טיפול בשגיאות בתהליך הניקוי והאימות של נתוני הגוף בבקשת יצירת תשלום חודשי.

### should handle sanitize model errors
בודקת טיפול בשגיאות בתהליך הניקוי והאימות של המודל לפני יצירת התשלום החודשי.

### should handle database errors during customer existence check
בודקת טיפול בשגיאות מסד נתונים במהלך בדיקת קיום הלקוח.

### should handle database errors during monthly payment creation
בודקת טיפול בשגיאות מסד נתונים במהלך יצירת התשלום החודשי בפועל.

### should retrieve all monthly payments with pagination
בודקת אחזור כל התשלומים החודשיים עם תמיכה בעמוד והחזרת מידע על מספר עמודים ומספר תשלומים כולל.

### should handle missing page parameter (default to page 1)
בודקת טיפול במקרה שלא סופק פרמטר עמוד ושימוש בברירת מחדל של עמוד 1.

### should handle invalid page parameter
בודקת טיפול בפרמטר עמוד לא תקין ושימוש בברירת מחדל.

### should handle errors during monthly payments retrieval
בודקת טיפול בשגיאות מסד נתונים במהלך אחזור רשימת התשלומים החודשיים.

### should handle large page numbers correctly
בודקת חישוב נכון של offset עבור מספרי עמוד גדולים בעמוד.

### should retrieve a monthly payment by ID
בודקת אחזור תשלום חודשי ספציפי לפי מזהה כולל אימות קיום התשלום.

### should return 404 if monthly payment not found
בודקת החזרת שגיאת 404 כאשר התשלום החודשי המבוקש לא קיים במערכת.

### should handle sanitization errors [getMonthlyPaymentId]
בודקת טיפול בשגיאות בתהליך ניקוי ואימות מזהה התשלום החודשי.

### should handle errors during monthly payment existence check
בודקת טיפול בשגיאות מסד נתונים במהלך בדיקת קיום התשלום החודשי.

### should handle errors during monthly payment retrieval by ID
בודקת טיפול בשגיאות מסד נתונים במהלך אחזור התשלום החודשי לפי מזהה.

### should retrieve all monthly payments for a customer
בודקת אחזור כל התשלומים החודשיים השייכים ללקוח ספציפי עם תמיכה בעמוד.

### should return 404 if customer not found [getMonthlyPaymentByCustomerId]
בודקת החזרת שגיאת 404 כאשר הלקוח המבוקש לא קיים במערכת.

### should return 404 if no monthly payments found for customer
בודקת החזרת שגיאת 404 כאשר אין תשלומים חודשיים עבור הלקוח הספציפי.

### should handle missing page parameter (default to page 1) [getMonthlyPaymentByCustomerId]
בודקת טיפול במקרה שלא סופק פרמטר עמוד באחזור תשלומים לפי לקוח.

### should handle sanitization errors [getMonthlyPaymentByCustomerId]
בודקת טיפול בשגיאות ניקוי מזהה הלקוח.

### should handle errors during customer existence check [getMonthlyPaymentByCustomerId]
בודקת טיפול בשגיאות מסד נתונים במהלך בדיקת קיום הלקוח.

### should handle errors during monthly payments retrieval by customer ID
בודקת טיפול בשגיאות מסד נתונים במהלך אחזור תשלומים לפי מזהה לקוח.

### should retrieve monthly payments by valid status (active)
בודקת אחזור תשלומים חודשיים לפי סטטוס פעיל עם אימות תקינות הסטטוס.

### should retrieve monthly payments by valid status (inactive)
בודקת אחזור תשלומים חודשיים לפי סטטוס לא פעיל עם אימות תקינות הסטטוס.

### should reject invalid status value
בודקת דחיית בקשות עם ערכי סטטוס לא תקינים והחזרת שגיאת 400.

### should handle missing page parameter (default to page 1) [getMonthlyPaymentsByStatus]
בודקת טיפול במקרה שלא סופק פרמטר עמוד בחיפוש לפי סטטוס.

### should handle errors during getMonthlyPaymentsByStatus
בודקת טיפול בשגיאות מסד נתונים במהלך אחזור תשלומים לפי סטטוס.

### should retrieve monthly payments by organization
בודקת אחזור תשלומים חודשיים לפי ארגון עם תמיכה בעמוד.

### should return 400 if organization parameter is missing
בודקת החזרת שגיאת 400 כאשר פרמטר הארגון חסר מהבקשה.

### should return 400 if organization parameter is empty
בודקת החזרת שגיאת 400 כאשר פרמטר הארגון ריק.

### should return 404 if no monthly payments found for organization
בודקת החזרת שגיאת 404 כאשר אין תשלומים חודשיים עבור הארגון הספציפי.

### should handle missing page parameter (default to page 1) [getMonthlyPaymentByOrganization]
בודקת טיפול במקרה שלא סופק פרמטר עמוד בחיפוש לפי ארגון.

### should handle errors during monthly payments retrieval by organization
בודקת טיפול בשגיאות מסד נתונים במהלך אחזור תשלומים לפי ארגון.

### should update a monthly payment successfully
בודקת עדכון מוצלח של תשלום חודשי קיים כולל אימות הלקוח הקשור.

### should handle customer not found during update
בודקת טיפול בשגיאה כאשר הלקוח לא קיים במהלך עדכון תשלום חודשי.

### should handle ID sanitization errors [updateMonthlyPayment]
בודקת טיפול בשגיאות ניקוי מזהה התשלום החודשי במהלך עדכון.

### should handle body sanitization errors [updateMonthlyPayment]
בודקת טיפול בשגיאות ניקוי נתוני הגוף במהלך עדכון תשלום חודשי.

### should handle model sanitization errors [updateMonthlyPayment]
בודקת טיפול בשגיאות ניקוי המודל במהלך עדכון תשלום חודשי.

### should handle errors during customer existence check [updateMonthlyPayment]
בודקת טיפול בשגיאות מסד נתונים במהלך בדיקת קיום הלקוח בעדכון.

### should handle errors during monthly payment update
בודקת טיפול בשגיאות מסד נתונים במהלך עדכון התשלום החודשי בפועל.

### should delete a monthly payment successfully
בודקת מחיקה מוצלחת של תשלום חודשי כולל אימות קיום התשלום לפני המחיקה.

### should return 404 if monthly payment does not exist [deleteMonthlyPayment]
בודקת החזרת שגיאת 404 כאשר מנסים למחוק תשלום חודשי שלא קיים במערכת.

### should handle errors during monthly payment existence check [deleteMonthlyPayment]
בודקת טיפול בשגיאות מסד נתונים במהלך בדיקת קיום התשלום החודשי לפני המחיקה.

### should handle errors during deleteMonthlyPayment
בודקת טיפול בשגיאות מסד נתונים במהלך מחיקת התשלום החודשי בפועל.

### should handle sanitization errors [deleteMonthlyPayment]
בודקת טיפול בשגיאות ניקוי מזהה התשלום החודשי במהלך מחיקה.
