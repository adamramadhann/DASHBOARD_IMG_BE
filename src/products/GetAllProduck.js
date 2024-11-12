import { request, response } from "express";
import db from "../conn.js";

const GetAllProduck = async (req = request, res = response ) => {
    try {
        const getAll = await db.products.findMany()
        res.status(201).json({
            message : "data all ready ",
            getAll
        })
    } catch (error) {
        console.error(error)
    }
}

export default GetAllProduck