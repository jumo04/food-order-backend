import express, { Request, Response, NextFunction } from "express";
import { GetFoodAvailability, GetTopRestaurants, GetIn30Minutes, SearchFood, GetRestaurantById } from "../controllers";


const router = express.Router();

//food avaiability

router.get('/:pincode', GetFoodAvailability);

//top restaurants

router.get('/top-restaurants/:pincode', GetTopRestaurants);

//food avaible in 30 minutes

router.get('/in-30-minutes/:pincode', GetIn30Minutes);

//search food

router.get('/search/:pincode', SearchFood);

// find restaurant by id

router.get('/restaurant/:id', GetRestaurantById);


export { router as ShoppingRoute };
