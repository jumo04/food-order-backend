import { Request, Response, NextFunction } from "express";
import { FindVandor, GetVendorById } from ".";
import { ValidatePassword, GenerateSignature } from "../utils";
import {
    CreateOfferInputs,
  ProcessOrderInput,
  UpdateVandorInput,
  VandorLoginInputs,
} from "../dto";
import { Customer, Food, Offer, Order } from "../models";
import { CreateFoodInput } from "../dto";

export const VandorLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = <VandorLoginInputs>req.body;
  const existingVandor = await FindVandor(undefined, email);
  if (existingVandor !== null) {
    const isMatch = await ValidatePassword(
      password,
      existingVandor!.password,
      existingVandor!.salt
    );
    if (isMatch) {
      const signature = GenerateSignature({
        _id: existingVandor!.id,
        email: existingVandor!.email,
        name: existingVandor!.name,
        foodTypes: existingVandor!.foodType,
      });
      return res.json({ signature });
    } else {
      return res.json({ message: "Wrong password" });
    }
  }
  return res.json({ message: "Vandor not found" });
};

export const GetVandorProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;
  if (user) {
    const vandor = await FindVandor(user._id);
    if (vandor === null) {
      return res.json({ message: "Vandor not found" });
    }
    return res.json(vandor);
  }
};

export const UpdateVandorProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name, foodType, address, phone } = <UpdateVandorInput>req.body;
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
  return res.json({ message: "Vandor not found" });
};

//adding a update vandor cover profile function
export const UpdateVandorCoverImage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;
  if (user) {
    const vandor = await FindVandor(user._id);
    if (vandor !== null) {
      const files = req.files as [Express.Multer.File];
      const images = files.map((file: Express.Multer.File) => file.filename);
      vandor!.coverImage.push(...images);
      const saveResult = await vandor!.save();
      if (saveResult) {
        return res.json(saveResult);
      }
    }
  }
  return res.json({ message: "Vandor not found" });
};

export const UpdateVandorService = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;
  const { lat, lng } = req.body;
  if (user) {
    const existingVandor = await FindVandor(user._id);
    if (existingVandor !== null) {
      existingVandor!.serviceAviable = !existingVandor.serviceAviable;
      if(lat && lng){
        existingVandor.lat = lat;
        existingVandor.lng = lng;
      }
      const saveResult = await existingVandor.save();
      if (saveResult) {
        return res.json(saveResult);
      }
    }
    return res.json(existingVandor);
  }
  return res.json({ message: "Vandor not found" });
};

export const AddFood = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;
  if (user) {
    const { name, description, category, price, foodType, readyTime } = <
      CreateFoodInput
    >req.body;

    const vandor = await FindVandor(user._id);
    if (vandor !== null) {
      const files = req.files as [Express.Multer.File];
      const images = files.map((file: Express.Multer.File) => file.filename);
      const newFood = await Food.create({
        vandorId: vandor!._id,
        name,
        description,
        category,
        price,
        images: images,
        foodType,
        readyTime,
      });

      vandor!.foods.push(newFood);
      const saveResult = await vandor!.save();
      if (saveResult) {
        return res.json(saveResult);
      }
    }
  }
  return res.json({ message: "Something went wrong adding the food" });
};

export const GetFoods = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;
  if (user) {
    const foods = await Food.find({ vandorId: user._id });
    if (foods !== null) {
      return res.json(foods);
    }
  }
  return res.json({ message: "Something went wrong getting the food" });
};

export const GetCurrentOrders = async (req: Request, res: Response, next: NextFunction) => {
  const user = req.user;
  if (user) {
    const orders = await Order.find({ vandorId: user._id }).populate(
      "items.food"
    );
    if (orders != null) {
      return res.status(200).json(orders);
    }
  }
  return res.status(404).json({ message: "Orders not found" });
};

export const GetOrderDetails = async (req: Request,res: Response,next: NextFunction) => {
  const id = req.params.id;
  if (id) {
    const order = await Order.findById(id).populate("items.food");
    if (order != null) {
      return res.status(200).json(order);
    }
  }
  return res.status(404).json({ message: "Order not found" });
};

export const ProcessOrder = async (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.id;

  const { status, remarks, time } = <ProcessOrderInput>req.body;

  if (id) {
    const order = await Order.findById(id);
    order.orderStatus = status;
    order.remarks = remarks;
    if (time) {
      order.readyTime = time;
    }
    const saveResult = await order.save();
    if (saveResult) {
      return res.status(200).json(saveResult);
    }
  }
  return res.status(404).json({ message: "Unable to process the order!" });
};

export const GetOffers = async (req: Request, res: Response, next: NextFunction) => {
  const user = req.user;
  if (user) {

    //one way to do it
    // const offers = await Offer.find({ vandors: user._id }).populate("vandors");

    // const offersGeneric = await Offer.find({ offerType: "GENERIC" }).populate("vandors");

    // const 

    // if (offers != null) {
    //   return res.status(200).json(offers);
    // }
    let finalOffers = Array();

    const offers = await Offer.find().populate("vandors");

    //another way to do it
    if(offers){
      offers.map(offer => {
        if(offer.vandors){
          offer.vandors.map(vandor => {
            if(vandor._id.toString() === user._id){
              finalOffers.push(offer);
            }
          })
        }
        if(offer.offerType === "GENERIC"){
          finalOffers.push(offer);
        }
      });
    }
    return res.status(200).json(finalOffers);

  }
  return res.status(404).json({ message: "Offers not found" });
};

export const CreateOffer = async (req: Request, res: Response, next: NextFunction) => {
  const user = req.user;
  if (user) {
    const {
      title,
      description,
      offerType,
      offerAmount,
      pincode,
      promoCode,
      promoType,
      startValidaty,
      endValidity,
      bins,
      bank,
      minValue,
      isActive,
    } = <CreateOfferInputs>req.body;

    const vendor = await FindVandor(user._id);
    if (vendor) {
      const newOffer = await Offer.create({
        title,
        description,
        offerType,
        offerAmount,
        pincode,
        promoCode,
        promoType,
        startValidaty,
        endValidity,
        bins,
        bank,
        minValue,
        isActive,
        vandors: [vendor],
      });

      //create a new offer place ho
      console.log(newOffer);
      
      
      return res.status(200).json(newOffer);
      // vendor.offers.push(newOffer);
    }
  }
  return res.status(404).json({ message: "Offers not found" });
};

export const UpdateOffer = async (req: Request, res: Response, next: NextFunction) => {
  const user = req.user;

  const id = req.params.id;
  if (user) {
    const {
      title,
      description,
      offerType,
      offerAmount,
      pincode,
      promoCode,
      promoType,
      startValidaty,
      endValidity,
      bins,
      bank,
      minValue,
      isActive,
    } = <CreateOfferInputs>req.body;

    const currentOffer = await Offer.findById(id);


    if (currentOffer) {
      const vendor = await FindVandor(user._id);
      if (vendor) {
        currentOffer.title = title;
        currentOffer.description = description;
        currentOffer.offerType = offerType;
        currentOffer.offerAmount = offerAmount;
        currentOffer.pincode = pincode;
        currentOffer.promoCode = promoCode;
        currentOffer.promoType = promoType;
        currentOffer.startValidaty = startValidaty;
        currentOffer.endValidity = endValidity;
        currentOffer.bins = bins;
        currentOffer.bank = bank;
        currentOffer.minValue = minValue;
        currentOffer.isActive = isActive;
        const result = await currentOffer.save();
        if (result) {
          return res.status(200).json(result);
        }
      }
    }
  }
  return res.status(404).json({ message: "Offers not found" });
};
