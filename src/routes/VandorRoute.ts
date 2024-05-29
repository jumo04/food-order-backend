import express, { Request, Response, NextFunction } from "express";
import {
  VandorLogin,
  GetVandorProfile,
  UpdateVandorProfile,
  UpdateVandorService,
  AddFood,
  GetFoods,
  UpdateVandorCoverImage,
  ProcessOrder,
  GetCurrentOrders,
  GetOrderDetails,
} from "../controllers";
import { Authenticate } from "../middlewares";

import multer from "multer";

const router = express.Router();

const imageStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "images");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now().toString() + "_" + file.originalname);
  },
});

//sacamos las imagenes
const images = multer({ storage: imageStorage }).array("images", 10);

router.post("/login", VandorLogin);
router.use(Authenticate);
router.get("/profile", GetVandorProfile);
router.patch("/coverimage", images, UpdateVandorCoverImage);
router.patch("/profile", UpdateVandorProfile);
router.patch("/service", UpdateVandorService);

//adding funtionalitys

router.post("/food", images, AddFood);
router.get("/foods", GetFoods);

router.get("/orders", GetCurrentOrders);
router.put("/order/:id/process", ProcessOrder);
router.get("/order/:id", GetOrderDetails);

export { router as VandorRoute };
