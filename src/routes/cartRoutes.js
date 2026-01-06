import { Router } from "express";
import { protect } from "../middleware/authMiddleWare.js";
import { addToCart, getCart, removeFromCart } from "../controllers/cartController.js";

const cartRoutes=Router()

cartRoutes.post("/add",protect,addToCart)
cartRoutes.get("/get",protect,getCart)
cartRoutes.delete("/remove",protect,removeFromCart)

export default cartRoutes