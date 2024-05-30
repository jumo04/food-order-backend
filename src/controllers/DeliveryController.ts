import { Request, Response, NextFunction } from "express";
import { DeliveryUserInput, EditCustomerProfileInputs, UserLoginInputs } from "../dto";
import { validate } from "class-validator";
import { plainToClass } from "class-transformer";
import { Delivery} from "../models";
import { GeneratePassword, GenerateSalt, GenerateSignature, ValidatePassword } from "../utils";
// singup and create customer

export const DeliveryUserSingUp = async (req: Request, res: Response, next: NextFunction) => {
    const deliveryUser = plainToClass(DeliveryUserInput, req.body);

    const inputErrors = await validate(deliveryUser, { validationError: { target: true } });
    if (inputErrors.length > 0) {
        return res.status(400).json(inputErrors);
    }

    const { email, phone, password, address, firstName, lastName, pincode } = deliveryUser;

    const salt = await GenerateSalt();
    const userPassword = await GeneratePassword(password, salt);

    const existingDeliveryUser = await Delivery.findOne({ email });
    if (existingDeliveryUser) {
        return res.status(400).json({ message: ' a delivert User already exists' });
    }
    
    const result  = await Delivery.create({
        email,
        phone,
        password: userPassword,
        salt,
        verified: false,
        lat: 0,
        lng: 0,
        firstName: firstName,
        lastName: lastName,
        address: address,
        isAvailable: false,
        pincode: pincode
    });

    if (result) {
        const signature = GenerateSignature({
            _id: result.id,
            email: result.email,
            verified: result.verified
        });

        //send the result to the client
        return res.status(201).json({ signature, verified: result.verified, email: result.email });
    }

}

//login

export const DeliveryUserLogin = async (req: Request, res: Response, next: NextFunction) => {
    
    const loginInputs = plainToClass(UserLoginInputs, req.body);
    const inputErrors = await validate(loginInputs, { validationError: { target: true } });
    if (inputErrors.length > 0) {
        return res.status(400).json(inputErrors);
    }

    const { email, password } = loginInputs;
    const deliveryUser = await Delivery.findOne({ email });
    if (deliveryUser) {
        const validation = await ValidatePassword(password, deliveryUser.password, deliveryUser.salt);
        if (validation) {
            const signature = GenerateSignature({
                _id: deliveryUser.id,
                email: deliveryUser.email,
                verified: deliveryUser.verified
            });
            return res.status(201).json({ signature, verified: deliveryUser.verified, email: deliveryUser.email });
        }else{
            //pass donst match
        }
    }
    return res.status(400).json({ message: 'Invalid email or password' });
}

// profile

export const DeliveryUserProfile = async (req: Request, res: Response, next: NextFunction) => {
    const deliveryUser = req.user;

    if (deliveryUser) {
        const profile = await Delivery.findById(deliveryUser._id);

        if (profile) {
            return res.status(200).json(profile);
        }
    }

    return res.status(404).json({ message: 'Profile not found' });
}

export const UpdateDeliveryUserProfile = async (req: Request, res: Response, next: NextFunction) => {
    const deliveryUser = req.user;

    const profileInputs = plainToClass(EditCustomerProfileInputs, req.body);

    const inputErrors = await validate(profileInputs, { validationError: { target: true } });

    if (inputErrors.length > 0) {
        return res.status(400).json(inputErrors);
    }

    const { firstName, lastName, address } = profileInputs;

    if (deliveryUser) {
        const profile = await Delivery.findById(deliveryUser._id);
        if (profile) {
            profile.firstName = firstName;
            profile.lastName = lastName;
            profile.address = address;
            const result = await profile.save();

            return res.status(200).json( result );
        }
    }
    return res.status(404).json({ message: 'Profile not found' });

    
}


export const UpdateDeliveryStatus = async (req: Request, res: Response, next: NextFunction) => {

    const deliveryUser = req.user;
    if (deliveryUser) {
        const { lat, lng } = req.body;
        
        const profile = await Delivery.findById(deliveryUser._id);
        if (profile) {
            if (lat && lng) {
                profile.lat = lat;
                profile.lng = lng;
            }
            profile.isAvailable = !profile.isAvailable;
            const result = await profile.save();
            return res.status(200).json(result);
        }
    }
    return res.status(404).json({ message: 'Error with Update Delivery Status' });
}