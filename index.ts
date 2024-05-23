import express from "express";
import cors from "cors";
import { AdminRoute, VandorRoute } from "./routes";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import { MONGO_URL } from "./config";
import path from "path";

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/images', express.static(path.join(__dirname, '/images')));

app.use('/admin', AdminRoute);
app.use('/vandor', VandorRoute);

mongoose.connect(MONGO_URL).then(() => {
    console.log("MongoDB connected");
}).catch((err) => {
    console.log("ERROR", err);
})



app.listen(8000, () => {
    console.clear();
    console.log("server running on port 8000");
});