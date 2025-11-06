import { Router } from "express";

import Post from "./post.model.js";
import { catchAsynFunction } from "../../utils/catchasync.js";



const router = Router()

// Get all post
router.get("/all-post", catchAsynFunction(async (req, res) => {
  
   

    // use the underlying MongoDB collection directly
    const result = await Post.find();

    res.status(201).json({ 
        data:result
     });
  } 
))


// Get single post
router.get("/post/:id", catchAsynFunction(async (req, res) => {
  
   
    let id=req.params.id
    // use the underlying MongoDB collection directly
    const result = await Post.findById(id);

    res.status(201).json({ 
        data:result
     });
  } 
))


export let postRoutes=router