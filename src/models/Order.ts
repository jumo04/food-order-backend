import mongoose, { Document, Schema, Model } from "mongoose";

export interface OrderDoc extends Document {
    orderId: string,
    items: [any],
    totalAmount: number,
    orderDate: Date,
    paidThrough: string,
    paymentReponse: string,
    orderStatus: string
}

const OrderSchema = new Schema(
    {
        orderId: {
            type: String,
            required: true
        },
        items: [
            {
                food: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "food",
                    required: true
                },
                unit: {
                    type: Number,
                    required: true
                }
            }
        ],
        totalAmount: {
            type: Number,
            required: true
        },
        orderDate: {
            type: Date
        },
        paidThrough: {
            type: String
        },
        paymentReponse: {
            type: String
        },
        orderStatus: {
            type: String

        }
        
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


const Order = mongoose.model<OrderDoc>("order", OrderSchema);
export { Order };
