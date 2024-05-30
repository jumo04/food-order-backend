import express, { Request, Response, NextFunction } from "express";
import {
  CreateCustomer,
  CustomerLogin,
  GetCustomerProfile,
  UpdateCustomerProfile,
  VerifyCustomer,
  RequestOtp,
  CreateOrder,
  GetOrders,
  GetOrder,
  AddToCart,
  DeleteCart,
  GetCart,
  VerifyOffer,
  CreatePayment
} from "../controllers";
import { Authenticate } from "../middlewares";

const router = express.Router();

//singup
router.post("/signup", CreateCustomer);

//login
router.post("/login", CustomerLogin);

//need authenthication
router.use(Authenticate);

//profile
router.get("/profile", GetCustomerProfile);
router.patch("/profile", UpdateCustomerProfile);
//verify customer account
router.post("/verify", VerifyCustomer);

//otp
router.get("/otp", RequestOtp);

// //cart
router.post("/cart", AddToCart);
router.get("/cart", GetCart);
router.delete("/cart", DeleteCart);

// //order
router.post("/create-order", CreateOrder);
router.get("/orders", GetOrders);
router.get("/order/:id", GetOrder);

//APPLY OFFER
router.get('/offer/verify/:id', VerifyOffer);

// //payment
router.post('/create-payment', CreatePayment);
// router.get('/payment', GetPayment);

export { router as CustomerRoute };
