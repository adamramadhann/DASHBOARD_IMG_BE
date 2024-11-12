import { request, response } from "express";
import multer from "multer";
import db from "../conn";
import path from "path";
import fs from "fs";

const uploadDir = path.resolve(__dirname, "../../uploads/products");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const randomData = Date.now() + "-" + Math.round(Math.random() * 1E9);
        cb(null, randomData + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage
});

const UpdateProduck = async (req = request, res = response) => {
    const { id } = req.params;
    const { name, price, description } = req.body;
    const parsId = parseInt(id);

    try {
        const produck = await db.products.findUnique({
            where: {
                id: parsId
            }
        });

        if (!produck) {
            return res.status(404).json({
                message: "ID tidak ditemukan"
            });
        }

        let imgProduckPath = produck.img_products;

        // Jika ada file baru, hapus gambar lama dan ganti dengan gambar baru
        if (req.file) {
            const oldImage = path.resolve(uploadDir,"../../uploads/products" , produck.img_products);

            if (fs.existsSync(oldImage)) {
                fs.unlinkSync(oldImage); // Hapus gambar lama
            }
            imgProduckPath = req.file.filename; 
        }

        // Update data produk
        const updateResult = await db.products.update({
            where: {
                id: parsId,
            },
            data: {
                name : name || produck.name,
                price : price || produck.price,
                description : description || produck.description,
                img_products: imgProduckPath
            }
        });

        res.status(200).json({
            message: "Update berhasil",
            updateResult
        });

    } catch (error) {
        res.status(500).json({
            message: "Terjadi kesalahan saat update produk",
            error: error.message
        });
    }
};

export {
    UpdateProduck,
    upload
};
