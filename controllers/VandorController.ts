import { Request, Response, NextFunction } from "express";
import { FindVendor, GetVendorById } from "../controllers";
import { ValidatePassword, GenerateSignature } from "../utils";
import { UpdateVandorInput, VandorLoginInputs } from "../dto";




export const VandorLogin = async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = <VandorLoginInputs>req.body;
    const existingVandor = await FindVendor(undefined, email);
    if (existingVandor !== null) {
        const isMatch = await ValidatePassword(password, existingVandor!.password, existingVandor!.salt);
        if (isMatch) {
            const signature =  GenerateSignature({ 
                _id: existingVandor!.id,
                email: existingVandor!.email,
                name: existingVandor!.name,
                foodTypes: existingVandor!.foodType
            })
            return res.json({ signature });
        }else{
            return res.json({ 'message': 'Wrong password'})   
        }
    }
    return res.json({ 'message': 'Vandor not found'})
}


export const GetVandorProfile = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    if (user) {
        const vandor = await FindVendor(user._id);
        if (vandor === null) {
            return res.json({ 'message': 'Vandor not found'})   
        }
        return res.json(vandor);
    }
}

export const UpdateVandorProfile = async (req: Request, res: Response, next: NextFunction) => {
    const { name, foodType, address, phone} = <UpdateVandorInput>req.body
    const user = req.user;
    if (user) {
        const vandor = await FindVendor(user._id);
        if (vandor !== null) {
            vandor!.name = name;
            vandor!.address = address;
            vandor!.phone = phone;
            vandor!.foodType = foodType;
            const saveResult = await vandor!.save();
            if (saveResult) {
                return res.json(saveResult);
            }
        }
        return res.json(vandor);
    }
    return res.json({ 'message': 'Vandor not found'});
}

export const UpdateVandorService = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    if (user) {
        const vandor = await FindVendor(user._id);
        if (vandor !== null) {
            vandor!.serviceAviable = !vandor!.serviceAviable;
            const saveResult = await vandor!.save();
            if (saveResult) {
                return res.json(saveResult);
            }
        }
        return res.json(vandor);
    }
    return res.json({ 'message': 'Vandor not found'});
}