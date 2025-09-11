# תיעוד בדיקות PaymentCreditLink Controller

## סקירה כללית
קובץ הבדיקות של PaymentCreditLink Controller מכיל בדיקות מקיפות לניהול קישורים בין תשלומים חודשיים ופרטי אשראי. הבדיקות בודקות את התנהגות הבקר בתרחישים שונים כולל יצירה, קריאה, עדכון ומחיקה של קישורי תשלום-אשראי. הבדיקות כוללות אימות קיום התשלומים החודשיים ופרטי האשראי, מניעת כפילויות, תמיכה בעמוד, וטיפול בשגיאות. המערכת מבטיחה שלמות יחסי הנתונים בין הישויות השונות.

## תיעוד פונקציות

### should create a payment credit link successfully
בודקת יצירה מוצלחת של קישור תשלום-אשראי עם אימות קיום כל הישויות הקשורות.

### should return 404 if monthly payment does not exist
בודקת טיפול בשגיאה כאשר התשלום החודשי שהקישור מתייחס אליו לא קיים במערכת.

### should return 404 if credit details does not exist
בודקת טיפול בשגיאה כאשר פרטי האשראי שהקישור מתייחס אליהם לא קיימים במערכת.

### should return 409 if monthly payment already exists in payment credit link
בודקת מניעת יצירת קישור כפול לאותו תשלום חודשי והחזרת שגיאת conflict.

### should handle sanitization errors
בודקת טיפול בשגיאות בתהליך ניקוי ואימות הנתונים לפני יצירת הקישור.

### should handle database errors during creation
בודקת טיפול בשגיאות מסד נתונים במהלך יצירת קישור התשלום-אשראי.

### should retrieve all payment credit links with pagination
בודקת אחזור כל קישורי התשלום-אשראי עם תמיכה בעמוד והחזרת מידע על מספר עמודים וסך הקישורים.

### should handle missing page parameter (default to page 1)
בודקת טיפול במקרה שלא סופק פרמטר עמוד ושימוש בברירת מחדל של עמוד 1.

### should handle errors during payment credit links retrieval
בודקת טיפול בשגיאות מסד נתונים במהלך אחזור רשימת קישורי התשלום-אשראי.

### should handle invalid page parameter
בודקת טיפול בפרמטר עמוד לא תקין ושימוש בברירת מחדל.

### should retrieve a payment credit link by ID
בודקת אחזור קישור תשלום-אשראי ספציפי לפי מזהה כולל אימות קיום הקישור.

### should return 404 if payment credit link not found
בודקת החזרת שגיאת 404 כאשר הקישור המבוקש לא קיים במערכת.

### should handle sanitization errors [getPaymentCreditLinkId]
בודקת טיפול בשגיאות בתהליך ניקוי ואימות מזהה הקישור.

### should handle errors during payment credit link retrieval by ID
בודקת טיפול בשגיאות מסד נתונים במהלך אחזור הקישור לפי מזהה.

### should retrieve payment credit links by monthly payment ID
בודקת אחזור כל הקישורים השייכים לתשלום חודשי ספציפי עם תמיכה בעמוד.

### should return 404 if monthly payment does not exist [getPaymentCreditLinksByMonthlyPaymentId]
בודקת החזרת שגיאת 404 כאשר התשלום החודשי המבוקש לא קיים בטבלת הקישורים.

### should handle missing page parameter (default to page 1) [getPaymentCreditLinksByMonthlyPaymentId]
בודקת טיפול במקרה שלא סופק פרמטר עמוד באחזור קישורים לפי תשלום חודשי.

### should handle errors during retrieval by monthly payment ID
בודקת טיפול בשגיאות מסד נתונים במהלך אחזור קישורים לפי מזהה תשלום חודשי.

### should retrieve payment credit links by credit details ID
בודקת אחזור כל הקישורים השייכים לפרטי אשראי ספציפיים עם תמיכה בעמוד.

### should return 404 if credit details does not exist [getPaymentCreditLinksByCreditDetailsId]
בודקת החזרת שגיאת 404 כאשר פרטי האשראי המבוקשים לא קיימים בטבלת הקישורים.

### should handle missing page parameter (default to page 1) [getPaymentCreditLinksByCreditDetailsId]
בודקת טיפול במקרה שלא סופק פרמטר עמוד באחזור קישורים לפי פרטי אשראי.

### should handle errors during retrieval by credit details ID
בודקת טיפול בשגיאות מסד נתונים במהלך אחזור קישורים לפי מזהה פרטי אשראי.

### should update a payment credit link successfully
בודקת עדכון מוצלח של קישור תשלום-אשראי כולל אימות כל הישויות הקשורות.

### should return 404 if monthly payment does not exist during update
בודקת טיפול בשגיאה כאשר התשלום החודשי לא קיים במהלך עדכון הקישור.

### should return 409 if monthly payment already exists during update
בודקת מניעת עדכון שיוביל לכפילות של תשלום חודשי בקישורים.

### should handle ID sanitization errors
בודקת טיפול בשגיאות ניקוי מזהה הקישור במהלך עדכון.

### should handle body sanitization errors
בודקת טיפול בשגיאות ניקוי נתוני הגוף במהלך עדכון קישור.

### should handle database errors during update
בודקת טיפול בשגיאות מסד נתונים במהלך עדכון הקישור בפועל.

### should delete a payment credit link successfully
בודקת מחיקה מוצלחת של קישור תשלום-אשראי כולל אימות קיום הקישור לפני המחיקה.

### should return 404 if payment credit link does not exist
בודקת החזרת שגיאת 404 כאשר מנסים למחוק קישור שלא קיים במערכת.

### should handle sanitization errors [deletePaymentCreditLink]
בודקת טיפול בשגיאות ניקוי מזהה הקישור במהלך מחיקה.

### should handle errors during deletion
בודקת טיפול בשגיאות מסד נתונים במהלך מחיקת הקישור בפועל.

### should handle errors during existence check
בודקת טיפול בשגיאות מסד נתונים במהלך בדיקת קיום הקישור לפני המחיקה.
