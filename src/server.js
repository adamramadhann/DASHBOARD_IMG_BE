import express from "express"
import cors from "cors"
import env from "dotenv"
import RouteAUth from "./auth/RouthAuth"
import path from "path"

const app = express()
env.config()
const PORT = process.env.PORT

app.use(cors())
app.use(express.json({
    limit: "100mb"
}))

app.use(express.urlencoded({
    extended : true
}))

app.get("/api/test", (req, res)=> {
    res.json({
        message : "test berhasil"
    })
})

app.use("/profile", express.static(path.join(__dirname,"../uploads/profile")))
app.use(RouteAUth)


app.listen(PORT, ()=> {console.info(`
    ==================
    SERVER RUN ${PORT}
    ==================
    `)})