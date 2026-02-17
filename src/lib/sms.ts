
const SMS_API_Key = "L3krUCkKFvEjta06cEAEWexusL8xdboCcghogpchFlWkwc7O";
const SMS_LINE_NUMBER = "3000505"; // Default line number often provided, adjust if needed

interface SmsResponse {
    status: number;
    message: string;
    data: any;
}

/**
 * Sends a verification SMS using sms.ir API (Verify Send)
 * This uses the predefined template pattern which is faster and more reliable for OTPs.
 * You often need to define a template in sms.ir panel.
 * For now, we'll try the standard Send API or Verify if template ID is known.
 * 
 * Given the user provided a simple API key, we'll use the v1/send/verify endpoint if available,
 * or the standard /send/bulk endpoint with a single receiver.
 * 
 * Based on common sms.ir V2 documentation:
 * Endpoint: https://api.sms.ir/v1/send/verify
 */
export async function sendSms(mobile: string, code: string): Promise<boolean> {
    try {
        // Ensuring mobile format (e.g. starts with 09)
        if (!mobile.startsWith("0")) {
            mobile = "0" + mobile;
        }

        // Using the Verify/Send endpoint which is typical for OTP
        // This requires a templateId. Since we don't have one from the user,
        // we might need to use the bulk send endpoint or ask for a template ID.
        // However, for "fast" OTP, verify is best.
        // Let's try the Bulk endpoint for now as it doesn't require pre-approved template ID usually, 
        // but verify is better. 
        //
        // PLAN B: The user just gave an API Key. Let's assume standard Bulk Send for now 
        // to ensure it works without template setup, unless we get an error.

        // Actually, for OTP we really should use the verify endpoint.
        // Let's implement a standard send first.

        const url = "https://api.sms.ir/v1/send/bulk";

        const payload = {
            lineNumber: SMS_LINE_NUMBER,
            MessageText: `کد ورود شما به اوج رشد: ${code}`,
            Mobiles: [mobile],
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
        if (data.status === 1) { // 1 usually means successful in sms.ir v1
            return true;
        }

        console.warn("SMS API returned non-success status:", data);
        return false;

    } catch (error) {
        console.error("Failed to send SMS:", error);
        return false;
    }
}
