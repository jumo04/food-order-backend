import { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN } from "../config";
//Email


//Notifictions

//OTP

export const GenerateOtp = () => {
    const otp = Math.floor(1000 + Math.random() * 90000);
    let otp_expiry = new Date();
    otp_expiry.setTime(new Date().getTime() + (30 * 60 * 1000));
    return {otp, otp_expiry}
}

export const onRequestOtp = async (otp: number, toPhoneNumber: string) => {
    const accountSid = TWILIO_ACCOUNT_SID;
    const authToken = TWILIO_AUTH_TOKEN;
    
    const client = require('twilio')(accountSid, authToken);

    const response = await client.messages.create({
        body: `Your OTP is ${otp}`,
        from: '+14793516129',
        to: '+18777804236'
    });

    if (response) {
        return response
    }
}

// Payment notifications ro emails