"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VandorRoute = void 0;
const express_1 = __importDefault(require("express"));
const controllers_1 = require("../controllers");
const middlewares_1 = require("../middlewares");
const multer_1 = __importDefault(require("multer"));
const router = express_1.default.Router();
exports.VandorRoute = router;
const imageStorage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'images');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now().toString() + '_' + file.originalname);
    }
});
//sacamos las imagenes
const images = (0, multer_1.default)({ storage: imageStorage }).array('images', 10);
router.post('/login', controllers_1.VandorLogin);
router.use(middlewares_1.Authenticate);
router.get('/profile', controllers_1.GetVandorProfile);
router.patch('/coverimage', images, controllers_1.UpdateVandorCoverImage);
router.patch('/profile', controllers_1.UpdateVandorProfile);
router.patch('/service', controllers_1.UpdateVandorService);
//adding funtionalitys
router.post('/food', images, controllers_1.AddFood);
router.get('/foods', controllers_1.GetFoods);
router.get('/', (req, res, next) => {
    return res.json('hello from vandor');
});
//# sourceMappingURL=VandorRoute.js.map