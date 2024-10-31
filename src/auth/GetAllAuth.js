import { request, response } from "express";
import db from "../conn.js";

const GetAllAuth = async (req = request, res = response) => {
    try {
        const result = await db.user.findMany()
        console.info(result)
        res.status(201).json({message : "data al ready"})
    } catch (error) {
        console.error(error)
    }
}

export default GetAllAuth