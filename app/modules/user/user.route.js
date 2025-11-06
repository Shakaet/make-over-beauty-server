import express from "express";
import User from "./user.model.js";
import { catchAsynFunction } from "../../utils/catchasync.js";


const router = express.Router();

// POST new user
router.post("/users", catchAsynFunction(async (req, res) => {
  try {
    const userData = req.body;
    // console.log(userData)
    const existing = await User.findOne({ email: userData.email });

    if (existing) {
      return res.status(400).json({ message: "User already exists" });
    }

    // use the underlying MongoDB collection directly
    const result = await User.create(userData);

    res.status(201).json({ insertedId: result.insertedId });
  } catch (error) {
    console.error("Error saving user:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
}))


// Get new user
router.get("/users", catchAsynFunction(async (req, res) => {
  
   

    // use the underlying MongoDB collection directly
    const result = await User.find();

    res.status(201).json({ 
        data:result
     });
  } 
))

 export let userRoutes=router

