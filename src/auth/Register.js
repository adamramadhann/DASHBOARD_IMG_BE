// Import library yang diperlukan
import { request, response } from "express"; // Mengimpor request dan response dari express
import bcryptjs from "bcryptjs"; // Mengimpor bcryptjs untuk hashing password
import db from "../conn.js"; // Mengimpor koneksi database
import path from "path"; // Mengimpor path untuk manipulasi path file
import fs from "fs"; // Mengimpor fs untuk operasi file sistem

// Mendefinisikan fungsi Register untuk menangani proses pendaftaran
const Register = async (req = request, res = response) => {
    // Mengambil data dari request body
    const { name, email, password, imageProfile } = req.body;
    console.info({ name, email, password, imageProfile }); // Menampilkan data di console untuk debugging

    try {
        // Mengubah email menjadi huruf kecil untuk keperluan pencarian
        const emailLower = email.toLowerCase();
        
        // Menghash password sebelum disimpan
        const hashPassword = await bcryptjs.hash(password, 10);

        // Mencari user dengan email yang sama di database
        const findUser = await db.user.findUnique({
            where: {
                email: emailLower, // Mencari berdasarkan email
            },
        });

        // Jika user sudah ada, kembalikan respons dengan status 403
        if (findUser) {
            return res.status(403).json({ message: "email sudah ada" });
        }

        // Mengecek format imageProfile
        const mimeType = imageProfile.match(/data:(image\/\w+);base64,/);
        
        // Jika format tidak valid, kembalikan respons dengan status 404
        if (!mimeType) {
            return res.status(404).json({ message: "invalid type image" });
        }

        // Mendapatkan tipe mime dan ekstensi file
        const mime = mimeType[1];
        const extensi = mime.split('/')[1];

        // Menghapus prefix base64 untuk mendapatkan data yang bisa diubah menjadi buffer
        const base64data = imageProfile.replace(/^data:image\/\w+;base64,/, '');
        const buffer = Buffer.from(base64data, 'base64'); // Mengubah data base64 menjadi buffer
        const imageDir = path.join(__dirname, "../../uploads/profile"); // Menentukan direktori untuk menyimpan gambar
        
        // Cek dan buat direktori jika belum ada
        if (!fs.existsSync(imageDir)) {
            fs.mkdirSync(imageDir, { recursive: true }); // Membuat direktori secara rekursif
        }

        console.info(imageDir); // Menampilkan path direktori di console

        // Menentukan path lengkap untuk menyimpan gambar
        const imagePath = path.join(imageDir, `${email}-profile.${extensi}`);
        fs.writeFileSync(imagePath, buffer); // Menyimpan gambar ke file

        // ambil bagian yang kita perlukan
        const fileName = `${email}-profile.${extensi}`

        // Menyimpan data user ke database
        const result = await db.user.create({
            data: {
                username: name, // Menggunakan nama sebagai username
                email: emailLower, // Menyimpan email yang sudah diubah menjadi huruf kecil
                password: hashPassword, // Menyimpan password yang sudah dihash
                imageProfile: fileName, // Menyimpan path gambar profil
            },
        });

        // Mengembalikan respons dengan status 200 dan pesan sukses
        res.status(200).json({ message: "register success", result });
    } catch (error) {
        console.info(error); // Menampilkan error di console
        res.status(500).json({ message: "Internal server error" }); // Mengembalikan respons error
    }
}

// Mengekspor fungsi Register untuk digunakan di bagian lain dari aplikasi
export {
    Register
}
