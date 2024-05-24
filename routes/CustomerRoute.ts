import express, { Request, Response, NextFunction } from "express";
import { CreateCustomer, CustomerLogin, GetCustomerProfile, UpdateCustomerProfile, VerifyCustomer, RequestOtp } from "../controllers/CustomerController";
import { Authenticate } from "../middlewares";

const router = express.Router();

//singup
router.post('/signup', CreateCustomer);

//login
router.post('/login', CustomerLogin);

//need authenthication
router.use(Authenticate);

//profile
router.get('/profile', GetCustomerProfile);
router.patch('/profile', UpdateCustomerProfile);
//verify customer account
router.post('/verify', VerifyCustomer);

//otp
router.get('/otp', RequestOtp);

// //cart
// router.post('/cart', AddToCart);
// router.get('/cart', GetCart);
// router.patch('/cart', UpdateCart);
// router.delete('/cart', DeleteCart);

// //order
// router.post('/order', CreateOrder);
// router.get('/order', GetOrder);

// //payment
// router.post('/payment', CreatePayment);
// router.get('/payment', GetPayment);


export { router as CustomerRoute }
