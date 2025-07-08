import { NextFunction, Request, Response } from 'express'
import { HttpError, Widely } from '../model'
import { callingWidely } from '../integration/widely/callingWidely'

// פונקציות עזר שמחזירות נתונים
const searchUsersData = async (simNumber: string): Promise<any> => {
    const result: Widely.Model = await callingWidely(
        'search_users',
        { account_id: 400000441, search_string: simNumber }
    )
    
    if (result.error_code !== 200 || !result.data || result.data.length === 0) {
        const error: HttpError.Model = {
            status: 404,
            message: 'User not found for the provided simNumber.',
        }
        throw error
    }
    
    return result.data[0]
}

const getMobilesData = async (domain_user_id: string): Promise<any> => {
    const result: Widely.Model = await callingWidely(
        'get_mobiles',
        { domain_user_id: domain_user_id }
    )
    
    if (result.error_code !== 200 || !result.data || result.data.length === 0) {
        const error: HttpError.Model = {
            status: 404,
            message: 'No mobiles found for the user.',
        }
        throw error
    }
    
    return result.data[0]
}

const getMobileInfoData = async (endpoint_id: string): Promise<any> => {
    const result: Widely.Model = await callingWidely(
        'get_mobile_info',
        { endpoint_id: endpoint_id }
    )
    
    if (result.error_code !== 200 || !result.data) {
        const error: HttpError.Model = {
            status: 404,
            message: 'Mobile info not found.',
        }
        throw error
    }
    
    // בדיקה אם הנתונים הם מערך או אובייקט
    const mobileData = Array.isArray(result.data) ? result.data[0] : result.data;
    return mobileData
}

const searchUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { simNumber } = req.body

        if (!simNumber) {
            const error: HttpError.Model = {
                status: 400,
                message: 'simNumber is required.',
            }
            throw error
        }

        // קריאה לשירות האינטגרציה עם WIDELY
        const result: Widely.Model = await callingWidely(
            'search_users',
            { account_id: 400000441, search_string: simNumber }
        )

        res.status(result.error_code).json(result.data)
    } catch (error: any) {
        next(error)
    }
}

const getMobiles = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { domain_user_id } = req.body

        if (!domain_user_id) {
            const error: HttpError.Model = {
                status: 400,
                message: 'domain_user_id is required.',
            }
            throw error
        }

        const result: Widely.Model = await callingWidely(
            'get_mobiles',
            { domain_user_id: domain_user_id }
        )

        res.status(result.error_code).json(result.data)
    } catch (error: any) {
        next(error)
    }
}

const getMobileInfo = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { endpoint_id } = req.body

        if (!endpoint_id) {
            const error: HttpError.Model = {
                status: 400,
                message: 'endpoint_id is required.',
            }
            throw error
        }

        const result: Widely.Model = await callingWidely(
            'get_mobile_info',
            { endpoint_id: endpoint_id }
        )

        res.status(result.error_code).json(result.data)
    } catch (error: any) {
        next(error)
    }
}

const getAllUserData = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { simNumber } = req.body

        if (!simNumber) {
            const error: HttpError.Model = {
                status: 400,
                message: 'simNumber is required.',
            }
            throw error
        }

        // שלב 1: חיפוש משתמש על בסיס מספר הסים
        const user = await searchUsersData(simNumber)
        const domain_user_id = user.domain_user_id

        // שלב 2: קבלת המכשירים של המשתמש
        const mobile = await getMobilesData(domain_user_id)
        const endpoint_id = mobile.endpoint_id

        // שלב 3: קבלת מידע מפורט על המכשיר
        const mobileInfo = await getMobileInfoData(endpoint_id)

        // חילוץ נתוני דאטה מהמקום הנכון עם בדיקות בטיחות
        const dataUsage = mobileInfo?.subscriptions?.[0]?.data?.[0]?.usage || mobileInfo?.data_used || 0
        
        // זיהוי רשת על בסיס mcc_mnc
        const mccMnc = mobileInfo?.registration_info?.mcc_mnc || mobileInfo?.registartion_info?.mcc_mnc || ''
        let networkConnection = 'לא זמין'
        
        switch (mccMnc) {
            case '425_03':
                networkConnection = 'פלאפון'
                break
            case '425_02':
                networkConnection = 'פרטנר'
                break
            case '425_07':
                networkConnection = 'HOT'
                break
            default:
                networkConnection = `לא זמין (${mccMnc})`
        }

        // הכנת הנתונים להחזרה
        const responseData = {
            simNumber: simNumber,
            endpoint_id: endpoint_id,
            network_connection: networkConnection, // לאיפה הפלאפון מחובר
            data_usage_gb: parseFloat(dataUsage.toFixed(3)), // גיגה בשימוש
            imei1: mobileInfo?.sim_data?.locked_imei || mobileInfo?.registration_info?.imei || mobileInfo?.registartion_info?.imei || 'לא זמין', // IMEI1
            status: mobileInfo?.registration_info?.status || mobileInfo?.registartion_info?.status || 'לא זמין', // סטטוס
            imei_lock: mobileInfo?.sim_data?.lock_on_first_imei ? 'נעול' : 'לא נעול', // נעילת IMEI
            msisdn: mobileInfo?.sim_data?.msisdn || mobileInfo?.registration_info?.msisdn || mobileInfo?.registartion_info?.msisdn || 'לא זמין', // מספר הטלפון
            iccid: mobileInfo?.sim_data?.iccid || mobileInfo?.iccid || 'לא זמין', // ICCID
            device_info: {
                brand: mobileInfo?.device_info?.brand || 'לא זמין',
                model: mobileInfo?.device_info?.model || 'לא זמין',
                name: mobileInfo?.device_info?.name || 'לא זמין'
            }
        }

        res.status(200).json(responseData)
    } catch (error: any) {
        next(error)
    }
}

export { searchUsers, getMobiles, getMobileInfo, getAllUserData }


                                        
