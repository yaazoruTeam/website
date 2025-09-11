# תיעוד בדיקות MonthlyPaymentManagement Controller

## סקירה כללית
קובץ הבדיקות של MonthlyPaymentManagement Controller מכיל בדיקות מתקדמות לניהול מורכב של תשלומים חודשיים. הבדיקות בודקות פעולות טרנזקציוניות מורכבות הכוללות יצירה ועדכון של תשלומים חודשיים יחד עם פרטי אשראי, קישורי תשלום, תשלומים ופריטים. הבדיקות מתמקדות בשלמות הנתונים, ניהול טרנזקציות, rollback במקרי שגיאה, ואימות תקינות כל הישויות הקשורות. המערכת משתמשת בטרנזקציות מסד נתונים להבטחת אטומיות הפעולות.

## תיעוד פונקציות

### should create a monthly payment successfully
בודקת יצירה מוצלחת של תשלום חודשי מורכב הכולל כל הישויות הקשורות ואישור הטרנזקציה.

### should return 404 if customer does not exist
בודקת טיפול בשגיאה ו-rollback של הטרנזקציה כאשר הלקוח לא קיים במערכת.

### should return 409 if token already exists
בודקת זיהוי כפילות טוקן ו-rollback של הטרנזקציה במקרה של קיום טוקן בפלטפורמה.

### should handle sanitization errors
בודקת טיפול בשגיאות ניקוי הנתונים ו-rollback של הטרנזקציה במקרה של כישלון.

### should handle database errors during monthly payment creation
בודקת טיפול בשגיאות מסד נתונים ו-rollback במהלך יצירת התשלום החודשי.

### should handle database errors during credit details creation
בודקת טיפול בשגיאות מסד נתונים ו-rollback במהלך יצירת פרטי האשראי.

### should handle payments array with null values
בודקת סינון וטיפול נכון במערך תשלומים המכיל ערכי null ועיבוד רק הערכים התקינים.

### should handle items array with null values
בודקת סינון וטיפול נכון במערך פריטים המכיל ערכי null ועיבוד רק הערכים התקינים.

### should update a monthly payment successfully
בודקת עדכון מוצלח של תשלום חודשי מורכב הכולל עדכון כל הישויות הקשורות.

### should return 404 if customer does not exist [updateMonthlyPayment]
בודקת טיפול בשגיאה ו-rollback כאשר הלקוח לא קיים במהלך עדכון.

### should return 404 if monthly payment does not exist
בודקת טיפול בשגיאה ו-rollback כאשר התשלום החודשי לא קיים במהלך עדכון.

### should return 409 if token already exists and is different from current
בודקת זיהוי כפילות טוקן ו-rollback כאשר הטוקן החדש שונה מהקיים וכבר קיים במערכת.

### should allow token update if token is the same as current
בודקת אפשרות עדכון טוקן כאשר הטוקן החדש זהה לטוקן הקיים במערכת.

### should handle ID sanitization errors
בודקת טיפול בשגיאות ניקוי מזהה התשלום החודשי במהלך עדכון.

### should handle body sanitization errors
בודקת טיפול בשגיאות ניקוי נתוני הגוף במהלך עדכון תשלום חודשי.

### should handle database errors during monthly payment update
בודקת טיפול בשגיאות מסד נתונים ו-rollback במהלך עדכון התשלום החודשי.

### should handle errors during credit details update
בודקת טיפול בשגיאות מסד נתונים ו-rollback במהלך עדכון פרטי האשראי.

### should handle errors during items update
בודקת טיפול בשגיאות מסד נתונים ו-rollback במהלך עדכון הפריטים הקשורים.
