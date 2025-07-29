import express, {Request,Response,NextFunction} from "express";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
dotenv.config();
import Jwt  from "jsonwebtoken";
import {
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    GOOGLE_REDIRECT_URI,
    GOOGLE_TOKEN_URL,
    GOOGLE_USERINFO_URL
} from "../utils/googleutils";
import { GoogleTokenResponse } from "../utils/googleutils";
import axios from "axios";


const JWT_SECRET=process.env.JWT_SECRET!
const authRouter=express.Router();

type user={
    id: string;
    email: string;
    name?: string;
    picture?: string;

}

authRouter.post("/google",async(req:Request,res:Response)=>{
    console.log("Request reached here from forntend");
    const {code}=req.body;
    console.log(`The code recived from frontend is :${code}`);
    if(!code){
        res.json({
            message: "auth-code is not provided by frontend",
        })
        return;
    }
    try{
            const tokenResponse = await axios.post<GoogleTokenResponse>(GOOGLE_TOKEN_URL, {
            code,
            client_id: GOOGLE_CLIENT_ID,
            client_secret: GOOGLE_CLIENT_SECRET,
            redirect_uri: 'postmessage',
            grant_type: "authorization_code",
        }, {
            headers: { "Content-Type": "application/json" }
        });

        console.log(`The token response data is :${tokenResponse.data}`);
        const { access_token } = tokenResponse.data;

        const userResponse = await axios.get<user>(GOOGLE_USERINFO_URL, {
            headers: { Authorization: `Bearer ${access_token}` }
        });
        console.log(`Then userreponse data is :${userResponse.data}`);
        const user = userResponse.data;
        let existingUser = await prisma.user.findUnique({
               where: { email: user.email },
            });


        if (!existingUser) {
            existingUser = await prisma.user.create({
                data: {
                    email: user.email,
                    name: user.name || "",
                },
            });
        }


        const token = Jwt.sign(
            {
                id: existingUser.id,
                email: existingUser.email,
                name: existingUser.name,
            },
            JWT_SECRET
        );



        return res.json({
            message: "Google sign-in successful",
            user,
            token,
        });




    }catch(error:any){
        
        console.error("Google Auth Error:", error.response?.data || error.message);
        return res.status(500).json({ error: "Authentication failed" });
        
    }

})
authRouter.get("/google2",(req:Request,res:Response)=>{
    res.json({
        message: "testing Router",
    })
})
export {authRouter};