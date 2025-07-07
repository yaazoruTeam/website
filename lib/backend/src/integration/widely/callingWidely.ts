import axios from "axios";
import * as https from "https";
import { createAuth } from "./auth";
import { config } from "../../config";

const callingWidely = async (func_name: string, data: any) => {
    const requestBody = {
        auth: createAuth(),
        func_name: func_name,
        data: data,
    };

    try {
        const response = await axios.post(
            config.widely.urlAccountAction,
            requestBody,
            {
                headers: {
                    "Content-Type": "application/json",
                },
                httpsAgent: new https.Agent({
                    rejectUnauthorized: false // ⛔️ אל תבדוק תעודת SSL רק לפיתוח!!!
                })
            }
        );

        return response.data;

    } catch (error) {
        console.error("Error in callingWidely:", error);
        throw error;
    }
}

export { callingWidely }
