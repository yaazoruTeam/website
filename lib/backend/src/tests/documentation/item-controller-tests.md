# תיעוד בדיקות Item Controller

## סקירה כללית
קובץ הבדיקות של Item Controller מכיל בדיקות מקיפות לניהול פריטים הקשורים לתשלומים חודשיים. הבדיקות בודקות את התנהגות הבקר בתרחישים שונים כולל יצירה, קריאה, עדכון ומחיקה של פריטים. הבדיקות כוללות בדיקות תקינות נתונים, טיפול בשגיאות, עמוד, וקישור לתשלומים חודשיים. הבדיקות משתמשות ב-mocking של מודל הנתונים ופונקציות הנתונים.

## תיעוד פונקציות

### should create a new item successfully
בודקת יצירה מוצלחת של פריט חדש עם כל הנתונים הנדרשים ובדיקת הקישור לתשלום חודשי.

### should handle monthly payment not found error
בודקת טיפול בשגיאה כאשר התשלום החודשי שהפריט מקושר אליו לא קיים במערכת.

### should handle sanitization body errors
בודקת טיפול בשגיאות בתהליך הניקוי והאימות של נתוני הגוף בבקשת יצירת פריט.

### should handle sanitize model errors
בודקת טיפול בשגיאות בתהליך הניקוי והאימות של המודל לפני יצירת הפריט.

### should handle database errors during monthly payment existence check
בודקת טיפול בשגיאות מסד נתונים במהלך בדיקת קיום התשלום החודשי.

### should handle database errors during item creation
בודקת טיפול בשגיאות מסד נתונים במהלך יצירת הפריט בפועל.

### should retrieve all items with pagination
בודקת אחזור כל הפריטים עם תמיכה בעמוד והחזרת מידע על מספר עמודים ומספר פריטים כולל.

### should handle missing page parameter (default to page 1)
בודקת טיפול במקרה שלא סופק פרמטר עמוד ושימוש בברירת מחדל של עמוד 1.

### should handle invalid page parameter
בודקת טיפול בפרמטר עמוד לא תקין ושימוש בברירת מחדל.

### should handle errors during items retrieval
בודקת טיפול בשגיאות מסד נתונים במהלך אחזור רשימת הפריטים.

### should handle large page numbers correctly
בודקת חישוב נכון של offset עבור מספרי עמוד גדולים בעמוד.

### should retrieve an item by ID
בודקת אחזור פריט ספציפי לפי מזהה הפריט כולל אימות קיום הפריט.

### should return 404 if item not found
בודקת החזרת שגיאת 404 כאשר הפריט המבוקש לא קיים במערכת.

### should handle sanitization errors
בודקת טיפול בשגיאות בתהליך ניקוי ואימות מזהה הפריט.

### should handle errors during item existence check
בודקת טיפול בשגיאות מסד נתונים במהלך בדיקת קיום הפריט.

### should handle errors during item retrieval by ID
בודקת טיפול בשגיאות מסד נתונים במהלך אחזור הפריט לפי מזהה.

### should retrieve all items for a monthly payment
בודקת אחזור כל הפריטים השייכים לתשלום חודשי ספציפי עם תמיכה בעמוד.

### should return 404 if monthly payment not found
בודקת החזרת שגיאת 404 כאשר התשלום החודשי המבוקש לא קיים במערכת.

### should handle missing page parameter (default to page 1) [getAllItemsByMonthlyPaymentId]
בודקת טיפול במקרה שלא סופק פרמטר עמוד באחזור פריטים לפי תשלום חודשי.

### should handle invalid page parameter [getAllItemsByMonthlyPaymentId]
בודקת טיפול בפרמטר עמוד לא תקין באחזור פריטים לפי תשלום חודשי.

### should handle errors during monthly payment existence check [getAllItemsByMonthlyPaymentId]
בודקת טיפול בשגיאות מסד נתונים במהלך בדיקת קיום התשלום החודשי.

### should handle sanitization errors [getAllItemsByMonthlyPaymentId]
בודקת טיפול בשגיאות ניקוי מזהה התשלום החודשי.

### should handle errors during items retrieval by monthly payment ID
בודקת טיפול בשגיאות מסד נתונים במהלך אחזור פריטים לפי מזהה תשלום חודשי.

### should handle large page numbers correctly [getAllItemsByMonthlyPaymentId]
בודקת חישוב נכון של offset עבור מספרי עמוד גדולים באחזור פריטים לפי תשלום חודשי.

### should update an item successfully
בודקת עדכון מוצלח של פריט קיים כולל אימות התשלום החודשי הקשור.

### should handle monthly payment not found during update
בודקת טיפול בשגיאה כאשר התשלום החודשי לא קיים במהלך עדכון פריט.

### should handle ID sanitization errors
בודקת טיפול בשגיאות ניקוי מזהה הפריט במהלך עדכון.

### should handle body sanitization errors
בודקת טיפול בשגיאות ניקוי נתוני הגוף במהלך עדכון פריט.

### should handle model sanitization errors
בודקת טיפול בשגיאות ניקוי המודל במהלך עדכון פריט.

### should handle errors during monthly payment existence check [updateItem]
בודקת טיפול בשגיאות מסד נתונים במהלך בדיקת קיום התשלום החודשי בעדכון.

### should handle errors during item update
בודקת טיפול בשגיאות מסד נתונים במהלך עדכון הפריט בפועל.

### should delete an item successfully
בודקת מחיקה מוצלחת של פריט כולל אימות קיום הפריט לפני המחיקה.

### should return 404 if item does not exist [deleteItem]
בודקת החזרת שגיאת 404 כאשר מנסים למחוק פריט שלא קיים במערכת.

### should handle errors during item existence check [deleteItem]
בודקת טיפול בשגיאות מסד נתונים במהלך בדיקת קיום הפריט לפני המחיקה.

### should handle errors during deleteItem
בודקת טיפול בשגיאות מסד נתונים במהלך מחיקת הפריט בפועל.

### should handle sanitization errors [deleteItem]
בודקת טיפול בשגיאות ניקוי מזהה הפריט במהלך מחיקה.
