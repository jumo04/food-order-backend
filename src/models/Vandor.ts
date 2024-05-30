import mongoose, { Document, Schema, Model } from "mongoose";

interface VandorDoc extends Document {
  name: string;
  ownerName: string;
  foodType: [string];
  pincode: number;
  address: string;
  phone: string;
  email: string;
  password: string;
  salt: string;
  serviceAviable: boolean;
  coverImage: [string];
  rating: number;
  foods: any;
  lat: number;
  lng: number;
}

const VandorSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    ownerName: {
      type: String,
      required: true,
    },
    foodType: {
      type: [String],
    },
    pincode: {
      type: Number,
      required: true,
    },
    address: {
      type: String,
    },
    phone: {
      type: String,
      required: true,
    },
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
    serviceAviable: {
      type: Boolean,
      default: false,
    },
    coverImage: {
      type: [String],
    },
    rating: {
      type: Number,
    },
    foods: {
      type: [Schema.Types.ObjectId],
      ref: "food",
    },
    lat: {
      type: Number,
    },
    lng: {
      type: Number,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        delete ret.password;
        delete ret.salt;
        delete ret.__v;
        delete ret.createdAt;
        delete ret.updatedAt;
      },
    },
    timestamps: true,
  }
);

const Vandor = mongoose.model<VandorDoc>("vandor", VandorSchema);
export { Vandor };