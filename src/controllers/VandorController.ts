import { Request, Response, NextFunction } from "express";
import { FindVandor, GetVendorById } from ".";
import { ValidatePassword, GenerateSignature } from "../utils";
import { UpdateVandorInput, VandorLoginInputs } from "../dto";
import { Food } from "../models";
import { CreateFoodInput } from "../dto";



export const VandorLogin = async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = <VandorLoginInputs>req.body;
    const existingVandor = await FindVandor(undefined, email);
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
        const vandor = await FindVandor(user._id);
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
        const vandor = await FindVandor(user._id);
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

//adding a update vandor cover profile function
export const UpdateVandorCoverImage = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    if (user) {
        const vandor = await FindVandor(user._id);
        if (vandor !== null) {
            const files = req.files as [Express.Multer.File];
            const images = files.map((file: Express.Multer.File) => file.filename );
            vandor!.coverImage.push(...images);
            const saveResult = await vandor!.save();
            if (saveResult) {
                return res.json(saveResult);
            }
        }
    }
    return res.json({ 'message': 'Vandor not found'});
}

export const UpdateVandorService = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    if (user) {
        const vandor = await FindVandor(user._id);
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


export const AddFood = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    if (user) {

        const { name, description, category, price, foodType, readyTime } = <CreateFoodInput>req.body

        const vandor = await FindVandor(user._id);
        if (vandor !== null) {

            const files = req.files as [Express.Multer.File];
            const images = files.map((file: Express.Multer.File) => file.filename );
            const newFood = await Food.create({
                vandorId: vandor!._id,
                name,
                description,
                category,
                price,
                images: images,
                foodType,
                readyTime
            });

            vandor!.foods.push(newFood);
            const saveResult = await vandor!.save();
            if (saveResult) {
                return res.json(saveResult);
            }
        }

    }
    return res.json({ 'message': 'Something went wrong adding the food'});
}

export const GetFoods = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    if (user) {
        const foods = await Food.find({ vandorId: user._id });
        if (foods !== null) {
            return res.json(foods);
        }
    }
    return res.json({ 'message': 'Something went wrong getting the food'});
}