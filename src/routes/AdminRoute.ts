import express, { Request, Response, NextFunction } from "express";
import { CreateVendor, GetVendors, GetVendorById, GetTransactionById, GetTransactions, VerifyDeliveryUser, GetDeliveryUser } from "../controllers";

const router = express.Router();

router.post('/vandor', CreateVendor);
router.get('/vandors', GetVendors);
router.get('/vandor/:id', GetVendorById);

router.get('/transaction/:id', GetTransactionById)
router.get('/transactions', GetTransactions);

router.put('/delivery/verify', VerifyDeliveryUser);
router.get('/delivery/users', GetDeliveryUser);



router.get('/', (req: Request, res: Response, next: NextFunction) => {
    return res.json('hello from admin');
});


export { router as AdminRoute }