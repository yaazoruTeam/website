import axios from "axios";
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
            requestBody
        );

    } catch (error) {
        console.error("Error in callingWidely:", error);
        throw error;
    }
}

export { callingWidely }
