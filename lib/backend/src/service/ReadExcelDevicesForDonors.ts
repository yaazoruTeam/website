import db from "../db";
import { Customer, Device, CustomerDevice, CustomerDeviceExcel } from "../model";

const processExcelData = async (data: any[]): Promise<void> => {
    try {
        console.log('processExcelData=========');

        for (const item of data) {
            const isCustomer: boolean = !!(typeof item.first_name === 'string' && item.first_name.trim()) ||
                (typeof item.last_name === 'string' && item.last_name.trim());
            let sanitized: CustomerDeviceExcel.Model | null = null;

            try {
                sanitized = await CustomerDeviceExcel.sanitize(item, isCustomer);
            }
            catch (err: any) {
                console.error(`Error in sanitize for item: `);
                console.error(item);
                console.error('Error: ');
                console.error(err);
                continue;
            }

            // console.log('sanitized: ', sanitized);

            const customer: Customer.Model = extractCustomer(sanitized);
            const device: Device.Model = extractDevice(sanitized);
            // console.log('customer: ', customer);
            // console.log('device: ', device);

            if (isCustomer) {
                let existCustomer: Customer.Model;
                try {
                    existCustomer = await db.Customer.findCustomer({ email: customer.email, id_number: customer.id_number });
                } catch (err) {
                    console.error('Error finding customer:', err);
                    continue;
                }

                if (!existCustomer) {
                    try {
                        existCustomer = await db.Customer.createCustomer(customer);
                        console.log('Customer created');
                    } catch (err) {
                        console.error("Error creating customer: ", err);
                        continue; // המשך ללולאה אם יש שגיאה בהוספת לקוח
                    }
                } else {
                    console.log('Customer already exists', existCustomer.customer_id);
                }

                let existDevice: Device.Model;
                try {
                    existDevice = await db.Device.findDevice({ SIM_number: device.SIM_number, IMEI_1: device.IMEI_1, mehalcha_number: device.mehalcha_number, device_number: device.device_number });
                } catch (err) {
                    console.error('Error finding device:', err);
                    continue;
                }

                if (!existDevice) {
                    try {
                        existDevice = await db.Device.createDevice(device);
                        console.log('Device created');
                    } catch (err) {
                        console.error("Error creating device: ", err);
                        continue; // המשך ללולאה אם יש שגיאה בהוספת מכשיר
                    }
                } else {
                    console.log('Device already exists', existDevice.device_id);
                }

                let existCustomerDevice: CustomerDevice.Model;
                try {
                    existCustomerDevice = await db.CustomerDevice.findCustomerDevice({ device_id: existDevice.device_id });
                } catch (err) {
                    console.error('Error finding customer device:', err);
                    continue;
                }

                if (!existCustomerDevice) {
                    const date: Date = convertExcelDateToJSDate(sanitized.date);
                    try {
                        await db.CustomerDevice.createCustomerDevice({
                            customerDevice_id: "",
                            customer_id: existCustomer.customer_id,
                            device_id: existDevice.device_id,
                            date: date,
                        });
                        console.log('CustomerDevice created');

                    } catch (err) {
                        console.error('Error creating customer device:', err);
                    }
                } else {
                    console.log(`Customer-device association already exists: ${existCustomerDevice.customerDevice_id} device_id: ${existCustomerDevice.device_id} customer_id: ${existCustomerDevice.customer_id}`);
                }
            } else {
                let existDevice: Device.Model;
                try {
                    existDevice = await db.Device.findDevice({ SIM_number: device.SIM_number, IMEI_1: device.IMEI_1, mehalcha_number: device.mehalcha_number, device_number: device.device_number });
                } catch (err) {
                    console.error('Error finding device:', err);
                    continue;
                }

                if (!existDevice) {
                    try {
                        existDevice = await db.Device.createDevice(device);
                    } catch (err) {
                        console.error("Error creating device: ", err);
                        continue; // המשך ללולאה אם יש שגיאה בהוספת מכשיר
                    }
                } else {
                    console.log('Device already exists', existDevice.device_id);
                }
            }
        }
    } catch (err: any) {
        console.error('Error processing item:');
        console.error('Error details:', err.message || err);
        console.error('Critical error:', err.message || err);
        throw err; // זריקת השגיאה למעלה אם נדרש
    }
};

// פונקציה שמפרקת את פרטי הלקוח
const extractCustomer = (CustomerDeviceExcel: CustomerDeviceExcel.Model): Customer.Model => {
    const customer: Customer.Model = {
        customer_id: "",
        first_name: CustomerDeviceExcel.first_name,
        last_name: CustomerDeviceExcel.last_name,
        id_number: CustomerDeviceExcel.id_number,
        phone_number: CustomerDeviceExcel.phone_number,
        additional_phone: CustomerDeviceExcel.additional_phone,
        email: CustomerDeviceExcel.email,
        city: CustomerDeviceExcel.city,
        address1: CustomerDeviceExcel.address1,
        address2: "",
        zipCode: "",
        status: "active",
        created_at: new Date(Date.now()),
        updated_at: new Date(Date.now())
    };

    return customer;
}

// פונקציה שמפרקת את פרטי המכשיר
const extractDevice = (CustomerDeviceExcel: CustomerDeviceExcel.Model): Device.Model => {
    const device: Device.Model = {
        device_id: "",
        SIM_number: CustomerDeviceExcel.SIM_number,
        IMEI_1: CustomerDeviceExcel.IMEI_1,
        mehalcha_number: CustomerDeviceExcel.mehalcha_number,
        model: CustomerDeviceExcel.model,
        device_number: CustomerDeviceExcel.device_number,
        status: '', // מה להכניס בסטטוס יש מכשירים שהם משויכים ללקוחות ויש מכשירים שלא?
        isDonator: true,
    };
    return device;
}

const convertExcelDateToJSDate = (excelDate: number): Date => {
    const excelEpoch = new Date(1900, 0, 1); // תאריך ההתחלה של אקסל
    const daysOffset = excelDate - 2; // אקסל מחשיב 1900 כ"שנה מעוברת" בטעות
    return new Date(excelEpoch.getTime() + daysOffset * 24 * 60 * 60 * 1000);
}

export { processExcelData };
