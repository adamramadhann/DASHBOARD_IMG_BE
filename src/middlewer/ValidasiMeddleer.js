import { request, response } from "express";
import jwt from "jsonwebtoken";

const ValidasiMeddleer = async (req = request, res = response, next) => {
    try {
        const autHeader = req.headers.authorization;
        if (!autHeader) {
            return res.status(403).json({ message: "headers invalid" });
        }

        const token = autHeader.split(" ")[1];

        // Dekode token menggunakan jwt.verify dan simpan hasilnya ke dalam variabel 'decoded'
        jwt.verify(token, process.env.VITE_JWT, (error, decoded) => {
            if (error) {
                if (error.name === "TokenExpiredError") {
                    return res.status(403).json({ message: "Token has expired" });
                }
                return res.status(403).json({ message: "Token denied" });
            }

            // Menyimpan userId dari decoded token ke dalam req
            req.userId = decoded.userId; // Menggunakan 'decoded' untuk mendapatkan userId
            next(); // Panggil next hanya jika token valid
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" }); // Respons pada error
    }
};

export default ValidasiMeddleer;
