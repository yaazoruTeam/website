# תיעוד בדיקות Widely Controllers

## סקירה כללית
קובץ הבדיקות של Widely Controllers מכיל בדיקות מקיפות לאינטגרציה עם API של Widely לניהול מכשירים סלולריים. הבדיקות בודקות פעולות מורכבות כמו ניהול מכשירים, הקפאה והפשרה, שינוי רשתות, ניהול חבילות, איפוס מכשירים, ושליחת הגדרות APN. הבדיקות מתחלקות לשתי קבוצות עיקריות: Actions Controllers לפעולות שינוי, ו-Get Actions Controllers לפעולות שליפת מידע. המערכת משתמשת ב-mocking של קריאות API חיצוניות ובדיקות אימות פרמטרים.

## תיעוד פונקציות

### should terminate mobile successfully
בודקת ביטול מכשיר סלולרי בהצלחה עם אימות פרמטרים נדרשים וקריאה ל-API של Widely.

### should handle validation errors [terminateMobile]
בודקת טיפול בשגיאות אימות כאשר פרמטרים נדרשים חסרים או לא תקינים.

### should handle API errors [terminateMobile]
בודקת טיפול בשגיאות חיבור או תקשורת עם API החיצוני של Widely.

### should reset VM pincode successfully
בודקת איפוס קוד PIN של תא קולי (Voicemail) למכשיר סלולרי בהצלחה.

### should handle mobile action errors
בודקת טיפול בשגיאות במהלך ביצוע פעולות על מכשירים סלולריים.

### should change network to pelephone_and_partner successfully
בודקת שינוי רשת לפלאפון ושותפים בהצלחה עם מיפוי נכון לפעולת API.

### should change network to hot_and_partner successfully
בודקת שינוי רשת לhot ושותפים בהצלחה עם מיפוי נכון לפעולת API.

### should change network to pelephone only successfully
בודקת שינוי רשת לפלאפון בלבד בהצלחה עם מיפוי נכון לפעולת API.

### should handle case insensitive network names
בודקת טיפול בשמות רשתות שאינם תלויים באותיות גדולות/קטנות.

### should return 400 for invalid network name
בודקת החזרת שגיאת 400 עבור שמות רשתות לא תקינים או לא נתמכים.

### should get base packages successfully
בודקת אחזור חבילות בסיס בהצלחה מה-API של Widely עם סינון לפי סוג חבילה.

### should get extra packages successfully
בודקת אחזור חבילות תוספת בהצלחה מה-API של Widely עם סינון לפי סוג חבילה.

### should return 400 for invalid package_types
בודקת החזרת שגיאת 400 עבור סוגי חבילות לא תקינים או לא נתמכים.

### should change package successfully
בודקת שינוי חבילה למכשיר סלולרי בהצלחה עם אימות תוצאת API.

### should return 400 for invalid package_id
בודקת החזרת שגיאת 400 עבור מזהה חבילה לא תקין או לא נמרי.

### should return 400 for missing package_id
בודקת החזרת שגיאת 400 כאשר מזהה החבילה חסר או null.

### should reset device comprehensively
בודקת איפוס מכשיר מקיף הכולל ביטול המכשיר הקיים ויצירת מכשיר חדש.

### should handle reset with undefined error codes
בודקת טיפול במקרים שבהם קודי שגיאה לא מוגדרים בתהליך איפוס המכשיר.

### should send APN successfully
בודקת שליחת הגדרות APN למכשיר סלולרי בהצלחה.

### should add one-time package successfully
בודקת הוספת חבילה חד-פעמית למכשיר סלולרי בהצלחה עם אימות פרמטרים.

### should return 400 for invalid package_id [addOneTimePackage]
בודקת החזרת שגיאת 400 עבור מזהה חבילה לא תקין בהוספת חבילה חד-פעמית.

### should freeze mobile successfully
בודקת הקפאת מכשיר סלולרי בהצלחה עם שליחת פעולה מתאימה.

### should unfreeze mobile successfully
בודקת הפשרת מכשיר סלולרי בהצלחה עם שליחת פעולה מתאימה.

### should return 400 for invalid action [freezeUnFreezeMobile]
בודקת החזרת שגיאת 400 עבור פעולות הקפאה/הפשרה לא תקינות.

### should lock IMEI successfully
בודקת נעילת IMEI של מכשיר סלולרי בהצלחה.

### should unlock IMEI successfully
בודקת שחרור נעילת IMEI של מכשיר סלולרי בהצלחה.

### should return 400 for non-boolean action [updateImeiLockStatus]
בודקת החזרת שגיאת 400 כאשר פעולת נעילת IMEI אינה ערך בוליאני.

### should search users successfully
בודקת חיפוש משתמשים בהצלחה והחזרת תוצאות מתאימות.

### should return 404 when no users found
בודקת החזרת שגיאת 404 כאשר לא נמצאו משתמשים בחיפוש.

### should return 404 when multiple users found
בודקת החזרת שגיאת 404 כאשר נמצאו משתמשים מרובים (אמביגיות).

### should return 404 when user data is invalid
בודקת החזרת שגיאת 404 כאשר נתוני המשתמש לא תקינים או פגומים.

### should get mobiles successfully
בודקת אחזור רשימת מכשירים סלולריים בהצלחה עבור משתמש ספציפי.

### should return 404 when no mobiles found
בודקת החזרת שגיאת 404 כאשר לא נמצאו מכשירים סלולריים עבור המשתמש.

### should get mobile info successfully with data property
בודקת אחזור מידע על מכשיר סלולרי בהצלחה כאשר התגובה מכילה מאפיין data.

### should get mobile info successfully with direct object response
בודקת אחזור מידע על מכשיר סלולרי בהצלחה כאשר התגובה היא אובייקט ישיר.

### should handle error_code !== 200 [getMobileInfo]
בודקת טיפול במקרים שבהם קוד השגיאה של API אינו 200 (הצלחה).

### should handle empty data response [getMobileInfo]
בודקת טיפול בתגובות ריקות או חסרות נתונים באחזור מידע מכשיר.

### should handle empty direct object response [getMobileInfo]
בודקת טיפול בתגובות אובייקט ישיר ריקות באחזור מידע מכשיר.

### should get all user data successfully
בודקת אחזור כל הנתונים של משתמש בהצלחה כולל מידע על המכשירים.

### should handle SIM number not found
בודקת טיפול במקרים שבהם מספר SIM לא נמצא במערכת.

### should handle no devices found for user
בודקת טיפול במקרים שבהם לא נמצאו מכשירים עבור המשתמש.

### should handle missing domain_user_id
בודקת טיפול במקרים שבהם מזהה המשתמש בדומיין חסר או לא תקין.

### should handle missing endpoint_id
בודקת טיפול במקרים שבהם מזהה נקודת הקצה (endpoint) חסר או לא תקין.
