import { Request, Response, NextFunction } from "express";
import { FindVandor, GetVendorById } from ".";
import { ValidatePassword, GenerateSignature } from "../utils";
import { ProcessOrderInput, UpdateVandorInput, VandorLoginInputs } from "../dto";
import { Customer, Food, Order } from "../models";
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

export const GetCurrentOrders = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    if (user) {
        const orders = await Order.find({ vandorId: user._id }).populate('items.food');
        if (orders != null) {
            return res.status(200).json(orders);
        }
    }
    return res.status(404).json({ message: 'Orders not found' });
}

export const GetOrderDetails = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    if (id) {
        const order = await Order.findById(id).populate('items.food');
        if (order != null) {
            return res.status(200).json(order);
        }
    }
    return res.status(404).json({ message: 'Order not found' });
}

export const ProcessOrder = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;

    const { status, remarks, time } = <ProcessOrderInput>req.body;

    if (id) {
        const order = await Order.findById(id);
        order.orderStatus = status;
        order.remarks = remarks;
        if (time){
            order.readyTime = time;
        }
        const saveResult = await order.save();
        if (saveResult) {
            return res.status(200).json(saveResult);
        }
    }
    return res.status(404).json({ message: 'Unable to process the order!' });

}