# תיעוד בדיקות Excel Controller

## סקירה כללית
קובץ הבדיקות של Excel Controller מכיל בדיקות מקיפות לפונקציונליות של עיבוד קבצי Excel. הבדיקות בודקות את התנהגות הבקר בתרחישים שונים כולל עיבוד מוצלח של קבצים, טיפול בשגיאות, וניהול קבצים זמניים. הבדיקות משתמשות ב-mocking של תלויות חיצוניות כמו פונקציות קריאת Excel ועיבוד נתונים.

## תיעוד פונקציות

### should process Excel file successfully without errors
בודקת עיבוד מוצלח של קובץ Excel ללא שגיאות וחזרת תגובה חיובית עם הנתונים המעובדים.

### should process Excel file successfully with errors and generate error file
בודקת עיבוד קובץ Excel עם שגיאות חלקיות ויצירת קובץ שגיאות מתאים.

### should return 400 if no file is uploaded
בודקת החזרת שגיאת 400 כאשר לא הועלה קובץ בבקשה.

### should handle errors during Excel file reading
בודקת טיפול בשגיאות במהלך קריאת קובץ Excel ועברת השגיאה ל-next middleware.

### should handle errors during data processing
בודקת טיפול בשגיאות במהלך עיבוד הנתונים לאחר קריאת הקובץ בהצלחה.

### should handle file deletion errors after successful processing
בודקת טיפול בשגיאות מחיקת קובץ זמני לאחר עיבוד מוצלח של הנתונים.

### should handle file deletion errors after processing error
בודקת טיפול בשגיאות מחיקת קובץ זמני לאחר כישלון בעיבוד הנתונים.

### should handle large Excel files and return only first 3 rows as sample
בודקת טיפול בקבצי Excel גדולים והחזרת 3 שורות ראשונות כדוגמה בתגובה.

### should not delete file if req.file is undefined during error handling
בודקת שלא מתבצעת מחיקת קובץ כאשר req.file לא מוגדר במהלך טיפול בשגיאות.

### should handle empty Excel file
בודקת טיפול בקובץ Excel ריק והחזרת תגובה מתאימה עם מונים אפס.

### should handle mixed success and error results correctly
בודקת טיפול נכון בתוצאות מעורבות של הצלחות ושגיאות בעיבוד הנתונים.
