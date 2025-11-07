import { Router } from "express";
import { catchAsynFunction } from "../../utils/catchasync.js";
import Product from "../product/product.model.js";
import AddToCart from "./addTocart.model.js";
import mongoose from "mongoose";


let router=Router()



router.post("/:id",async(req,res)=>{

      let {userEmail,quantity}= req.body

    let productId=req.params.id

    if (!mongoose.Types.ObjectId.isValid(productId)) {
  return res.status(400).send({ message: "Invalid product ID" });
}

    let session = await mongoose.startSession();

    try{

     session.startTransaction();

    let product=await Product.findById(productId).session(session)


    if(!product){
        // throw new Error("Sorry,Product not Found")
         return res.status(404).send({ message: "Sorry, Product not Found" });
    }


      
  if (product.stock < quantity) {
    // throw new Error("Insufficient product stock.")
     return res.status(400).send({ message: "Insufficient product stock." });
  }

  

        await Product.findByIdAndUpdate(
        productId,
        { $inc: { stock: -quantity } }, // decrement quantity
        { session }
        );

   let name=product?.name
   let price=product?.lowprice
    


     let result= await AddToCart.create([{
        userEmail,
        productId,
        name,price,
        quantity

        
     }],{session})


      await session.commitTransaction()
    await session.endSession()

    

    res.send(result)



    }catch(err){

    await session.abortTransaction()
    await session.endSession()
    //  throw new Error("failed Add to Cart")
    return res.status(500).send({ message: "Failed to add to cart", error: err.message });

  }







})


export let addToCartRoutes=router