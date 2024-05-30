import mongoose, { Document, Schema, Model } from "mongoose";
import { OrderDoc } from "./Order";

interface DeliveryDoc extends Document {
    email: string;
    password: string;
    salt: string;
    pincode: string;
    firstName: string;
    lastName: string;
    phone: string;
    address: string;
    verified: boolean;
    lat: number;
    lng: number;
    isAvailable: boolean;
}

const DeliverySchema = new Schema(
    {
        email: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
        salt: {
            type: String,
            required: true,
        },
        verified: {
            type: Boolean,
            required: true
        },
        phone: {
            type: String,
            required: true,
        },
        firstName: {
            type: String
        },
        lastName: {
            type: String
        },
        address: {
            type: String
        },
        pincode: {
            type: String
        },
        lat: {
            type: Number
        },
        lng: {
            type: Number
        },
        isAvailable: {
            type: Boolean,
            default: false,
            required: true
        }
    },  
    {
        toJSON: {
            transform(doc, ret) {
                delete ret.password;
                delete ret.salt;
                delete ret.__v;
                delete ret.createdAt;
                delete ret.updatedAt;
            }
        },
        timestamps: true
    }
);

const Delivery  = mongoose.model<DeliveryDoc>("delivery",DeliverySchema);
export { Delivery }
