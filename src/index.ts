import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { authRouter } from "./routes/auth";
import { userRouter } from "./routes/user";
import {generateRoute} from "./routes/generate"
dotenv.config();
const app=express();
app.use(express.json());
app.use(cors({
  origin: "https://reactplayground.100xdev.online",
  credentials: true, // important for cookies/JWT headers
}));

app.use("/api/auth",authRouter);
app.use("/api/user",userRouter);
app.use("/api/ai", generateRoute);

app.listen(4000,()=>{
    console.log("server listening on port 4000");
})