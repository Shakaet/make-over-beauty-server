import { Router } from "express";
import { catchAsynFunction } from "../../utils/catchasync.js";
import Product from "../product/product.model.js";
import AddToCart from "./addTocart.model.js";
import mongoose from "mongoose";


let router=Router()



router.post("/:id", async (req, res) => {
  let { userEmail, quantity } = req.body;
  let productId = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    return res.status(400).send({ message: "Invalid product ID" });
  }

  let session = await mongoose.startSession();

  try {
    session.startTransaction();

    // 1️⃣ Find product
    let product = await Product.findById(productId).session(session);
    if (!product) {
      return res.status(404).send({ message: "Sorry, Product not Found" });
    }

    // 2️⃣ Check stock
    if (product.stock < quantity) {
      return res.status(400).send({ message: "Insufficient product stock." });
    }

    // 3️⃣ Check if this user already added this product in cart
    let existingCartItem = await AddToCart.findOne({ userEmail, productId }).session(session);

    if (existingCartItem) {
      // 🟢 Update quantity (increase)
      await AddToCart.updateOne(
        { userEmail, productId },
        { $inc: { quantity: quantity } }, // increment quantity
        { session }
      );

      // 🔹 Reduce product stock
      await Product.findByIdAndUpdate(
        productId,
        { $inc: { stock: -quantity } },
        { session }
      );

      await session.commitTransaction();
      session.endSession();

      return res.send({ message: "Cart quantity updated successfully" });
    } else {
      // 🟢 Create new AddToCart entry
      let name = product?.name;
      let price = product?.lowprice;

      // Reduce product stock
      await Product.findByIdAndUpdate(
        productId,
        { $inc: { stock: -quantity } },
        { session }
      );

      let result = await AddToCart.create(
        [
          {
            userEmail,
            productId,
            name,
            price,
            quantity,
          },
        ],
        { session }
      );

      await session.commitTransaction();
      session.endSession();

      return res.send({ message: "Product added to cart successfully", data: result });
    }
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    return res
      .status(500)
      .send({ message: "Failed to add to cart", error: err.message });
  }
});



export let addToCartRoutes=router