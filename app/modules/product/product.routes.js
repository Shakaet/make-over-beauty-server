import { Router } from "express";
import Product from "./product.model.js";
import { catchAsynFunction } from "../../utils/catchasync.js";


const router = Router()

// Get all products
router.get("/all-products", catchAsynFunction(async (req, res) => {
  
   

    // use the underlying MongoDB collection directly
    const result = await Product.find();

    res.status(201).json({ 
        data:result
     });
  } 
))


// Get single products
router.get("/product/:id", catchAsynFunction(async (req, res) => {
  
   
    let id=req.params.id
    // use the underlying MongoDB collection directly
    const result = await Product.findById(id);

    res.status(201).json({ 
        data:result
     });
  } 
))


export let productRoutes=router