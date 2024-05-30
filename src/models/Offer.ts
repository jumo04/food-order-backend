import mongoose, { Document, Schema, Model } from "mongoose";

export interface OfferDoc extends Document {
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


const OfferSchema = new Schema(
    {
        offerType: {
            type: String,
            required: true
        },
        vandors:[ {
            type: Schema.Types.ObjectId, ref: 'vandor'
        }
        ],
        title: {
            type: String,
            required: true
        },
        description: {
            type: String
        },
        minValue: {
            type: Number,
            required: true
        },
        offerAmount: {
            type: Number,
            required: true
        },
        startValidaty: {
            type: Date
        },
        endValidity: {
            type: Date
        },
        promoCode: {
            type: String,
            required: true
        },
        promoType: {
            type: String,
            required: true
        },
        bank: [
            {type: String}
        ],
        bins: [
            {type: Number}
        ],
        pincode: {
            type: String,
            required: true
        },
        isActive: {
            type: Boolean
        },
    },
    {
        toJSON: { 
            transform(doc, ret) {
                delete ret.__v;
                delete ret.createdAt;
                delete ret.updatedAt;
            }
         },
        timestamps: true,
    }
); 


const Offer = mongoose.model<OfferDoc>("offer", OfferSchema);
export { Offer }