import express from "express";
import mongoose from "mongoose";
import { MONGO_URL } from "../config";

export default async () => {
    try {
        await mongoose.connect(MONGO_URL, {}); 
        console.log("MongoDB connecteds");
    } catch (error) {
        console.log("ERROR", error);
    }    
}
