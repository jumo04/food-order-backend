"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShoppingRoute = void 0;
const express_1 = __importDefault(require("express"));
const controllers_1 = require("../controllers");
const router = express_1.default.Router();
exports.ShoppingRoute = router;
//food avaiability
router.get('/:pincode', controllers_1.GetFoodAvailability);
//top restaurants
router.get('/top-restaurants/:pincode', controllers_1.GetTopRestaurants);
//food avaible in 30 minutes
router.get('/in-30-minutes/:pincode', controllers_1.GetIn30Minutes);
//search food
router.get('/search/:pincode', controllers_1.SearchFood);
// find restaurant by id
router.get('/restaurant/:id', controllers_1.GetRestaurantById);
//# sourceMappingURL=ShoppingRoute.js.map