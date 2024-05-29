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
exports.GetFoods = exports.AddFood = exports.UpdateVandorService = exports.UpdateVandorCoverImage = exports.UpdateVandorProfile = exports.GetVandorProfile = exports.VandorLogin = void 0;
const _1 = require(".");
const utils_1 = require("../utils");
const models_1 = require("../models");
const VandorLogin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const existingVandor = yield (0, _1.FindVandor)(undefined, email);
    if (existingVandor !== null) {
        const isMatch = yield (0, utils_1.ValidatePassword)(password, existingVandor.password, existingVandor.salt);
        if (isMatch) {
            const signature = (0, utils_1.GenerateSignature)({
                _id: existingVandor.id,
                email: existingVandor.email,
                name: existingVandor.name,
                foodTypes: existingVandor.foodType
            });
            return res.json({ signature });
        }
        else {
            return res.json({ 'message': 'Wrong password' });
        }
    }
    return res.json({ 'message': 'Vandor not found' });
});
exports.VandorLogin = VandorLogin;
const GetVandorProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (user) {
        const vandor = yield (0, _1.FindVandor)(user._id);
        if (vandor === null) {
            return res.json({ 'message': 'Vandor not found' });
        }
        return res.json(vandor);
    }
});
exports.GetVandorProfile = GetVandorProfile;
const UpdateVandorProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, foodType, address, phone } = req.body;
    const user = req.user;
    if (user) {
        const vandor = yield (0, _1.FindVandor)(user._id);
        if (vandor !== null) {
            vandor.name = name;
            vandor.address = address;
            vandor.phone = phone;
            vandor.foodType = foodType;
            const saveResult = yield vandor.save();
            if (saveResult) {
                return res.json(saveResult);
            }
        }
        return res.json(vandor);
    }
    return res.json({ 'message': 'Vandor not found' });
});
exports.UpdateVandorProfile = UpdateVandorProfile;
//adding a update vandor cover profile function
const UpdateVandorCoverImage = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (user) {
        const vandor = yield (0, _1.FindVandor)(user._id);
        if (vandor !== null) {
            const files = req.files;
            const images = files.map((file) => file.filename);
            vandor.coverImage.push(...images);
            const saveResult = yield vandor.save();
            if (saveResult) {
                return res.json(saveResult);
            }
        }
    }
    return res.json({ 'message': 'Vandor not found' });
});
exports.UpdateVandorCoverImage = UpdateVandorCoverImage;
const UpdateVandorService = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (user) {
        const vandor = yield (0, _1.FindVandor)(user._id);
        if (vandor !== null) {
            vandor.serviceAviable = !vandor.serviceAviable;
            const saveResult = yield vandor.save();
            if (saveResult) {
                return res.json(saveResult);
            }
        }
        return res.json(vandor);
    }
    return res.json({ 'message': 'Vandor not found' });
});
exports.UpdateVandorService = UpdateVandorService;
const AddFood = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (user) {
        const { name, description, category, price, foodType, readyTime } = req.body;
        const vandor = yield (0, _1.FindVandor)(user._id);
        if (vandor !== null) {
            const files = req.files;
            const images = files.map((file) => file.filename);
            const newFood = yield models_1.Food.create({
                vandorId: vandor._id,
                name,
                description,
                category,
                price,
                images: images,
                foodType,
                readyTime
            });
            vandor.foods.push(newFood);
            const saveResult = yield vandor.save();
            if (saveResult) {
                return res.json(saveResult);
            }
        }
    }
    return res.json({ 'message': 'Something went wrong adding the food' });
});
exports.AddFood = AddFood;
const GetFoods = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (user) {
        const foods = yield models_1.Food.find({ vandorId: user._id });
        if (foods !== null) {
            return res.json(foods);
        }
    }
    return res.json({ 'message': 'Something went wrong getting the food' });
});
exports.GetFoods = GetFoods;
//# sourceMappingURL=VandorController.js.map