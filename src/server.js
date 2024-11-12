import express from "express"
import cors from "cors"
import env from "dotenv"
import path from "path"
import { RouteProduck } from "./route/RouteProduck"
import RouteAUth from "./route/RouthAuth"

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
app.use("/images/product", express.static(path.join(__dirname, "../../uploads/products")))
app.use(RouteAUth)
app.use(RouteProduck)


app.listen(PORT, ()=> {console.info(`
    ==================
    SERVER RUN ${PORT}
    ==================
    `)})