import express,  { Request, Response, NextFunction} from "express";
import { CreateVandorInput } from "../dto";
import { Delivery, Vandor } from "../models";
import { GeneratePassword, GenerateSalt } from "../utils";
import Transaction from "../models/Transaction";


export const FindVandor = async (id: string | undefined, email?: string ) => {
    if (email) {
        return await Vandor.findOne({ email: email });
    }else if (id) {
       return   await Vandor.findById(id);
    }
};

export const CreateVendor = async (req: Request, res: Response, next: NextFunction) => {
    const { name, ownerName, foodType, pincode, address, phone, email, password } = <CreateVandorInput>req.body

    const exitsVandor = await FindVandor(undefined, email);
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
        rating: 0,
        foods: [],
        lat: 0,
        lng: 0
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
    const vandor = await FindVandor(req.params.id);
    if (vandor === null) {
        return res.json({ 'message': 'Vandor not found'})   
    }
    return res.json(vandor);
}

export const GetTransactions = async (req: Request, res: Response, next: NextFunction) => {
    const transactions = await Transaction.find();
    if (transactions === null) {
        return res.json({ 'message': 'Transactions not found'})   
    }
    return res.json(transactions);
}

export const GetTransactionById = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id
    const transaction = await Transaction.findById(req.params.id);
    if (transaction) {
        return res.status(200).json(transaction)   
    }
    return res.status(404).json({ 'message': 'Transaction not avaible'});
}

export const VerifyDeliveryUser = async (req: Request, res: Response, next: NextFunction) => {
    const { _id, status } = req.body;

    if (_id) {
        const profile = await Delivery.findById(_id);
        if (profile) {
            profile.verified = status;
            const result = await profile.save();
            return res.status(200).json(result);
        }
    }

    return res.status(404).json({ 'message': 'Some thing went wrong verifying the delivery user'});
}

export const GetDeliveryUser = async (req: Request, res: Response, next: NextFunction) => {

    const deliveryUsers = await Delivery.find();
    if (deliveryUsers.length > 0) {
            return res.status(200).json(deliveryUsers);
    }

    return res.status(404).json({ 'message': 'Delivery user not found'});
}