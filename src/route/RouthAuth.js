import { Router } from "express";
import Login from "../auth/Login.js";
import GetAllAuth from "../auth/GetAllAuth.js";
import ValidasiMeddleer from "../middlewer/ValidasiMeddleer.js";
import { Register } from "../auth/Register.js";
import { EditUser } from "../auth/EdithUSer.js";

const RouteAUth =  Router()

RouteAUth.post("/api/user/register", Register)
RouteAUth.post("/api/user/login",  Login)
RouteAUth.get("/api/user/getAll",ValidasiMeddleer, GetAllAuth)
RouteAUth.put("/api/user/edit",ValidasiMeddleer, EditUser)

export default  RouteAUth

