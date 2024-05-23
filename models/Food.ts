import mongoose, { Document, Schema, Model } from "mongoose";

interface FoodDoc extends Document {
    vandorId: string;
    name: string;
    description: string;
    category: string;
    price: number;
    images: [string];
    foodType: string;
    readyTime: number;
}

const FoodSchema = new Schema(
    {
        vandorId: {
            type: String
        },
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        category: {
            type: String,
        },
        price: {
            type: Number,
            required: true,
        },
        images: {
            type: [String],
        },
        foodType: {
            type: String,
        },
        readyTime: {
            type: Number,
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


const Food = mongoose.model<FoodDoc>("food", FoodSchema);
export { Food };
