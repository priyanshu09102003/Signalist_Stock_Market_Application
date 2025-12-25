import { betterAuth } from "better-auth";
import {mongodbAdapter} from "better-auth/adapters/mongodb"
import { connectToDatabase } from "@/database/mongoose";
import {nextCookies} from "better-auth/next-js"

let authInstance: ReturnType<typeof betterAuth>|null = null;

export const getAuth = async () => {
    if(authInstance) return authInstance;

    const mongoose = await connectToDatabase();
    const db = mongoose.connection.db

    if(!db){
        throw new Error("MongoDB connection not found")
    }

    authInstance = betterAuth({





    })
        
    return authInstance;
    
}


export const auth = await getAuth();