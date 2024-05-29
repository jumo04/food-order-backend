import { AuthPayLoad } from "../dto/Auth.dto";
import { Request, Response, NextFunction } from "express";
import { ValidateSignature } from "../utils";

declare global{
    namespace Express{
        interface Request{
            user?: AuthPayLoad
        }
    }
}

export const Authenticate = async (req: Request, res: Response, next: NextFunction) => {
    const validateSignature = await ValidateSignature(req);
    if (!validateSignature) {
        return res.json({ 'message': 'Authorization token not found' })
    }
    next();
}