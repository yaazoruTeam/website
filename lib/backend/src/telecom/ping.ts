import axios from "axios";
import https from "https";
import { BRAND_TOKEN, BRAND_ID, generateHash, calculateMD5, Auth } from "./auth";
import { RequestBody } from "../model/src/RequestModel";
import dotenv from "dotenv";

dotenv.config();

const WIDELY_URL: string = process.env.WIDELY_URL || "";

const agent = new https.Agent({
  rejectUnauthorized: false,
});

const sendPing = async (): Promise<void> => {
  try {
    const hash = generateHash();
    const auth = calculateMD5(BRAND_TOKEN + hash);

    const requestBody: RequestBody = {
      auth: {
        auth_id: BRAND_ID,
        hash: hash,
        auth: auth,
      },
      func_name: "ping",
      data: {},
    };

    console.log("שליחת בקשה לשרת...");

    const response = await axios.post(WIDELY_URL, requestBody, {
      httpsAgent: agent,
    });

    console.log("תגובת השרת:", response.data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("שגיאה בבקשת Axios:", error.message);
    } else {
      console.error("שגיאה כללית:", error);
    }
  }
};

export { sendPing };
