import { IsEmail, Length  } from "class-validator";

export class CustomerInput {
    @IsEmail()
    email: string;

    @Length(7, 12)
    phone: string;

    @Length(6, 12)
    password : string;
}

export interface CustomerPayLoad {
    _id: string;
    email: string;
    verified: boolean;
}

export class UserLoginInputs {
    @IsEmail()
    email: string;

    @Length(6, 12)
    password: string;
}

export class EditCustomerProfileInputs {
    @Length(6, 12)
    firstName: string;

    @Length(6, 12)
    lastName: string;

    @Length(6, 12)
    address: string;
}


export class CartItem {
    _id: string;
    unit: number;
}

export class OrderInputs {

    txnId: string;

    amount: number;
    items: [CartItem];



}

export class AddToCartInputs {
    _id: string;
    unit: number;
}


export class DeliveryUserInput {
    @IsEmail()
    email: string;

    @Length(7, 12)
    phone: string;


    @Length(6, 12)
    password : string;

    @Length(3, 12)
    firstName : string;

    @Length(3, 12)
    lastName : string;

    @Length(6, 24)
    address : string;

    @Length(4, 12)
    pincode : string;
}
