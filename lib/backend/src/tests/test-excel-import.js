// מבחן מהיר לקריאת נתוני אקסל
const { CustomerDeviceExcel } = require('./dist/model');
const { convertFlatRowToModel } = require('./dist/utils/converters/customerDeviceExcelConverter');

// דוגמה לנתונים מקובץ אקסל
const testRow = {
  first_name: 'יוסי',
  last_name: 'כהן',
  id_number: '123456789',
  phone_number: '052-1234567',
  email: 'yossi@example.com',
  city: 'תל אביב',
  address: 'רחוב הרצל 1',
  device_number: 'DEV123',
  SIM_number: 'SIM456',
  IMEI_1: 'IMEI789',
  model: 'Samsung Galaxy',
  serialNumber: 'SN123456',
  plan: 'Premium',
  receivedAt: '01/01/2024'
};

try {
  console.log('🧪 מבחן קונברטר...');
  const converted = convertFlatRowToModel(testRow);
  console.log('✅ קונברטר עבד בהצלחה');
  console.log('📄 נתונים מומרים:', JSON.stringify(converted, null, 2));
  
  console.log('\n🧪 מבחן sanitize...');
  const sanitized = CustomerDeviceExcel.sanitize(converted, true);
  console.log('✅ Sanitize עבד בהצלחה');
  console.log('🧹 נתונים מנוקים:', JSON.stringify(sanitized, null, 2));
  
  console.log('\n🎉 כל המבחנים עברו בהצלחה!');
  
} catch (error) {
  console.error('❌ שגיאה במבחן:', error.message);
  console.error(error.stack);
}
