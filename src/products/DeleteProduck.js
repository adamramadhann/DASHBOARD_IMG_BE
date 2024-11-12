import { request, response } from "express";
import db from "../conn.js";
import path from "path";
import fs from "fs";

const DeleteProduct = async (req = request, res = response) => {
    try {
        const { ids } = req.body;

        // Ambil produk berdasarkan id
        const products = await db.products.findMany({
            where: {
                id: {
                    in: ids,
                },
            },
        });

        // Periksa apakah produk ditemukan
        if (products.length === 0) {
            return res.status(400).json({
                message: "Tidak ada produk yang dipilih",
            });
        }

        // Hapus gambar yang terkait dengan produk
        products.forEach(element => {
            const imagePath = path.resolve(__dirname, "../../uploads/products", element.img_products);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        });

        // Hapus produk dari database
        const result = await db.products.deleteMany({
            where: {
                id: {
                    in: ids,
                },
            },
        });

        // Respons berhasil
        res.status(200).json({
            message: "Delete success",
            result,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Can't delete, there was an error",
            error,
        });
    }
};

export default DeleteProduct;
