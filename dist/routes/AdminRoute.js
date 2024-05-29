"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminRoute = void 0;
const express_1 = __importDefault(require("express"));
const controllers_1 = require("../controllers");
const router = express_1.default.Router();
exports.AdminRoute = router;
router.post('/vandor', controllers_1.CreateVendor);
router.get('/vandors', controllers_1.GetVendors);
router.get('/vandor/:id', controllers_1.GetVendorById);
router.get('/', (req, res, next) => {
    return res.json('hello from admin');
});
//# sourceMappingURL=AdminRoute.js.map