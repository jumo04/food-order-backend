import bcrypt from "bcrypt";
import  jwt  from "jsonwebtoken";
import { VandorPayLoad } from "../dto";
import { APP_SECRET } from "../config";
import { AuthPayLoad } from "../dto/Auth.dto";
import { Request } from "express";

export const GenerateSalt = async () => {
    return await bcrypt.genSalt();
}

export const GeneratePassword = async (password: string, salt: string) => {
    return await bcrypt.hash(password, salt);
}

export const ValidatePassword = async (enteredPassword: string, savedPassword: string, salt: string) => {
    return await GeneratePassword(enteredPassword, salt) === savedPassword;
}

export const GenerateSignature =  (payload: AuthPayLoad) => {
    return jwt.sign(payload, APP_SECRET, { expiresIn: "1d" });
}

export const ValidateSignature = async (req: Request) => {
    const signature = req.get("Authorization");
    if (signature) {
        const payload = await jwt.verify(signature!, APP_SECRET) as AuthPayLoad;
        req.user = payload;
        return true;
    }
    return false;
}
