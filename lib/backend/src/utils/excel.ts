import * as XLSX from 'xlsx';
import * as path from 'path';


const readExcelFile = (/*filePath: string*/) => {
    try {
        console.log('read excel file');
        const filePath = path.resolve(__dirname, '../../lib/deviceToDonator.xlsx');
        console.log('Absolute path to file:', filePath);
        // קריאת קובץ ה-Excel
        const workbook = XLSX.readFile(filePath);
        console.log('----------------workbook-----------------');

        // console.log(workbook);

        // בחירת הגיליון הראשון
        const sheetName = workbook.SheetNames[0];
         console.log('----------------sheetName-----------------');

        // console.log(sheetName);

        const sheet = workbook.Sheets[sheetName];
        console.log('----------------sheet-----------------');

        // console.log(sheet);


        // המרת הגיליון ל-JSON
        const data = XLSX.utils.sheet_to_json(sheet);
        console.log('----------------data-----------------');

        // console.log(data);

        return data;
    } catch (error) {
        console.error('Error reading Excel file:', error);
        throw error;
    }
};

export { readExcelFile }
