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
exports.GetVendorById = exports.GetVendors = exports.CreateVendor = exports.FindVandor = void 0;
const models_1 = require("../models");
const utils_1 = require("../utils");
const FindVandor = (id, email) => __awaiter(void 0, void 0, void 0, function* () {
    if (email) {
        return yield models_1.Vandor.findOne({ email: email });
    }
    else if (id) {
        return yield models_1.Vandor.findById(id);
    }
});
exports.FindVandor = FindVandor;
const CreateVendor = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, ownerName, foodType, pincode, address, phone, email, password } = req.body;
    const exitsVandor = yield (0, exports.FindVandor)(undefined, email);
    if (exitsVandor !== null) {
        return res.json({ 'message': 'Vandor already exists' });
    }
    //generando a salt
    const salt = yield (0, utils_1.GenerateSalt)();
    //encriptando el password usando el salt
    const userPassword = yield (0, utils_1.GeneratePassword)(password, salt);
    const createVandor = yield models_1.Vandor.create({
        name: name,
        ownerName: ownerName,
        foodType: foodType,
        pincode: pincode,
        address: address,
        phone: phone,
        email: email,
        password: userPassword,
        salt: salt,
        serviceAviable: false,
        coverImage: [],
        rating: 0,
        foods: []
    });
    return res.json(createVandor);
});
exports.CreateVendor = CreateVendor;
const GetVendors = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const vandors = yield models_1.Vandor.find();
    if (vandors === null) {
        return res.json({ 'message': 'Vandor not found' });
    }
    return res.json(vandors);
});
exports.GetVendors = GetVendors;
const GetVendorById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const vandor = yield (0, exports.FindVandor)(req.params.id);
    if (vandor === null) {
        return res.json({ 'message': 'Vandor not found' });
    }
    return res.json(vandor);
});
exports.GetVendorById = GetVendorById;
//# sourceMappingURL=AdminController.js.map