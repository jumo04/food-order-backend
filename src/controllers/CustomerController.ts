import express, { Request, Response, NextFunction } from "express";
import { AddToCartInputs, CustomerInput, EditCustomerProfileInputs, OrderInputs, UserLoginInputs } from "../dto";
import { validate } from "class-validator";
import { plainToClass } from "class-transformer";
import { Customer, Delivery, Food, Offer, Order, Vandor } from "../models";
import { GenerateOtp, GeneratePassword, GenerateSalt, GenerateSignature, onRequestOtp, ValidatePassword } from "../utils";
import Transaction from "../models/Transaction";

// singup and create customer

export const CreateCustomer = async (req: Request, res: Response, next: NextFunction) => {
    const customer = plainToClass(CustomerInput, req.body);

    const inputErrors = await validate(customer, { validationError: { target: true } });
    if (inputErrors.length > 0) {
        return res.status(400).json(inputErrors);
    }

    const { email, phone, password } = customer;

    const salt = await GenerateSalt();
    const userPassword = await GeneratePassword(password, salt);

    const { otp, otp_expiry } = GenerateOtp();

    const existingUser = await Customer.findOne({ email });
    if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
    }

    
    const result  = await Customer.create({
        email,
        phone,
        password: userPassword,
        salt,
        otp,
        otp_expiry,
        verified: false,
        lat: 0,
        lng: 0,
        firstName: '',
        lastName: '',
        address: '',
        orders: []
    });

    if (result) {

        //send the otp to customer
        // await onRequestOtp(otp, phone);

        /// generate the signature

        const signature = GenerateSignature({
            _id: result.id,
            email: result.email,
            verified: result.verified
        });

        //send the result to the client
        return res.status(201).json({ signature, verified: result.verified, email: result.email, otp });
    }

}

//login

export const CustomerLogin = async (req: Request, res: Response, next: NextFunction) => {
    
    const loginInputs = plainToClass(UserLoginInputs, req.body);
    const inputErrors = await validate(loginInputs, { validationError: { target: true } });
    if (inputErrors.length > 0) {
        return res.status(400).json(inputErrors);
    }

    const { email, password } = loginInputs;
    const customer = await Customer.findOne({ email });
    if (customer) {
        const validation = await ValidatePassword(password, customer.password, customer.salt);
        if (validation) {
            const signature = GenerateSignature({
                _id: customer.id,
                email: customer.email,
                verified: customer.verified
            });
            return res.status(200).json({ signature, verified: customer.verified, email: customer.email });
        }else{
            //pass donst match
        }
    }
    return res.status(400).json({ message: 'Invalid email or password' });
}

//verify customer account

export const VerifyCustomer =  async (req: Request, res: Response, next: NextFunction) => {
    const { otp } = req.body;
    const customer = req.user;

    if (customer){
        const profile = await Customer.findById(customer._id);
        if (profile) {
            
            if (profile.otp === parseInt(otp) && profile.otp_expiry >= new Date()) {
                profile.verified = true;
                const updateCustomerResponse = await profile.save();
                const signature = GenerateSignature({
                    _id: updateCustomerResponse.id,
                    email: updateCustomerResponse.email,
                    verified: updateCustomerResponse.verified
                });

                return res.status(201).json({ signature, verified: updateCustomerResponse.verified, email: updateCustomerResponse.email });
            }
        }
    }

    return res.status(400).json({ message: 'Invalid otp' });
}

// requist otp

export const RequestOtp = async (req: Request, res: Response, next: NextFunction) => {

    const customer = req.user;

    if (customer) {
        const profile = await Customer.findById(customer._id);
        if (profile) {
            const { otp, otp_expiry } = GenerateOtp();
            profile.otp = otp;
            profile.otp_expiry = otp_expiry;
            await profile.save();
            // await onRequestOtp(otp, profile.phone);// aca es para mandar el mensaje cambiar de twilio
            return res.status(201).json({ message: 'Otp sent successfully', otp });

        }
    }
}

// profile

export const GetCustomerProfile = async (req: Request, res: Response, next: NextFunction) => {
    const customer = req.user;

    if (customer) {
        const profile = await Customer.findById(customer._id);

        if (profile) {
            return res.status(200).json(profile);
        }
    }

    return res.status(404).json({ message: 'Profile not found' });
}

export const UpdateCustomerProfile = async (req: Request, res: Response, next: NextFunction) => {
    const customer = req.user;

    const profileInputs = plainToClass(EditCustomerProfileInputs, req.body);

    const inputErrors = await validate(profileInputs, { validationError: { target: true } });

    if (inputErrors.length > 0) {
        return res.status(400).json(inputErrors);
    }

    const { firstName, lastName, address } = profileInputs;

    if (customer) {
        const profile = await Customer.findById(customer._id);
        if (profile) {
            profile.firstName = firstName;
            profile.lastName = lastName;
            profile.address = address;
            const result = await profile.save();

            return res.status(200).json( result );
        }
    }   
    
}


//cart

export const AddToCart = async (req: Request, res: Response, next: NextFunction) => {

    const customer = req.user;

    if (customer) {
        const profile = await Customer.findById(customer._id).populate('cart.food');
        let cartItems = Array();
        const { _id, unit } = <AddToCartInputs>req.body;

        const food = await Food.findById(_id);
        if (food) {

            if (profile != null) {
                //check cart profile
                cartItems = profile.cart;

                if (cartItems.length > 0) {
                    //check and update cart
                    const existFoodItems = cartItems.filter(item => item.food._id.toString() == _id);
                    if (existFoodItems.length > 0) {
                        //searching for the index of a existing food item on the cart 
                        const index = cartItems.indexOf(existFoodItems[0]);
                        
                        if(unit > 0){
                            cartItems[index] = { food, unit };
                        }
                        else{
                            //removing for the cart items
                            cartItems.splice(index, 1);
                        }
                    } else {
                        cartItems.push({ food, unit });
                    }
                }else{
                    //add a new item to cart
                    cartItems.push({ food, unit });
                }

                if(cartItems){
                    profile.cart = cartItems as any;
                    const result = await profile.save();
                    return res.status(200).json(result.cart);
                }

            }
        }
        
    }
  return res.status(404).json({ message: 'Unable to create a cart' });

}

export const GetCart = async (req: Request, res: Response, next: NextFunction) => {
    const customer = req.user;

    if (customer) {
        const profile = await Customer.findById(customer._id).populate('cart.food');
        if (profile) {
            return res.status(200).json(profile.cart);
        }
    }

    return res.status(404).json({ message: 'Cart its empty' });
}

export const DeleteCart = async (req: Request, res: Response, next: NextFunction) => {

    const customer = req.user;

    if (customer) {
        const profile = await Customer.findById(customer._id).populate('cart.food');
        if (profile != null) {
            profile.cart = [] as any;
            const result = await profile.save();
            return res.status(200).json(result);
        }
    }

    return res.status(404).json({ message: 'Cart its already empty' });

}

//entregar notificacion

const assingOrderForDelivery = async (orderId: string, vandorId: string) => {
    //find the vendor
    const vandor = await Vandor.findById(vandorId);

    if (vandor) {
        const areaCode = vandor.pincode;
        const vandorLat = vandor.lat;
        const vandorLng = vandor.lng;

        // find the available delivery person
        const delivery = await Delivery.find({ pincode: areaCode, verified: true, isAvailable: true });
        
        if (delivery) {
            //check the nearest delivery person and assign the order
            const currentOrder = await Order.findById(orderId);
            if (currentOrder) {
                // currentOrder.deliveryId = delivery;
                currentOrder.deliveryId = delivery[0].id;
                 const result = await currentOrder.save();
                 //notify to vendor for reeived new order using firebase push notification
            }
        }
    }
    
}

//order

const validateTransactionId = async (txnId: string) => {
    const currentTransaction = await Transaction.findById(txnId);
    if (currentTransaction) {
        if (currentTransaction.status.toLowerCase() !== 'failed') {
            return {status: true, currentTransaction};
        } 
    }

    return {status: false, currentTransaction};
}


export const CreateOrder = async (req: Request, res: Response, next: NextFunction) => {


    //grab current user
    const customer = req.user;

    const { txnId, amount, items } = <OrderInputs>req.body;

    if (customer) {

        //validate trasaction id
        const { status, currentTransaction } = await validateTransactionId(txnId);

        if (!status) {
            return res.status(404).json({ message: "Error with create order" });
        }
        //create order id
        const orderId = `${Math.floor(Math.random() * 89999) + 1000}`;
        const profile = await Customer.findById(customer._id);
        //grab order items from request [{id:sdfs , unit:asdf }]
        const cart = items;
        let cartItems = Array();
        let total = 0.0;
        let vandorId;
        const foods = await Food.find().where('_id').in(cart.map(x => x._id)).exec();
        
        //calculate order amount
        foods.map(food => {
            cart.map(({ _id, unit }) => {
                if (food._id == _id) {
                    vandorId = food.vandorId;
                    total += (food.price * unit);
                    cartItems.push({ food, unit });
                }
        });

        })
        //create order with item description
        if(cartItems){
            // create order
            const currentOrder = await Order.create({
                orderId: orderId,
                vandorId: vandorId,
                items: cartItems,
                totalAmount: total,
                paidAmount: amount,
                orderDate: new Date(),
                orderStatus: 'Waiting',
                remarks: '',
                deliveryId: '',
                readyTime: 45,
                txnId: txnId

            });

            //finally update orders user account
            if (currentOrder) {
                profile.cart = [] as any;
                profile.orders.push(currentOrder);
                currentTransaction.verndorId = vandorId;
                currentTransaction.orderId = orderId;
                currentTransaction.status = "CONFIRMED";
                await currentTransaction.save();
                assingOrderForDelivery(currentOrder.id, vandorId);
                const result = await profile.save();
                return res.status(201).json(result);
            }
        }
        }

     return res.status(400).json({ message: 'Something went wrong' });

}

export const GetOrders = async (req: Request, res: Response, next: NextFunction) => {
    
    const customer = req.user;

    if (customer) {
        const profile = await Customer.findById(customer._id).populate('orders');
        if (profile) {
            const orders = profile.orders;
            return res.status(200).json(orders);
        }
    }

    return res.status(404).json({ message: 'Orders not found' });
}

export const GetOrder = async (req: Request, res: Response, next: NextFunction) => {

    const { id } = req.params;

    const user = req.user;

    if (user) {
        const order = await Order.findById(id).populate('items.food');
        if (order) {
            return res.status(200).json(order);
        }
    }

    return res.status(404).json({ message: 'Order not found' });
}

export const VerifyOffer = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const customer = req.user;
    if(customer){
        const appliedOffer = await Offer.findById(id);
        if(appliedOffer){
            if(appliedOffer.promoType === 'USER'){
                //only can apply one by user
            }else{
                if(appliedOffer.isActive){
                    return res.status(200).json({message: 'offer is valid', offer: appliedOffer});
                }
            }
        }
    }
}


// payment

export const CreatePayment = async (req: Request, res: Response, next: NextFunction) => {
    const customer = req.user;
    const { amount, offerId, paymentMode } = req.body;

    let payableAmount = Number(amount);
    if(offerId){
        const appliedOffer = await Offer.findById(offerId);
        if(appliedOffer){
            if(appliedOffer.isActive){
                payableAmount = (payableAmount - appliedOffer.offerAmount);
            }
        }
    }
    //perform payment gateway charge API CALL

    //right after payment gateway success / failure response

    //create record of transaction
    const transaction = await Transaction.create({
        customer: customer._id,
        verndorId: '',
        orderId: '',
        orderValue: payableAmount,
        paymentMode: paymentMode,
        offerUsed: offerId || 'NA',
        status: 'OPEN',
        paymentResponse: 'Payment is cash on delivery'
    });


    //return transaction I
    return res.status(200).json(transaction);

}