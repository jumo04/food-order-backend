"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Payment = exports.CreateOrder = exports.AddToCart = exports.UpdateCustomerProfile = exports.GetCustomerProfile = exports.RequestOtp = exports.VerifyCustomer = exports.CustomerLogin = exports.CreateCustomer = void 0;
const dto_1 = require("../dto");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const models_1 = require("../models");
const utils_1 = require("../utils");
// singup and create customer
const CreateCustomer = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const customer = (0, class_transformer_1.plainToClass)(dto_1.CustomerInput, req.body);
    const inputErrors = yield (0, class_validator_1.validate)(customer, { validationError: { target: true } });
    if (inputErrors.length > 0) {
        return res.status(400).json(inputErrors);
    }
    const { email, phone, password } = customer;
    const salt = yield (0, utils_1.GenerateSalt)();
    const userPassword = yield (0, utils_1.GeneratePassword)(password, salt);
    const { otp, otp_expiry } = (0, utils_1.GenerateOtp)();
    const existingUser = yield models_1.Customer.findOne({ email });
    if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
    }
    const result = yield models_1.Customer.create({
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
        const signature = (0, utils_1.GenerateSignature)({
            _id: result.id,
            email: result.email,
            verified: result.verified
        });
        //send the result to the client
        return res.status(201).json({ signature, verified: result.verified, email: result.email, otp });
    }
});
exports.CreateCustomer = CreateCustomer;
//login
const CustomerLogin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const loginInputs = (0, class_transformer_1.plainToClass)(dto_1.UserLoginInputs, req.body);
    const inputErrors = yield (0, class_validator_1.validate)(loginInputs, { validationError: { target: true } });
    if (inputErrors.length > 0) {
        return res.status(400).json(inputErrors);
    }
    const { email, password } = loginInputs;
    const customer = yield models_1.Customer.findOne({ email });
    if (customer) {
        const validation = yield (0, utils_1.ValidatePassword)(password, customer.password, customer.salt);
        if (validation) {
            const signature = (0, utils_1.GenerateSignature)({
                _id: customer.id,
                email: customer.email,
                verified: customer.verified
            });
            return res.status(200).json({ signature, verified: customer.verified, email: customer.email });
        }
        else {
            //pass donst match
        }
    }
    return res.status(400).json({ message: 'Invalid email or password' });
});
exports.CustomerLogin = CustomerLogin;
//verify customer account
const VerifyCustomer = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { otp } = req.body;
    const customer = req.user;
    if (customer) {
        const profile = yield models_1.Customer.findById(customer._id);
        if (profile) {
            if (profile.otp === parseInt(otp) && profile.otp_expiry >= new Date()) {
                profile.verified = true;
                const updateCustomerResponse = yield profile.save();
                const signature = (0, utils_1.GenerateSignature)({
                    _id: updateCustomerResponse.id,
                    email: updateCustomerResponse.email,
                    verified: updateCustomerResponse.verified
                });
                return res.status(201).json({ signature, verified: updateCustomerResponse.verified, email: updateCustomerResponse.email });
            }
        }
    }
    return res.status(400).json({ message: 'Invalid otp' });
});
exports.VerifyCustomer = VerifyCustomer;
// requist otp
const RequestOtp = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const customer = req.user;
    if (customer) {
        const profile = yield models_1.Customer.findById(customer._id);
        if (profile) {
            const { otp, otp_expiry } = (0, utils_1.GenerateOtp)();
            profile.otp = otp;
            profile.otp_expiry = otp_expiry;
            yield profile.save();
            // await onRequestOtp(otp, profile.phone);// aca es para mandar el mensaje cambiar de twilio
            return res.status(201).json({ message: 'Otp sent successfully', otp });
        }
    }
});
exports.RequestOtp = RequestOtp;
// profile
const GetCustomerProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const customer = req.user;
    if (customer) {
        const profile = yield models_1.Customer.findById(customer._id);
        if (profile) {
            return res.status(200).json(profile);
        }
    }
    return res.status(404).json({ message: 'Profile not found' });
});
exports.GetCustomerProfile = GetCustomerProfile;
const UpdateCustomerProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const customer = req.user;
    const profileInputs = (0, class_transformer_1.plainToClass)(dto_1.EditCustomerProfileInputs, req.body);
    const inputErrors = yield (0, class_validator_1.validate)(profileInputs, { validationError: { target: true } });
    if (inputErrors.length > 0) {
        return res.status(400).json(inputErrors);
    }
    const { firstName, lastName, address } = profileInputs;
    if (customer) {
        const profile = yield models_1.Customer.findById(customer._id);
        if (profile) {
            profile.firstName = firstName;
            profile.lastName = lastName;
            profile.address = address;
            const result = yield profile.save();
            return res.status(200).json(result);
        }
    }
});
exports.UpdateCustomerProfile = UpdateCustomerProfile;
//cart
const AddToCart = (req, res, next) => {
    return res.json('hello from customer');
};
exports.AddToCart = AddToCart;
//order
const CreateOrder = (req, res, next) => {
    return res.json('hello from customer');
};
exports.CreateOrder = CreateOrder;
// payment
const Payment = (req, res, next) => {
    return res.json('hello from customer');
};
exports.Payment = Payment;
//# sourceMappingURL=CustomerController.js.map