"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerRoute = void 0;
const express_1 = __importDefault(require("express"));
const CustomerController_1 = require("../controllers/CustomerController");
const middlewares_1 = require("../middlewares");
const router = express_1.default.Router();
exports.CustomerRoute = router;
//singup
router.post('/signup', CustomerController_1.CreateCustomer);
//login
router.post('/login', CustomerController_1.CustomerLogin);
//need authenthication
router.use(middlewares_1.Authenticate);
//profile
router.get('/profile', CustomerController_1.GetCustomerProfile);
router.patch('/profile', CustomerController_1.UpdateCustomerProfile);
//verify customer account
router.post('/verify', CustomerController_1.VerifyCustomer);
//otp
router.get('/otp', CustomerController_1.RequestOtp);
//# sourceMappingURL=CustomerRoute.js.map