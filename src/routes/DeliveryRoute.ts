import express, { Request, Response, NextFunction } from "express";
import { Authenticate } from "../middlewares";
import { DeliveryUserLogin, DeliveryUserProfile, DeliveryUserSingUp, UpdateDeliveryUserProfile, UpdateDeliveryStatus } from "../controllers";


const router = express.Router();


//singup
router.post("/signup", DeliveryUserSingUp);

//login
router.post("/login", DeliveryUserLogin);

//need authenthication
router.use(Authenticate);

//change service status
router.put("/change-status", UpdateDeliveryStatus);

//profile
router.get("/profile", DeliveryUserProfile);
router.patch("/profile", UpdateDeliveryUserProfile);



export { router as DeliveryRoute };
