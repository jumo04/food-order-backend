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