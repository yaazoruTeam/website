import getConnection from "../db/connection";
import db from "../db";
import { Customer, Device, CustomerDevice, CustomerDeviceExcel } from "../model";
import * as XLSX from 'xlsx'; // ✨ שינוי: נדרש בשביל כתיבה
import * as path from 'path'; // ✨ שינוי: נדרש בשביל כתיבה
import { convertFlatRowToModel } from "../utils/converters/customerDeviceExcelConverter";

const processExcelData = async (data: any[]): Promise<void> => {
    const knex = getConnection();
    const errors: any[] = [];
    // const trx = await knex.transaction();

    // console.log('processExcelData=========');

    for (const item of data) {
        // try {
        const isCustomer: boolean = !!(typeof item.first_name === 'string' && item.first_name.trim()) ||
            (typeof item.last_name === 'string' && item.last_name.trim());
        let sanitized: CustomerDeviceExcel.Model | null = null;

        try {
            console.log('--------------------');

            // console.log(item);
            sanitized = await CustomerDeviceExcel.sanitize(convertFlatRowToModel(item), isCustomer);
        }
        catch (err: any) {
            // console.error(`Error in sanitize for item: `, item);
            // console.error('Error: ', err);
            errors.push({
                ...item,
                error: `Sanitize failed: ${err.message || err.toString()}`
            });
            continue;
        }

        // console.log('sanitized: ', sanitized);

        // const customer: Customer.Model = extractCustomer(sanitized);
        // const device: Device.Model = extractDevice(sanitized);



        // console.log('customer: ', customer);
        // console.log('device: ', device);

        if (isCustomer) {
            const trx = await knex.transaction();
            // let existCustomer: Customer.Model;
            try {
                let existCustomer = await db.Customer.findCustomer({ email: sanitized.customer.email, id_number: sanitized.customer.id_number });
                // } catch (err) {
                //     console.error('Error finding customer:', err);
                //     continue;
                // }

                if (!existCustomer) {
                    console.log('i nead creat customer');

                    // try {
                    existCustomer = await db.Customer.createCustomer(sanitized.customer, trx);
                    console.log('Customer created');
                }
                // } catch (err) {
                //     console.error("Error creating customer: ", err);
                //     continue; // המשך ללולאה אם יש שגיאה בהוספת לקוח
                // }
                // } else {
                //     console.log('Customer already exists', existCustomer.customer_id);
                // }

                // let existDevice: Device.Model;
                // try {
                let existDevice = await db.Device.findDevice({ SIM_number: sanitized.device.SIM_number, IMEI_1: sanitized.device.IMEI_1, mehalcha_number: sanitized.device.mehalcha_number, device_number: sanitized.device.device_number });
                // } catch (err) {
                //     console.error('Error finding device:', err);
                //     continue;
                // }

                if (!existDevice) {
                    console.log('i nead creat device');

                    // try {
                    existDevice = await db.Device.createDevice(sanitized.device, trx);
                    console.log('Device created');
                    // } catch (err) {
                    //     console.error("Error creating device: ", err);
                    //     continue; // המשך ללולאה אם יש שגיאה בהוספת מכשיר
                    // }
                }
                //  else {
                //     console.log('Device already exists', existDevice.device_id);
                // }

                let existingRelation
                    // try {
                    = await db.CustomerDevice.findCustomerDevice({ device_id: existDevice.device_id });
                // } catch (err) {
                //     console.error('Error finding customer device:', err);
                //     continue;
                // }

                if (!existingRelation) {
                    console.log('i nead creat customer device');

                    const date: Date = convertExcelDateToJSDate(sanitized.receivedAt);
                    const planEndDate = new Date(date);
                    planEndDate.setFullYear(planEndDate.getFullYear() + 5);
                    // try {
                    await db.CustomerDevice.createCustomerDevice({
                        customerDevice_id: "",
                        customer_id: existCustomer.customer_id,
                        device_id: existDevice.device_id,
                        receivedAt: date,
                        planEndDate: planEndDate,
                        filterVersion: '1.7',
                        deviceProgram: '0'
                    }, trx);
                    console.log('CustomerDevice created');
                }
                await trx.commit();
            } catch (err: any) {
                console.error('Transaction failed:', err);
                console.log("received at: ", sanitized.receivedAt);
                errors.push({
                    ...item,
                    error: `Transaction failed: ${err.message || err.toString()}`
                });
                await trx.rollback(); // מבטל הכל     
            }
        }
        //             } else {
        //                 console.log(`Customer-device association already exists: ${existCustomerDevice.customerDevice_id} device_id: ${existCustomerDevice.device_id} customer_id: ${existCustomerDevice.customer_id}`);

        //             }
        else {
            try {
                let existDevice =
                    // try {
                    await db.Device.findDevice({ SIM_number: sanitized.device.SIM_number, IMEI_1: sanitized.device.IMEI_1, mehalcha_number: sanitized.device.mehalcha_number, device_number: sanitized.device.device_number });
                // } catch (err) {
                //     console.error('Error finding device:', err);
                //     continue;
                // }

                if (!existDevice) {
                    //                 try {
                    existDevice = await db.Device.createDevice(sanitized.device);
                    console.log('Device created (no customer)');
                    //                 } catch (err) {
                    //                     console.error("Error creating device: ", err);
                    //                     continue; // המשך ללולאה אם יש שגיאה בהוספת מכשיר
                    //                 }
                } else {
                    console.log('Device already exists (no customer)');
                    // console.log('Device already exists', existDevice.device_id);
                }
                //         }
                //     }
            } catch (err: any) {
                console.error('Error creating device (no customer):', err);

                errors.push({
                    ...item,
                    error: `Device-only insert failed: ${err.message || err.toString()}`
                });                //     console.error('Error processing item:');
                //     console.error('Error details:', err.message || err);
                //     console.error('Critical error:', err.message || err);
                //     throw err; // זריקת השגיאה למעלה אם נדרש
                // }
            }
        }
    }
    if (errors.length > 0) {
        const ws = XLSX.utils.json_to_sheet(errors);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Errors");

        const errorFilePath = path.resolve(__dirname, '../../lib/errors_output.xlsx'); // ✨ שינוי
        XLSX.writeFile(wb, errorFilePath);
        console.log(`❌ Errors written to: ${errorFilePath}`);
    }

}






































///הקוד הייייששששששןןןןןן
// import db from "../db";
// import { Customer, Device, CustomerDevice, CustomerDeviceExcel } from "../model";

// const processExcelData = async (data: any[]): Promise<void> => {
//     try {
//         console.log('processExcelData=========');

//         for (const item of data) {
//             const isCustomer: boolean = !!(typeof item.first_name === 'string' && item.first_name.trim()) ||
//                 (typeof item.last_name === 'string' && item.last_name.trim());
//             let sanitized: CustomerDeviceExcel.Model | null = null;

//             try {
//                 sanitized = await CustomerDeviceExcel.sanitize(item, isCustomer);
//             }
//             catch (err: any) {
//                 console.error(`Error in sanitize for item: `);
//                 console.error(item);
//                 console.error('Error: ');
//                 console.error(err);
//                 continue;
//             }

//             // console.log('sanitized: ', sanitized);

//             const customer: Customer.Model = extractCustomer(sanitized);
//             const device: Device.Model = extractDevice(sanitized);
//             // console.log('customer: ', customer);
//             // console.log('device: ', device);

//             if (isCustomer) {
//                 let existCustomer: Customer.Model;
//                 try {
//                     existCustomer = await db.Customer.findCustomer({ email: customer.email, id_number: customer.id_number });
//                 } catch (err) {
//                     console.error('Error finding customer:', err);
//                     continue;
//                 }

//                 if (!existCustomer) {
//                     try {
//                         existCustomer = await db.Customer.createCustomer(customer);
//                         console.log('Customer created');
//                     } catch (err) {
//                         console.error("Error creating customer: ", err);
//                         continue; // המשך ללולאה אם יש שגיאה בהוספת לקוח
//                     }
//                 } else {
//                     console.log('Customer already exists', existCustomer.customer_id);
//                 }

//                 let existDevice: Device.Model;
//                 try {
//                     existDevice = await db.Device.findDevice({ SIM_number: device.SIM_number, IMEI_1: device.IMEI_1, mehalcha_number: device.mehalcha_number, device_number: device.device_number });
//                 } catch (err) {
//                     console.error('Error finding device:', err);
//                     continue;
//                 }

//                 if (!existDevice) {
//                     try {
//                         existDevice = await db.Device.createDevice(device);
//                         console.log('Device created');
//                     } catch (err) {
//                         console.error("Error creating device: ", err);
//                         continue; // המשך ללולאה אם יש שגיאה בהוספת מכשיר
//                     }
//                 } else {
//                     console.log('Device already exists', existDevice.device_id);
//                 }

//                 let existCustomerDevice: CustomerDevice.Model;
//                 try {
//                     existCustomerDevice = await db.CustomerDevice.findCustomerDevice({ device_id: existDevice.device_id });
//                 } catch (err) {
//                     console.error('Error finding customer device:', err);
//                     continue;
//                 }

//                 if (!existCustomerDevice) {
//                     const date: Date = convertExcelDateToJSDate(sanitized.receivedAt);
//                     console.log('date from excel: ', sanitized.receivedAt);
//                     console.log('date after convert: ', date);


//                     const planEndDate = new Date(date);
//                     planEndDate.setFullYear(planEndDate.getFullYear() + 5);
//                     try {
//                         await db.CustomerDevice.createCustomerDevice({
//                             customerDevice_id: "",
//                             customer_id: existCustomer.customer_id,
//                             device_id: existDevice.device_id,
//                             receivedAt: date,
//                             planEndDate: planEndDate,
//                             filterVersion: '1.7',
//                             deviceProgram: '0'
//                         });
//                         console.log('CustomerDevice created');

//                     } catch (err) {
//                         console.error('Error creating customer device:', err);
//                     }
//                 } else {
//                     console.log(`Customer-device association already exists: ${existCustomerDevice.customerDevice_id} device_id: ${existCustomerDevice.device_id} customer_id: ${existCustomerDevice.customer_id}`);
//                 }
//             } else {
//                 let existDevice: Device.Model;
//                 try {
//                     existDevice = await db.Device.findDevice({ SIM_number: device.SIM_number, IMEI_1: device.IMEI_1, mehalcha_number: device.mehalcha_number, device_number: device.device_number });
//                 } catch (err) {
//                     console.error('Error finding device:', err);
//                     continue;
//                 }

//                 if (!existDevice) {
//                     try {
//                         existDevice = await db.Device.createDevice(device);
//                     } catch (err) {
//                         console.error("Error creating device: ", err);
//                         continue; // המשך ללולאה אם יש שגיאה בהוספת מכשיר
//                     }
//                 } else {
//                     console.log('Device already exists', existDevice.device_id);
//                 }
//             }
//         }
//     } catch (err: any) {
//         console.error('Error processing item:');
//         console.error('Error details:', err.message || err);
//         console.error('Critical error:', err.message || err);
//         throw err; // זריקת השגיאה למעלה אם נדרש
//     }
// };











































// פונקציה שמפרקת את פרטי הלקוח
// const extractCustomer = (CustomerDeviceExcel: CustomerDeviceExcel.Model): Customer.Model => {
//     const customer: Customer.Model = {
//         customer_id: "",
//         first_name: CustomerDeviceExcel.first_name,
//         last_name: CustomerDeviceExcel.last_name,
//         id_number: CustomerDeviceExcel.id_number,
//         phone_number: CustomerDeviceExcel.phone_number,
//         additional_phone: CustomerDeviceExcel.additional_phone,
//         email: CustomerDeviceExcel.email,
//         city: CustomerDeviceExcel.city,
//         address1: CustomerDeviceExcel.address1,
//         address2: "",
//         zipCode: "",
//         status: "active",
//         created_at: new Date(Date.now()),
//         updated_at: new Date(Date.now())
//     };

//     return customer;
// }

// פונקציה שמפרקת את פרטי המכשיר
// const extractDevice = (CustomerDeviceExcel: CustomerDeviceExcel.Model): Device.Model => {
//     const device: Device.Model = {
//         device_id: "",
//         SIM_number: CustomerDeviceExcel.SIM_number,
//         IMEI_1: CustomerDeviceExcel.IMEI_1,
//         mehalcha_number: CustomerDeviceExcel.mehalcha_number,
//         model: CustomerDeviceExcel.model,
//         device_number: CustomerDeviceExcel.device_number,
//         status: '', // מה להכניס בסטטוס יש מכשירים שהם משויכים ללקוחות ויש מכשירים שלא?
//         isDonator: true,
//     };
//     return device;
// }

// const convertExcelDateToJSDate = (excelDate: number): Date => {
//     const excelEpoch = new Date(1900, 0, 1); // תאריך ההתחלה של אקסל
//     const daysOffset = excelDate - 2; // אקסל מחשיב 1900 כ"שנה מעוברת" בטעות
//     return new Date(excelEpoch.getTime() + daysOffset * 24 * 60 * 60 * 1000);
// }

export const convertExcelDateToJSDate = (excelDate: number): Date => {
    console.log('convert Excel date to js');

    const excelEpoch = new Date(Date.UTC(1899, 11, 30)); // תשומת לב: תיקון מדויק יותר!
    const millisecondsPerDay = 24 * 60 * 60 * 1000;
    return new Date(excelEpoch.getTime() + excelDate * millisecondsPerDay);
};


// export const convertExcelDateToJSDate = (excelDate: number | string): Date => {
//     // אם הקלט הוא מספר (כמו 45637, מספר יומי ב-Excel)
//     if (typeof excelDate === 'number') {
//         const excelEpoch = new Date(Date.UTC(1899, 11, 30)); // אפוק של Excel
//         const millisecondsPerDay = 24 * 60 * 60 * 1000;
//         return new Date(excelEpoch.getTime() + excelDate * millisecondsPerDay);
//     }

//     // אם הקלט הוא תאריך בפורמט מחרוזת (כמו '27/10/2024')
//     if (typeof excelDate === 'string') {
//         const parsedDate = new Date(excelDate);

//         // אם לא הצלחנו להמיר את המחרוזת לתאריך תקני, נחזיר תאריך ברירת מחדל (נתחיל להחזיר ערך שנראה תקני)
//         if (isNaN(parsedDate.getTime())) {
//             console.error("Invalid date format:", excelDate);
//             return new Date();  // תאריך ברירת מחדל (תאריך נוכחי)
//         }
//         return parsedDate;
//     }

//     // אם לא הצלחנו לזהות את סוג הקלט, נחזיר תאריך ברירת מחדל
//     console.error("Invalid input for date conversion:", excelDate);
//     return new Date();  // תאריך ברירת מחדל (תאריך נוכחי)
// };


export { processExcelData };
