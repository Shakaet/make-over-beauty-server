import { Router } from "express";
import { catchAsynFunction } from "../../utils/catchasync.js";
import { Order } from "./order.model.js";
import { Coupon } from "../coupon/coupon.model.js";
import User from "../user/user.model.js";
import Product from "../product/product.model.js";


let router = Router()






router.post("/",catchAsynFunction( async (req, res) =>{


    let orderData=req.body;
    let { email, subtotal, couponCode, discountPercent, totalAmount, items}=orderData;



    let findCoupon=await Coupon.findOne({code:couponCode});

    if(!findCoupon){
        throw new Error("Invalid Coupon Code");
    }

    if(Math.round(findCoupon.discountPercentage) !== Math.round(discountPercent)){
        throw new Error(`Coupon Code ${couponCode} is for ${findCoupon.discountPercentage}% discount only` );
    }

    if(!findCoupon.discountPercentage){
        throw new Error("Invalid Discount Percentage");
    }

    if(findCoupon.isActive===false){
        throw new Error("Coupon is not active");
    }


    let findUser=await User.findOne({email:email});

    if(!findUser){
        throw new Error("User not found");
    }


       // 🧮 Calculate subtotal from items array
        const calculatedSubtotal = items.reduce((acc, item) => {
        return acc + item.price * item.quantity;
        }, 0);

        // ❌ If subtotal mismatch → Throw error
        if (Math.round(calculatedSubtotal) !== Math.round(subtotal)) {
          throw new Error(
            `Subtotal mismatch. Expected ${subtotal}, but received ${calculatedSubtotal}.`
        );
        }



        

        // 🧮 Calculate discount & total validation
        const discountAmount = subtotal * (discountPercent / 100);
        const expectedTotal = subtotal - discountAmount;

        // Handle floating number issues
        if (Math.round(expectedTotal) !== Math.round(totalAmount)) {
        throw new Error(
            `Total amount mismatch. Expected ${expectedTotal}, but received ${totalAmount}.`
        );
        }




     for (const item of items) {
      const productExists = await Product.findById(item.productId);
      if (!productExists) {
        throw new Error(
        `Invalid productId: ${item.productId}. The specified product does not exist in the Product collection.`
    );

      }
    }


    let orders={}
     if (!orderData.invoiceId) {
    const random = Math.floor(10000 + Math.random() * 90000); // 5 digit random
    orders.invoiceId = `INV-${random}`;
  }

    orders.email=email;
    orders.subtotal=subtotal;
    orders.couponCode=couponCode;
    orders.discountPercent=discountPercent;
    orders.totalAmount=totalAmount;
    orders.items=items;


    let result= await Order.create(orders);

    res.status(201).json({ insertedId: result._id,data:result });


}))










export let orderRoutes= router;