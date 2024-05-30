import express, { Request, Response, NextFunction } from "express";
import { Vandor, FoodDoc, Offer } from "../models";


export const GetFoodAvailability = async (req: Request, res: Response, next: NextFunction) => {

    const { pincode } = req.params;

    const result = await Vandor.find({ pincode: pincode, serviceAviable: true })
    .sort([['rating', 'descending']])
    .populate('foods');
    if (result.length > 0) {
        return res.status(200).json(result);
    }

    return res.status(40).json({ message: 'Data not found' });
}

export const GetTopRestaurants = async (req: Request, res: Response, next: NextFunction) => {

    const result = await Vandor.find({serviceAviable: true })
    .sort([['rating', 'descending']])
    .limit(10)

    if (result.length > 0) {
        return res.status(200).json(result);
    }
    return res.status(40).json({ message: 'Data not found' });
}

export const GetIn30Minutes = async (req: Request, res: Response, next: NextFunction) => {

    const { pincode } = req.params;
    const result = await Vandor.find({ pincode: pincode, serviceAviable: true })
    .sort([['rating', 'descending']])
    .populate('foods');

    if (result.length > 0) {
        let foodList:any = [];
        
        result.map(vandor => {
            const foods = vandor.foods as [FoodDoc]
            foodList.push(...foods.filter(food => food.readyTime < 30));
        });

        return res.status(200).json(foodList);
    }
    return res.status(40).json({ message: 'Data not found' });
}

export const SearchFood = async (req: Request, res: Response, next: NextFunction) => {

    const { pincode } = req.params;

    const result = await Vandor.find({ pincode: pincode, serviceAviable: true })
    .populate('foods');

    if (result.length > 0) {

        let foodList:any = [];

        result.map(vandor => foodList.push(...vandor.foods));
        return res.status(200).json(foodList);
    }

    return res.status(40).json({ message: 'Data not found' });

}

export const GetRestaurantById = async (req: Request, res: Response, next: NextFunction) => {

    const { id } = req.params;

    const result = await Vandor.findById(id).populate('foods');

    if (result) {
        return res.status(200).json(result);
    }   

    return res.status(40).json({ message: 'Data not found' });
}

export const GetAvailableOffers = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    const pincode = req.params.pincode;
    //CONTROLLAR EL ERROR DE AUTORIZACION UNA VEZ QUE EXPIRE EL TOKEN AVISAR 

    const offers = await Offer.find({pincode: pincode, isActive: true});

    if (offers) {
        return res.status(200).json(offers);
    }
    return res.status(40).json({ message: 'Offers not found' });

}