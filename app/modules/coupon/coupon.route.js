import { Router } from "express";
import { Coupon } from "./coupon.model.js";

let router = Router()



router.post("/validate", async (req, res) => {
  const { code } = req.body;

  try {
    const coupon = await Coupon.findOne({ code });
    console.log(coupon);

    if (!coupon) {
      return res.status(404).json({ success: false, message: "Invalid coupon" });
    }

    let isActiveChecks= coupon.isActive===true;

    if(!isActiveChecks){
        return res.status(400).json({ success: false, message: "Coupon is inactive" });
    }

    if (new Date() > coupon.expiresAt) {
      return res.status(400).json({ success: false, message: "Coupon expired" });
    }

    res.json({
      success: true,
      discountPercentage: coupon.discountPercentage,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});


// Create a new coupon
router.post("/create", async (req, res) => {
  try {
    let { code, discountPercentage, expiresAt, isActive } = req.body;

    // Validation
    if (!code || discountPercentage === undefined || !expiresAt) {
      return res.status(400).json({
        success: false,
        message: "Code, discountPercentage, and expiresAt are required",
      });
    }

       // Discount limit check
    if (discountPercentage > 90) {
      return res.status(400).json({
        success: false,
        message: "Discount cannot be more than 90%",
      });
    }

    

    // Check for duplicate
    const existingCoupon = await Coupon.findOne({ code,isActive:true });
    if (existingCoupon) {
      return res.status(400).json({
        success: false,
        message: "Coupon code already exists",
      });
    }

    

   let result = await Coupon.create({
        code,
        discountPercentage,
        expiresAt,
        isActive
   });

    res.status(201).json({
      success: true,
      message: "Coupon created successfully",
      coupon: result,
    });
  } catch (error) {
    console.error("Error creating coupon:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});



export let couponRoutes= router;