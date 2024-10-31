import { Router } from "express";
import { Register } from "./Register.js";

const RouteAUth =  Router()

RouteAUth.post("/api/user/register", Register)

export default  RouteAUth

