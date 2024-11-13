import { request, response } from "express";
import db from "../conn.js";
import bcryptjs from "bcryptjs"
import fs from "fs"

const EditUser = async (req = request, res = response ) => {
    try {
        const userId = req.userId
        const {username, email, password, imageProfile} = req.body

        const user = await db.user.findUnique({
            where : {
                id : userId
            }
        })

        if(!user) {
            return res.status(500).json({
                mesage : "you cannot edit the account"
            })
        }

        let emailCase = email ? email.toLowerCase() : user.email

        if(emailCase !== user.email) {
            const findUser = await db.user.findUnique({
                where : {
                    email : emailCase
                }
            })

            if(findUser) {
                return res.status(500).json({
                    message : "email sudah ada"
                })
            }
        }

        let passwordHash = user.password

        if(password) {
            passwordHash = await bcryptjs.hash(password, 10)
        }


        let newImage = user.imageProfile
        if(imageProfile) {
            
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
    
            if(fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath)
            }
    
            fs.writeFileSync(imagePath, buffer)
            newImage = fileName
        }




        const result = await db.user.update({
            where : {
                id : userId
            },
            data : {
                username,
                email : emailCase || user.email,
                password : passwordHash,
                imageProfile : newImage
            }
        })
        
        res.status(201).json({
            message : "edit berhasil",
            result
        })
    } catch (error) {
        res.status(500).json({
            message : "Edit USer failed"
        })
        console.error(error)
    }
}

export {
    EditUser
}