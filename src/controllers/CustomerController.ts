import express, { Request, Response, NextFunction } from "express";
import { CustomerInput, EditCustomerProfileInputs, UserLoginInputs } from "../dto";
import { validate } from "class-validator";
import { plainToClass } from "class-transformer";
import { Customer } from "../models";
import { GenerateOtp, GeneratePassword, GenerateSalt, GenerateSignature, onRequestOtp, ValidatePassword } from "../utils";

// singup and create customer

export const CreateCustomer = async (req: Request, res: Response, next: NextFunction) => {
    const customer = plainToClass(CustomerInput, req.body);

    const inputErrors = await validate(customer, { validationError: { target: true } });
    if (inputErrors.length > 0) {
        return res.status(400).json(inputErrors);
    }

    const { email, phone, password } = customer;

    const salt = await GenerateSalt();
    const userPassword = await GeneratePassword(password, salt);

    const { otp, otp_expiry } = GenerateOtp();

    const existingUser = await Customer.findOne({ email });
    if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
    }

    
    const result  = await Customer.create({
        email,
        phone,
        password: userPassword,
        salt,
        otp,
        otp_expiry,
        verified: false,
        lat: 0,
        lng: 0,
        firstName: '',
        lastName: '',
        address: ''
    });

    if (result) {

        //send the otp to customer
        // await onRequestOtp(otp, phone);

        /// generate the signature

        const signature = GenerateSignature({
            _id: result.id,
            email: result.email,
            verified: result.verified
        });

        //send the result to the client
        return res.status(201).json({ signature, verified: result.verified, email: result.email, otp });
    }

}

//login

export const CustomerLogin = async (req: Request, res: Response, next: NextFunction) => {
    
    const loginInputs = plainToClass(UserLoginInputs, req.body);
    const inputErrors = await validate(loginInputs, { validationError: { target: true } });
    if (inputErrors.length > 0) {
        return res.status(400).json(inputErrors);
    }

    const { email, password } = loginInputs;
    const customer = await Customer.findOne({ email });
    if (customer) {
        const validation = await ValidatePassword(password, customer.password, customer.salt);
        if (validation) {
            const signature = GenerateSignature({
                _id: customer.id,
                email: customer.email,
                verified: customer.verified
            });
            return res.status(200).json({ signature, verified: customer.verified, email: customer.email });
        }else{
            //pass donst match
        }
    }
    return res.status(400).json({ message: 'Invalid email or password' });
}

//verify customer account

export const VerifyCustomer =  async (req: Request, res: Response, next: NextFunction) => {
    const { otp } = req.body;
    const customer = req.user;

    if (customer){
        const profile = await Customer.findById(customer._id);
        if (profile) {
            
            if (profile.otp === parseInt(otp) && profile.otp_expiry >= new Date()) {
                profile.verified = true;
                const updateCustomerResponse = await profile.save();
                const signature = GenerateSignature({
                    _id: updateCustomerResponse.id,
                    email: updateCustomerResponse.email,
                    verified: updateCustomerResponse.verified
                });

                return res.status(201).json({ signature, verified: updateCustomerResponse.verified, email: updateCustomerResponse.email });
            }
        }
    }

    return res.status(400).json({ message: 'Invalid otp' });
}

// requist otp

export const RequestOtp = async (req: Request, res: Response, next: NextFunction) => {

    const customer = req.user;

    if (customer) {
        const profile = await Customer.findById(customer._id);
        if (profile) {
            const { otp, otp_expiry } = GenerateOtp();
            profile.otp = otp;
            profile.otp_expiry = otp_expiry;
            await profile.save();
            // await onRequestOtp(otp, profile.phone);// aca es para mandar el mensaje cambiar de twilio
            return res.status(201).json({ message: 'Otp sent successfully', otp });

        }
    }
}

// profile

export const GetCustomerProfile = async (req: Request, res: Response, next: NextFunction) => {
    const customer = req.user;

    if (customer) {
        const profile = await Customer.findById(customer._id);

        if (profile) {
            return res.status(200).json(profile);
        }
    }

    return res.status(404).json({ message: 'Profile not found' });
}

export const UpdateCustomerProfile = async (req: Request, res: Response, next: NextFunction) => {
    const customer = req.user;

    const profileInputs = plainToClass(EditCustomerProfileInputs, req.body);

    const inputErrors = await validate(profileInputs, { validationError: { target: true } });

    if (inputErrors.length > 0) {
        return res.status(400).json(inputErrors);
    }

    const { firstName, lastName, address } = profileInputs;

    if (customer) {
        const profile = await Customer.findById(customer._id);
        if (profile) {
            profile.firstName = firstName;
            profile.lastName = lastName;
            profile.address = address;
            const result = await profile.save();

            return res.status(200).json( result );
        }
    }   
    
}


//cart

export const AddToCart = (req: Request, res: Response, next: NextFunction) => {
    return res.json('hello from customer');
}

//order

export const CreateOrder = (req: Request, res: Response, next: NextFunction) => {
    return res.json('hello from customer');
}


// payment

export const Payment = (req: Request, res: Response, next: NextFunction) => {
    return res.json('hello from customer');
}