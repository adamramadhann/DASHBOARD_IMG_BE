import { Router } from "express";
import { addProduck, apload } from "../products/addProduck";
import ValidasiMeddleer from "../middlewer/ValidasiMeddleer";
import GetAllProduck from "../products/GetAllProduck";
import DeleteProduct from "../products/DeleteProduck";
import { UpdateProduck, upload } from "../products/UpdateProduck";

export const RouteProduck = Router()
RouteProduck.post(`/api/products/add`, apload.single("img_products"),ValidasiMeddleer, addProduck)
RouteProduck.get(`/api/products/get`,ValidasiMeddleer, GetAllProduck)
RouteProduck.delete(`/api/products/delete`,ValidasiMeddleer, DeleteProduct)
RouteProduck.put(`/api/products/update/:id`, upload.single("img_products"), UpdateProduck)