// Netlify function - sendSMS (Fast2SMS example)
const axios = require("axios");

exports.handler = async (event) => {
  try {
    const { phoneNumber, message, provider } = JSON.parse(event.body);

    // Basic validation
    if (!phoneNumber || !message) {
      return { statusCode: 400, body: JSON.stringify({ success: false, message: "phoneNumber and message required" }) };
    }

    // Choose provider (default: fast2sms). Provider selection allows later using Twilio or WhatsApp.
    if (provider === "twilio") {
      // Twilio SMS
      const accountSid = process.env.TWILIO_ACCOUNT_SID;
      const authToken = process.env.TWILIO_AUTH_TOKEN;
      const from = process.env.TWILIO_PHONE_NUMBER; // e.g. +1XXXXXXXXX or +91...
      const basicAuth = Buffer.from(`${accountSid}:${authToken}`).toString("base64");

      const url = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;
      const form = new URLSearchParams();
      form.append("From", from);
      form.append("To", phoneNumber);
      form.append("Body", message);

      const resp = await axios.post(url, form.toString(), {
        headers: {
          Authorization: `Basic ${basicAuth}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      return { statusCode: 200, body: JSON.stringify({ success: true, provider: "twilio", data: resp.data }) };
    } else {
      // Default: Fast2SMS (India)
      const apiKey = process.env.FAST2SMS_API_KEY;
      if (!apiKey) throw new Error("Missing FAST2SMS_API_KEY");

      const payload = {
        route: "v3",
        sender_id: "TXTIND",
        message,
        language: "english",
        flash: 0,
        numbers: phoneNumber
      };

      const resp = await axios.post("https://www.fast2sms.com/dev/bulkV2", payload, {
        headers: {
          authorization: apiKey,
          "Content-Type": "application/json",
        },
      });

      return { statusCode: 200, body: JSON.stringify({ success: true, provider: "fast2sms", data: resp.data }) };
    }
  } catch (err) {
    console.error("sendSMS error:", err?.response?.data || err.message || err);
    return { statusCode: 500, body: JSON.stringify({ success: false, error: err.message || "send failed" }) };
  }
};
