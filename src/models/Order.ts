import mongoose, { Document, Schema, Model } from "mongoose";

export interface OrderDoc extends Document {
    orderId: string, //3155454
    vandorId: string,
    items: [any], //[{food: 1, unit: 2}]
    totalAmount: number, // 600
    paidAmount: number,
    orderDate: Date, // 2022-02-02
    orderStatus: string, // to determine the current status // waiting //preparing //onway //delivered // cancelled // failed
    remarks: string, // any vando if catch the order
    deliveryId: string, //one order is placed se da a delivery id
    readyTime: number; //max 60 min
    txnId: string;
}

const OrderSchema = new Schema(
    {
        orderId: {
            type: String,
            required: true
        },
        vandorId: {
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
        paidAmount: {
            type: Number,
            required: true
        },
        orderDate: {
            type: Date
        },
        orderStatus: {
            type: String

        },
        remarks: {
            type: String
        },
        deliveryId: {
            type: String
        },
        readyTime: {
            type: Number
        },
        txnId: {
            type: String,
            required: true
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
