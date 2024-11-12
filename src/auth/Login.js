import { request, response } from "express";
import jwt from "jsonwebtoken"
import bcryptjs from "bcryptjs"
import db from "../conn.js";

const Login = async (req = request, res = response) => {
    const {email, password} = req.body
    try {
        const emailLowwet = email.toLowerCase()
        const result = await db.user.findUnique({
            where :  { 
                email : emailLowwet}
        })

        if(!result) {
            return res.status(403).json({message : "email undifind"})
        }

        const bycrptJs = await bcryptjs.compare(password, result.password)
        if(!bycrptJs) {
            return res.status(403).json("bycryptjs invalid")
        }

        const token = await jwt.sign({userId : result.id}, process.env.VITE_JWT, {expiresIn : "1d"})
        if(!token) {
            return res.status(403).json({message : "token invalid broo"})
        }

        res.status(201).json({message : "login succes", result, token},)
    } catch (error) {
        console.error(error)
        if(error.name === "TokenExpiredError") {
            return res.status(403).json({})
        }
    }
}

export default  Login