export interface CreateVandorInput {
    name: string;
    ownerName: string;
    foodType: string;
    pincode: number;
    address: string;
    phone: string;
    email: string;
    password: string;
}

export interface UpdateVandorInput {
    name: string;
    foodType: [string];
    address: string;
    phone: string;
}

export interface VandorLoginInputs {
    email: string;
    password: string;
}

export interface VandorPayLoad{
    _id: string;
    email: string;
    name: string;
    foodTypes: [string];
}