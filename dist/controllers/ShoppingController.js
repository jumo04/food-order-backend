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
exports.GetRestaurantById = exports.SearchFood = exports.GetIn30Minutes = exports.GetTopRestaurants = exports.GetFoodAvailability = void 0;
const models_1 = require("../models");
const GetFoodAvailability = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { pincode } = req.params;
    const result = yield models_1.Vandor.find({ pincode: pincode, serviceAviable: true })
        .sort([['rating', 'descending']])
        .populate('foods');
    if (result.length > 0) {
        return res.status(200).json(result);
    }
    return res.status(40).json({ message: 'Data not found' });
});
exports.GetFoodAvailability = GetFoodAvailability;
const GetTopRestaurants = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield models_1.Vandor.find({ serviceAviable: true })
        .sort([['rating', 'descending']])
        .limit(10);
    if (result.length > 0) {
        return res.status(200).json(result);
    }
    return res.status(40).json({ message: 'Data not found' });
});
exports.GetTopRestaurants = GetTopRestaurants;
const GetIn30Minutes = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { pincode } = req.params;
    const result = yield models_1.Vandor.find({ pincode: pincode, serviceAviable: true })
        .sort([['rating', 'descending']])
        .populate('foods');
    if (result.length > 0) {
        let foodList = [];
        result.map(vandor => {
            const foods = vandor.foods;
            foodList.push(...foods.filter(food => food.readyTime < 30));
        });
        return res.status(200).json(foodList);
    }
    return res.status(40).json({ message: 'Data not found' });
});
exports.GetIn30Minutes = GetIn30Minutes;
const SearchFood = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { pincode } = req.params;
    const result = yield models_1.Vandor.find({ pincode: pincode, serviceAviable: true })
        .populate('foods');
    if (result.length > 0) {
        let foodList = [];
        result.map(vandor => foodList.push(...vandor.foods));
        return res.status(200).json(foodList);
    }
    return res.status(40).json({ message: 'Data not found' });
});
exports.SearchFood = SearchFood;
const GetRestaurantById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield models_1.Vandor.findById(id).populate('foods');
    if (result) {
        return res.status(200).json(result);
    }
    return res.status(40).json({ message: 'Data not found' });
});
exports.GetRestaurantById = GetRestaurantById;
//# sourceMappingURL=ShoppingController.js.map