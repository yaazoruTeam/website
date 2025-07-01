import axios from 'axios'
import https from 'https'
import dotenv from 'dotenv'
import { createAuth } from './auth'
dotenv.config()

const ACCOUNT_TOKEN: string = process.env.ACCOUNT_TOKEN || ''
const ACCOUNT_ID: string = process.env.ACCOUNT_ID || ''
const AUTH_ID: string = process.env.AUTH_ID || ''

const PING_URL = 'https://widelyapp-api-01.widelymobile.com:3001/api/v2/widely_app/app_action'
const API_URL = 'https://widelyapp-api-02.widelymobile.com:3001/api/v2/temp_prev/' // ACCOUNT_ACTION

const sendPing = async () => {
    const requestBody = {
        auth: createAuth(),
        func_name: 'ping',
        data: {}
    }

    try {
        const response = await axios.post(PING_URL, requestBody, {
            headers: {
                'Content-Type': 'application/json'
            },
            httpsAgent: new https.Agent({
                rejectUnauthorized: false // ⛔️ אל תבדוק תעודת SSL
            })
        })

        console.log('✅ Ping Response:', response.data)
    } catch (error: any) {
        console.error('❌ Ping Error:', error.response?.data || error.message)
    }
}


// const confirmIccid = async (iccid: string) => {
//     console.log('account token:', ACCOUNT_TOKEN);

//     const hash = generateHash()
//     const innerAuth = calculateMD5(BRAND_TOKEN + hash)
//     const auth = calculateMD5(ACCOUNT_TOKEN + innerAuth)

//     const requestBody = {
//         auth: {
//             auth_id: AUTH_ID, // כאן את משתמשת ב־auth_id מהחשבון
//             hash,
//             auth
//         },
//         func_name: 'confirm_iccid',
//         data: {
//             iccid
//         }
//     }

//     try {
//         const response = await axios.post(API_URL, requestBody, {
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             httpsAgent: new https.Agent({
//                 rejectUnauthorized: false // ⚠️ רק בפיתוח
//             })
//         })

//         console.log('✅ Response:', response.data)
//     } catch (error: any) {
//         console.error('❌ Error:', error.response?.data || error.message)
//     }
// }

// const getMobileByIccidFromList = async (iccidToFind: string) => {
//     const hash = generateHash()
//     const innerAuth = calculateMD5(BRAND_TOKEN + hash)
//     const auth = calculateMD5(ACCOUNT_TOKEN + innerAuth)

//     const requestBody = {
//         auth: {
//             auth_id: AUTH_ID,
//             hash,
//             auth
//         },
//         func_name: 'get_all_mobiles',
//         data: {} // אפשר להוסיף פילטרים לפי התיעוד אם יש צורך
//     }

//     try {
//         const response = await axios.post(API_URL, requestBody, {
//             headers: { 'Content-Type': 'application/json' },
//             httpsAgent: new https.Agent({ rejectUnauthorized: false })
//         })
//         console.log('✅ Response from get_all_mobiles:', response.data);

//         const allMobiles = response.data?.data?.mobiles || []

//         const matched = allMobiles.find((m: any) => m.iccid === iccidToFind)

//         if (matched) {
//             console.log('✅ Mobile found:', matched)
//         } else {
//             console.log('ℹ️ No mobile found with ICCID:', iccidToFind)
//         }
//     } catch (error: any) {
//         console.error('❌ Error:', error.response?.data || error.message)
//     }
// }


// const getDids = async (domain_user_id: string) => {
//     const hash = generateHash()
//     const innerAuth = calculateMD5(BRAND_TOKEN + hash)
//     const finalAuth = calculateMD5(ACCOUNT_TOKEN + innerAuth)

//     const requestBody = {
//         auth: {
//             auth_id: AUTH_ID,
//             hash,
//             auth: finalAuth
//         },
//         func_name: 'get_dids',
//         data: {
//             domain_user_id: domain_user_id
//         }
//     }

//     try {
//         const response = await axios.post(API_URL, requestBody, {
//             headers: { 'Content-Type': 'application/json' },
//             httpsAgent: new https.Agent({
//                 rejectUnauthorized: false // לפיתוח בלבד
//             })
//         })

//         console.log('✅ get_dids Response:', response.data);

//         const dids = response.data?.data?.dids || []
//         console.log('✅ DIDs:', dids)
//         return dids
//     } catch (error: any) {
//         console.error('❌ get_dids error:', error.response?.data || error.message)
//         return null
//     }
// }

// const getDidInfoByEndpoint = async (endpoint_id: number) => {
//     const hash = generateHash()
//     const innerAuth = calculateMD5(BRAND_TOKEN + hash)
//     const finalAuth = calculateMD5(ACCOUNT_TOKEN + innerAuth)

//     const requestBody = {
//         auth: {
//             auth_id: AUTH_ID,
//             hash,
//             auth: finalAuth
//         },
//         func_name: 'get_did_info',
//         data: {
//             endpoint_id: endpoint_id
//         }
//     }

//     try {
//         const response = await axios.post(API_URL, requestBody, {
//             headers: { 'Content-Type': 'application/json' },
//             httpsAgent: new https.Agent({
//                 rejectUnauthorized: false
//             })
//         })

//         const didInfo = response.data?.data || {}
//         console.log('📞 DID Info:', didInfo)

//         return didInfo
//     } catch (error: any) {
//         console.error('❌ שגיאה בשליפת DID לפי endpoint:', error.response?.data || error.message)
//         return null
//     }
// }

// const generalSearch = async (query: string) => {
//     const hash = generateHash()
//     const innerAuth = calculateMD5(BRAND_TOKEN + hash)
//     const auth = calculateMD5(ACCOUNT_TOKEN + innerAuth)

//     const requestBody = {
//         auth: {
//             auth_id: AUTH_ID,
//             hash,
//             auth
//         },
//         func_name: 'general_search',
//         data: {
//             search_string: query,
//             accounts_page: 0,
//             users_page: 0,
//             mobiles_page: 0,
//             dids_page: 0
//         }
//     }

//     try {
//         const response = await axios.post(API_URL, requestBody, {
//             headers: { 'Content-Type': 'application/json' },
//             httpsAgent: new https.Agent({ rejectUnauthorized: false }) // לפיתוח בלבד
//         })

//         console.log('🔍 תוצאות חיפוש:', JSON.stringify(response.data, null, 2))
//     } catch (error: any) {
//         console.error('❌ שגיאה בחיפוש:', error.response?.data || error.message)
//     }
// }

const sendMobileAction = async (endpointId: number, action: string) => {// לביצוע פעולות על סים מסוים כמו כיבוי, הדלקה וכו


    const requestBody = {
        auth: createAuth(),
        func_name: 'send_mobile_action',
        data: {
            endpoint_id: endpointId,
            action
        }
    }

    try {
        const response = await axios.post(API_URL, requestBody, {
            headers: { 'Content-Type': 'application/json' },
            httpsAgent: new https.Agent({ rejectUnauthorized: false }) // רק בפיתוח
        })

        console.log('✅ פעולה בוצעה בהצלחה:', response.data)
        return response.data
    } catch (error: any) {
        console.error('❌ שגיאה בביצוע פעולה:', error.response?.data || error.message)
    }
}

// const getActionMobileInfo = async () => {
//     const hash = generateHash()
//     const innerAuth = calculateMD5(BRAND_TOKEN + hash)
//     const finalAuth = calculateMD5(ACCOUNT_TOKEN + innerAuth)

//     const requestBody = {
//         auth: {
//             auth_id: AUTH_ID,
//             hash,
//             auth: finalAuth
//         },
//         func_name: 'get_mobile_info',
//         data: {
//             endpoint_id: '89972123300003289709',

//         }
//     }

//     try {
//         const response = await axios.post(API_URL, requestBody, {
//             headers: { 'Content-Type': 'application/json' },
//             httpsAgent: new https.Agent({ rejectUnauthorized: false }) // רק בפיתוח
//         })

//         console.log('✅ get action mobile info Response:', response.data)
//         return response.data
//     } catch (error: any) {
//         console.error('❌ get action mobile info Error:', error.response?.data || error.message)
//     }
// }

const getMobiles = async (domain_user_id: number) => {

    const requestBody = {
        auth: createAuth(),
        func_name: 'get_mobiles',
        data: {
            domain_user_id: domain_user_id
        }
    }

    try {
        const response = await axios.post(API_URL, requestBody, {
            headers: { 'Content-Type': 'application/json' },
            httpsAgent: new https.Agent({ rejectUnauthorized: false }) // רק בפיתוח
        })

        console.log('✅ get mobiles Response:', response.data)
        return response.data
    } catch (error: any) {
        console.error('❌ get mobiles Error:', error.response?.data || error.message)
    }
}


// const getUsers = async () => {
//     const hash = generateHash()
//     const innerAuth = calculateMD5(BRAND_TOKEN + hash)
//     const finalAuth = calculateMD5(ACCOUNT_TOKEN + innerAuth)

//     const requestBody = {
//         auth: {
//             auth_id: AUTH_ID,         // מנהל החשבון
//             hash,
//             auth: finalAuth
//         },
//         func_name: 'get_users',
//         data: {
//             account_id: ACCOUNT_ID    // החשבון שאת רוצה להביא את המשתמשים שלו
//         }
//     }

//     try {
//         const response = await axios.post(API_URL, requestBody, {
//             headers: { 'Content-Type': 'application/json' },
//             httpsAgent: new https.Agent({ rejectUnauthorized: false }) // לפיתוח
//         })

//         const users = response.data?.data || []

//         console.log('📋 רשימת משתמשים:')
//         users.forEach((user: any) => {
//             console.log(`👤 ${user.name} | domain_user_id: ${user.domain_user_id} | account_id: ${user.account_id}`)
//         })

//         return users
//     } catch (error: any) {
//         console.error('❌ שגיאה בשליפת משתמשים:', error.response?.data || error.message)
//         return []
//     }
// }

const searchUserByIccid = async (iccid: string) => {

    const requestBody = {
        auth: createAuth(),
        func_name: 'general_search',
        data: {
            search_string: iccid
        }
    }

    try {
        const response = await axios.post(API_URL, requestBody, {
            headers: { 'Content-Type': 'application/json' },
            httpsAgent: new https.Agent({ rejectUnauthorized: false }) // בפיתוח
        })

        const data = response.data?.data
        const mobiles = data?.mobiles || []

        if (mobiles.length === 0) {
            console.warn('⚠️ לא נמצאו מוביילים עם ה־ICCID שסופק.')
            return null
        }

        // ניקח את הראשון ברשימה
        const mobile = mobiles[0]

        console.log(`📱 נמצא קו עם ICCID. domain_user_id: ${mobile.domain_user_id}, endpoint_id: ${mobile.endpoint_id}`)
        console.log('domain_user_name:', mobile.domain_user_name,
            'endpoint_id:', mobile.endpoint_id,
            'account_id:', mobile.account_id,
            'domain_user_id:', mobile.domain_user_id
        );

        return {
            domain_user_id: mobile.domain_user_id,
            endpoint_id: mobile.endpoint_id,
            account_id: mobile.account_id,
            domain_user_name: mobile.domain_user_name
        }
    } catch (error: any) {
        console.error('❌ שגיאה בחיפוש לפי ICCID:', error.response?.data || error.message)
        return null
    }
}

const searchUsers = async (iccid: number) => {
    console.log('ACCOUNT_ID:', ACCOUNT_ID);
    const requestBody = {
        auth: createAuth(),
        func_name: 'search_users',
        data: {
            account_id: 400000441,
            search_string: '89972123300003347812'//'89972123300003312030',//'Mobile - 89972123300003312030', // 
        },
    };

    try {
        const response = await axios.post(
            API_URL,
            requestBody,
            {
                headers: { 'Content-Type': 'application/json' },
                httpsAgent: new https.Agent({ rejectUnauthorized: false }) // בפיתוח
            }
        );

        console.log('🔍 תוצאה:', response.data);
    } catch (error: any) {
        console.error('❌ שגיאה:', error.response?.data || error.message);
    }
};

// const getUserSubscriptions = async (domain_user_id: number) => {
//     const hash = generateHash()
//     const innerAuth = calculateMD5(BRAND_TOKEN + hash)
//     const finalAuth = calculateMD5(ACCOUNT_TOKEN + innerAuth)

//     const requestBody = {
//         auth: {
//             auth_id: AUTH_ID,
//             hash,
//             auth: finalAuth
//         },
//         func_name: 'get_user_subscriptions',
//         data: {
//             domain_user_id
//         }
//     }

//     try {
//         const response = await axios.post(API_URL, requestBody, {
//             headers: { 'Content-Type': 'application/json' },
//             httpsAgent: new https.Agent({
//                 rejectUnauthorized: false // לפיתוח
//             })
//         })

//         const subscriptions = response.data?.data || []
//         console.log('📦 חבילות שירות:', subscriptions)

//         return subscriptions
//     } catch (error: any) {
//         console.error('❌ שגיאה בשליפת חבילות:', error.response?.data || error.message)
//         return null
//     }
// }

const getEndpointUsage = async (endpoint_id: number) => {

    const requestBody = {
        auth: createAuth(),
        func_name: 'get_endpoint_usage',
        data: {
            endpoint_id,
            period: 'month' // אפשר גם 'week' או 'day'
        }
    }

    try {
        const response = await axios.post(API_URL, requestBody, {
            headers: { 'Content-Type': 'application/json' },
            httpsAgent: new https.Agent({
                rejectUnauthorized: false
            })
        })

        const usageData = response.data?.data || {}
        console.log('📊 נתוני שימוש:', usageData)
        console.log('מידע על השימוש:', usageData.data)

        console.log('🔍 שימוש מלא:', JSON.stringify(usageData, null, 2))

        return usageData
    } catch (error: any) {
        console.error('❌ שגיאה בשליפת usage:', error.response?.data || error.message)
        return null
    }
}

const getMobileInfo = async (endpoint_id: number) => {

    const requestBody = {
        auth: createAuth(),
        func_name: 'get_mobile_info',
        data: {
            endpoint_id
        }
    }

    try {
        const response = await axios.post(API_URL, requestBody, {
            headers: { 'Content-Type': 'application/json' },
            httpsAgent: new https.Agent({
                rejectUnauthorized: false
            })
        })

        const info = response.data?.data || {}
        console.log('📱 מידע על הסים:', JSON.stringify(info, null, 2))
        return info
    } catch (error: any) {
        console.error('❌ שגיאה בשליפת get_mobile_info:', error.response?.data || error.message)
        return null
    }
}

const terminateMobile = async (endpoint_id: number) => {

    const requestBody = {
        auth: createAuth(),
        func_name: 'prov_terminate_mobile',
        data: {
            endpoint_id
        }
    }

    try {
        const response = await axios.post(API_URL, requestBody, {
            headers: { 'Content-Type': 'application/json' },
            httpsAgent: new https.Agent({
                rejectUnauthorized: false // לפיתוח בלבד
            })
        })

        console.log('✅ ביטול קו בוצע בהצלחה:', response.data)
        return response.data
    } catch (error: any) {
        console.error('❌ שגיאה בביטול קו:', error.response?.data || error.message)
        return null
    }
}

export const createMobile = async ({
    domain_user_id,
    sim_iccid,
    service_id,
    name = `Mobile - ${sim_iccid}`,
    profile = 'full_service'
}: {
    domain_user_id: number,
    sim_iccid: string,
    service_id: number,
    name?: string,
    profile?: string
}) => {

    const requestBody = {
        auth: createAuth(),
        func_name: 'prov_create_mobile',
        data: {
            domain_user_id,
            iccid: sim_iccid,
            service_id,
            name,
            profile
        }
    }

    try {
        const response = await axios.post(API_URL, requestBody, {
            headers: { 'Content-Type': 'application/json' },
            httpsAgent: new https.Agent({ rejectUnauthorized: false }) // לפיתוח בלבד
        })

        console.log('✅ קו נוצר בהצלחה:', response.data)
        return response.data
    } catch (error: any) {
        console.error('❌ שגיאה ביצירת קו:', error.response?.data || error.message)
        return null
    }
}

const resetLine = async (endpoint_id: number) => {
    try {
        console.log(`🔄 איפוס קו ${endpoint_id} – התחלה`)

        // שלב 1: שליפת פרטי הקו
        const info = await getMobileInfo(endpoint_id)
        if (!info /*|| !info.subscriptions.data*/) throw new Error('❌ לא ניתן לשלוף מידע על הקו')
        console.log(info);
        console.log('data: ftfy', info.subscriptions[0].data);


        // const { sim_data, domain_user_id, name, package_id } = info.data
        // const sim_iccid = sim_data?.iccid

        const { sim_data, domain_user_id, name, package_info } = info
        const sim_iccid = sim_data?.iccid
        const service_id = package_info?.id

        console.log('sim_data: 1', sim_data, 'domain_user_id: 2', domain_user_id, 'name: 3', name, 'package_info: 4', package_info, 'endpoint_id: 5', endpoint_id);


        if (!sim_iccid || !domain_user_id || !service_id) {
            throw new Error('❌ חסרים נתונים קריטיים ליצירת הקו מחדש')
        }

        // שלב 2: ביטול הקו
        const terminateResult = await terminateMobile(endpoint_id)
        if (!terminateResult || terminateResult.status !== 'OK') {
            throw new Error('❌ שגיאה בביטול הקו')
        }

        // שלב 3: יצירת קו חדש
        const createResult = await createMobile({
            domain_user_id,
            sim_iccid,
            service_id,
            name
        })

        if (createResult?.status === 'OK') {
            console.log('✅ איפוס קו הסתיים בהצלחה')
            return createResult
        } else {
            throw new Error('❌ שגיאה ביצירת קו מחדש')
        }

    } catch (error: any) {
        console.error('❌ שגיאה באיפוס קו:', error.message || error)
        return null
    }
}

const sendApn = async (endpoint_id: number) => {
    //   const hash = generateHash()
    //   const innerAuth = calculateMD5(BRAND_TOKEN + hash)
    //   const finalAuth = calculateMD5(ACCOUNT_TOKEN + innerAuth)

    //   const requestBody = {
    //     auth: {
    //       auth_id: AUTH_ID,
    //       hash,
    //       auth: finalAuth
    //     },
    //     func_name: 'send_mobile_action',
    //     data: {
    //       endpoint_id,
    //       action: 'send_apn'
    //     }
    //   }

    //   try {
    //     const response = await axios.post(API_URL, requestBody, {
    //       headers: { 'Content-Type': 'application/json' },
    //       httpsAgent: new https.Agent({
    //         rejectUnauthorized: false // רק לפיתוח
    //       })
    //     })

    //     console.log('✅ שליחת APN הצליחה:', response.data)
    //     return response.data
    //   } catch (error: any) {
    //     console.error('❌ שגיאה בשליחת APN:', error.response?.data || error.message)
    //     return null
    //   }

    await sendMobileAction(endpoint_id, 'send_apn')
    console.log('✅ שליחת APN בוצעה בהצלחה');

}

// const toggleImeiLock = async (endpoint_id: number, lock: boolean) => {
//   const hash = generateHash()
//   const innerAuth = calculateMD5(BRAND_TOKEN + hash)
//   const finalAuth = calculateMD5(ACCOUNT_TOKEN + innerAuth)

//   const action = lock ? 'lock_imei' : 'unlock_imei'

//   const requestBody = {
//     auth: {
//       auth_id: AUTH_ID,
//       hash,
//       auth: finalAuth
//     },
//     func_name: 'send_mobile_action',
//     data: {
//       endpoint_id,
//       action
//     }
//   }

//   try {
//     const response = await axios.post(API_URL, requestBody, {
//       headers: { 'Content-Type': 'application/json' },
//       httpsAgent: new https.Agent({ rejectUnauthorized: false })
//     })

//     console.log(`✅ ${lock ? 'נעילת' : 'ביטול נעילת'} IMEI בוצעה בהצלחה:`, response.data)
//     return response.data
//   } catch (error: any) {
//     console.error(`❌ שגיאה ב-${lock ? 'נעילה' : 'שחרור'} IMEI:`, error.response?.data || error.message)
//     return null
//   }
// }

const resetVoicemailPin = async (endpoint_id: number) => {
    //   const hash = generateHash()
    //   const innerAuth = calculateMD5(BRAND_TOKEN + hash)
    //   const finalAuth = calculateMD5(ACCOUNT_TOKEN + innerAuth)

    //   const requestBody = {
    //     auth: {
    //       auth_id: AUTH_ID,
    //       hash,
    //       auth: finalAuth
    //     },
    //     func_name: 'send_mobile_action',
    //     data: {
    //       endpoint_id,
    //       action: 'prov_reset_vm_pincode'
    //     }
    //   }

    //   try {
    //     const response = await axios.post(API_URL, requestBody, {
    //       headers: { 'Content-Type': 'application/json' },
    //       httpsAgent: new https.Agent({ rejectUnauthorized: false })
    //     })

    //     console.log('✅ איפוס סיסמת תא קולי בוצע בהצלחה:', response.data)
    //     return response.data
    //   } catch (error: any) {
    //     console.error('❌ שגיאה באיפוס סיסמת תא קולי:', error.response?.data || error.message)
    //     return null
    //   }
    await sendMobileAction(endpoint_id, 'prov_reset_vm_pincode')
    console.log('✅ איפוס סיסמת תא קולי בוצע בהצלחה');
}
// const toggleLineSuspension = async (endpoint_id: number, suspend: boolean) => {
//   const action = suspend ? 'suspend' : 'resume'
//   const hash = generateHash()
//   const innerAuth = calculateMD5(BRAND_TOKEN + hash)
//   const finalAuth = calculateMD5(ACCOUNT_TOKEN + innerAuth)

//   const requestBody = {
//     auth: {
//       auth_id: AUTH_ID,
//       hash,
//       auth: finalAuth
//     },
//     func_name: 'send_mobile_action',
//     data: {
//       endpoint_id,
//       action
//     }
//   }

//   try {
//     const response = await axios.post(API_URL, requestBody, {
//       headers: { 'Content-Type': 'application/json' },
//       httpsAgent: new https.Agent({ rejectUnauthorized: false })
//     })

//     console.log(`✅ הפעולה "${action}" בוצעה בהצלחה:`, response.data)
//     return response.data
//   } catch (error: any) {
//     console.error(`❌ שגיאה בפעולה "${action}":`, error.response?.data || error.message)
//     return null
//   }
// }

const toggleLineStatus = async (endpoint_id: number, enable: boolean) => {
    const requestBody = {
        auth: createAuth(),
        func_name: 'prov_update_mobile',
        data: {
            endpoint_id,
            voice_service: enable,
            sms_service: enable,
            data_service: enable
        }
    }

    try {
        const response = await axios.post(API_URL, requestBody, {
            headers: { 'Content-Type': 'application/json' },
            httpsAgent: new https.Agent({ rejectUnauthorized: false }) // רק לפיתוח
        })

        console.log(`✅ הקו ${enable ? 'הופעל' : 'הושעה'} בהצלחה:`, response.data)
        return response.data
    } catch (error: any) {
        console.error(`❌ שגיאה ב-${enable ? 'הפעלה' : 'השעיה'} של הקו:`, error.response?.data || error.message)
        return null
    }
}
// const sendMobileAction = async (endpoint_id: number, action: string) => {
//   const hash = generateHash()
//   const innerAuth = calculateMD5(BRAND_TOKEN + hash)
//   const finalAuth = calculateMD5(ACCOUNT_TOKEN + innerAuth)

//   const requestBody = {
//     auth: {
//       auth_id: AUTH_ID,
//       hash,
//       auth: finalAuth
//     },
//     func_name: 'send_mobile_action',
//     data: {
//       endpoint_id,
//       action
//     }
//   }

//   try {
//     const response = await axios.post(API_URL, requestBody, {
//       headers: { 'Content-Type': 'application/json' },
//       httpsAgent: new https.Agent({ rejectUnauthorized: false })
//     })
//     console.log(`✅ פעולה "${action}" הצליחה`, response.data)
//     return response.data
//   } catch (error: any) {
//     console.error(`❌ שגיאה בפעולה "${action}":`, error.response?.data || error.message)
//     return null
//   }
// }


const softResetSim = async (endpoint_id: number) => {
    console.log('🔄 איפוס קל לסים...')

    await sendMobileAction(endpoint_id, 'reregister_in_hlr')
    await sendMobileAction(endpoint_id, 'send_apn')

    console.log('✅ איפוס קל הושלם')
}

const hardResetSim = async (endpoint_id: number) => {
    console.log('🔄 איפוס מקיף לסים...')

    await sendMobileAction(endpoint_id, 'reregister_in_hlr')
    await sendMobileAction(endpoint_id, 'send_apn')
    await sendMobileAction(endpoint_id, 'prov_reset_vm_pincode')
    await sendMobileAction(endpoint_id, 'prov_reset_vm_inbox')
    await sendMobileAction(endpoint_id, 'reset_vm_custom_recording')
    await sendMobileAction(endpoint_id, 'change_vm_lang_he') // או en

    console.log('✅ איפוס מקיף הושלם')
}


const updateMobileSubscription = async (endpoint_id: number, service_id: number) => {

    const requestBody = {
        auth: createAuth(),
        func_name: 'prov_update_mobile_subscription',
        data: {
            endpoint_id,
             service_id
            // extra_packages
        }
    }

    try {
        const response = await axios.post(API_URL, requestBody, {
            headers: { 'Content-Type': 'application/json' },
            httpsAgent: new https.Agent({ rejectUnauthorized: false })
        })

        console.log('✅ תוכנית עודכנה בהצלחה:', response.data)
        return response.data
    } catch (error: any) {
        console.error('❌ שגיאה בהחלפת תוכנית:', error.response?.data || error.message)
        return null
    }
}

const getPackagesWithInfo = async () => {

    const requestBody = {
        auth: createAuth(),
        func_name: 'get_packages_with_info',
        data: {
            reseller_domain_id: ACCOUNT_ID,
            package_types: ['base']
        }
    }

    try {
        const response = await axios.post(API_URL, requestBody, {
            headers: { 'Content-Type': 'application/json' },
            httpsAgent: new https.Agent({ rejectUnauthorized: false })
        })

        console.log('✅ חבילות התקבלו בהצלחה:', response.data)
        // console.log(response.data.item);
        //   /onst item of response.data.item) {
        // for(let i = 0; i < response.data.item.length; i++) {
        //         console.log(response.data.item[i]);}
        //         console.log(response.data.item);
        console.log(JSON.stringify(response.data, null, 2));

        // }


        return response.data
    } catch (error: any) {
        console.error('❌ שגיאה בקבלת החבילות:', error.response?.data || error.message)
        return null
    }
}

const changeNetworkPreference = async (
    endpoint_id: number,
    selection: "pelephone" | "hot_partner" | "pelephone_partner"
) => {
    const actionMap: Record<typeof selection, string> = {
        pelephone: "pelephone_only",
        hot_partner: "hot_mobile_only",
        pelephone_partner: "both_networks_pl_first"
    }

    const action = actionMap[selection]
    if (!action) {
        console.error("❌ רשת לא נתמכת:", selection)
        return null
    }
    await sendMobileAction(endpoint_id, action);
    console.log("✅ רשת עודכנה:");


    //   const hash = generateHash()
    //   const innerAuth = calculateMD5(BRAND_TOKEN + hash)
    //   const finalAuth = calculateMD5(ACCOUNT_TOKEN + innerAuth)

    //   const requestBody = {
    //     auth: {
    //       auth_id: AUTH_ID,
    //       hash,
    //       auth: finalAuth
    //     },
    //     func_name: "sendMobileAction",
    //     data: {
    //       endpoint_id,
    //       action
    //     }
    //   }

    //   try {
    //     const response = await axios.post(API_URL, requestBody, {
    //       headers: { 'Content-Type': 'application/json' },
    //       httpsAgent: new https.Agent({ rejectUnauthorized: false })
    //     })

    //     console.log("✅ רשת עודכנה:", response.data)
    //     return response.data
    //   } catch (error: any) {
    //     console.error("❌ שגיאה בעדכון רשת:", error.response?.data || error.message)
    //     return null
    //   }
}


export {
    sendPing,
    // confirmIccid,
    // getMobileByIccidFromList,
    // getDids, 
    // generalSearch,
    sendMobileAction,
    // getActionMobileInfo,
    getMobiles,
    // getUsers,
    sendApn,
    // toggleImeiLock,
    searchUserByIccid,
    // getDidInfoByEndpoint,
    // getUserSubscriptions,
    getEndpointUsage,
    getMobileInfo,
    terminateMobile,
    resetVoicemailPin,
    // toggleLineSuspension,
    toggleLineStatus,
    hardResetSim,
    softResetSim,
    updateMobileSubscription,
    getPackagesWithInfo,
    searchUsers,
    resetLine,
    changeNetworkPreference
}



