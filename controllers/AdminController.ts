import express,  { Request, Response, NextFunction} from "express";
import { CreateVandorInput } from "../dto";
import { Vandor } from "../models";
import { GeneratePassword, GenerateSalt } from "../utils";


export const FindVendor = async (id: string | undefined, email?: string ) => {
    if (email) {
        return await Vandor.findOne({ email: email });
    }else if (id) {
       return   await Vandor.findById(id);
    }
};

export const CreateVendor = async (req: Request, res: Response, next: NextFunction) => {
    const { name, ownerName, foodType, pincode, address, phone, email, password } = <CreateVandorInput>req.body

    const exitsVandor = await FindVendor(undefined, email);
    if (exitsVandor !== null) {
        return res.json({ 'message': 'Vandor already exists'})
    }  

    //generando a salt
    const salt = await GenerateSalt();
    //encriptando el password usando el salt
    const userPassword = await GeneratePassword(password, salt);

    const createVandor = await Vandor.create({
        name: name,
        ownerName: ownerName,
        foodType: foodType,
        pincode: pincode,
        address: address,
        phone: phone,
        email: email,
        password: userPassword,
        salt: salt,
        serviceAviable: false,
        coverImage: [],
        rating: 0
    })
    return res.json(createVandor)
}

export const GetVendors = async (req: Request, res: Response, next: NextFunction) => {
    const vandors = await Vandor.find();
    if (vandors === null) {
        return res.json({ 'message': 'Vandor not found'})   
    }
    return res.json(vandors);
}

export const GetVendorById = async (req: Request, res: Response, next: NextFunction) => {
    const vandor = await FindVendor(req.params.id);
    if (vandor === null) {
        return res.json({ 'message': 'Vandor not found'})   
    }
    return res.json(vandor);
}