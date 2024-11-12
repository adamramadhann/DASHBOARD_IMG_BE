import { request, response } from "express"
import path from "path"
import multer from "multer"
import db from "../conn.js"


const uploadDir = path.resolve(__dirname, "../../uploads/products")
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir)
    },
    filename: (req, file,cb) => {
        const randomData = Date.now() + "-" + Math.round(Math.random() * 1E9) 
        cb(null, randomData + path.extname(file.originalname))
    }
})

const filefileter = (req, file, cb) => {
    const allowedType = ['image/jpg','image/png','image/jpeg',]

    if(allowedType.includes(file.mimetype)) {
        cb(null, true)
    } else {
        cb(new Error("only type img"))
    }
}

const apload = multer({
    storage : storage,
    fileFilter : filefileter,
    limits : {
        fileSize : 5 * 1024
    }
})

const addProduck = async (req = request, res = response) => {

    const { name, price, description } = req.body

     try {
        const products = await db.products.create({
            data : {
                name,
                price,
                description,
                img_products : req.file.filename
            }
        })

        res.status(201).json({message : "create data succes ", products})
    } catch (error) {
        console.error(error)
        res.status(403).json("error Brooo", error)
    }
}

export {
    addProduck,
    apload
} 