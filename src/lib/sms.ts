
const SMS_API_Key = process.env.SMS_API_KEY || "YOUR_SMS_API_KEY_HERE";
const SMS_TEMPLATE_ID = parseInt(process.env.SMS_TEMPLATE_ID || "100000"); // Default or update via env

interface SmsResponse {
    status: number;
    message: string;
    data: any;
}

/**
 * Sends a verification SMS using sms.ir V2 API (Verify Send)
 * This uses the predefined Pattern/Template which is faster (usually <10s) and bypasses blacklist.
 */
export async function sendSms(mobile: string, code: string): Promise<boolean> {
    try {
        if (!mobile.startsWith("0")) {
            mobile = "0" + mobile;
        }

        const url = "https://api.sms.ir/v1/send/verify";

        const payload = {
            mobile: mobile,
            templateId: SMS_TEMPLATE_ID,
            parameters: [
                { name: "Code", value: code } // Most common parameter name is "Code" or "CODE"
            ]
        };

        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-API-KEY": SMS_API_Key,
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("SMS API Error:", response.status, errorText);
            return false;
        }

        const data: SmsResponse = await response.json();

        // In sms.ir v2, status 1 means success
        if (data.status === 1) {
            return true;
        }

        console.warn("SMS API returned non-success status:", data);
        return false;

    } catch (error) {
        console.error("Failed to send SMS:", error);
        return false;
    }
}
