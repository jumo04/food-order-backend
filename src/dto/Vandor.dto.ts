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

export interface ProcessOrderInput {
    status: string;
    remarks: string;
    time: number;
}

export interface CreateOfferInputs {
    offerType: string;// VENDOR //GENERIC
    vandors: [any];//['5f9e7c8d7f9e7c8d7f9e7c8d']
    title: string; //inr 200 OFF ON WEEK DAYS
    description: string;//any descriptions with terms and conditions
    minValue: number; /// minimum amount shloud be 300
    offerAmount: number; //200
    startValidaty: Date;
    endValidity: Date;
    promoCode: string;//WEEK200
    promoType: string;//USER //ALL//BANK//CARD
    bank: [any];
    bins: [any];
    pincode: string;
    isActive: boolean;
}