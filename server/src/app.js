import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";


const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())


// import routes
import authRoute from "./routes/auth.route.js";
import userRoute from "./routes/user.route.js";


// routes declearation

app.use("/api/v1/users", authRoute);


// http://localhost:3000/api/v1/users/register


export { app };