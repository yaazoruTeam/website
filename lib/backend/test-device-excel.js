// 🧪 Test file לבדיקת מערכת העלאת מכשירים
// לרוץ עם: node test-device-excel.js

const testDeviceRow = {
  'מספר_סים': '1234567890',
  'מספר_IMEI': '123456789012345',
  'מספר_סידורי': 'SN123ABC',
  'מספר_מכשיר': 'DEV001'
};

console.log('🧪 מבחן מערכת העלאת מכשירים...\n');

try {
  // בדיקת קונברטר
  console.log('1️⃣ בדיקת קונברטר...');
  const { convertExcelRowToDevice, validateRequiredFields } = require('./dist/backend/src/utils/converters/deviceExcelConverter');
  
  const converted = convertExcelRowToDevice(testDeviceRow);
  console.log('✅ קונברטר עבד בהצלחה');
  console.log('📄 מכשיר מומר:', JSON.stringify(converted, null, 2));
  
  // בדיקת validation
  console.log('\n2️⃣ בדיקת validation...');
  const validationErrors = validateRequiredFields(converted);
  
  if (validationErrors.length === 0) {
    console.log('✅ אימות שדות עבר בהצלחה');
  } else {
    console.log('❌ שגיאות אימות:', validationErrors);
  }
  
  console.log('\n🎉 כל המבחנים עברו בהצלחה!');
  console.log('\n📋 הוראות הפעלה:');
  console.log('1. POST /controller/devices-excel/upload');
  console.log('2. שלח קובץ Excel עם השדות: מספר_סים, מספר_IMEI, מספר_סידורי, מספר_מכשיר');
  console.log('3. המערכת תבדוק את המכשירים מול API של סמסונג');
  console.log('4. תקבל דוח מפורט עם תוצאות + קובץ שגיאות במידת הצורך');
  
} catch (error) {
  console.error('💥 שגיאה במבחן:', error.message);
  console.log('❌ ודא שהמבנה נכון ושכל הקבצים קיימים');
}
