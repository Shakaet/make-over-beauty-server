import { Router } from "express";

import Post from "./post.model.js";
import { catchAsynFunction } from "../../utils/catchasync.js";
import { sendImagetoCloudinary, upload } from "../../utils/sendImagestoCloudinary.js";



const router = Router()


// create post
router.post(
  "/create-post",

  // Single file upload
  upload.single("image"),

   (req,res,next)=>{

    req.body= JSON.parse(req.body.data)
    // console.log(req.body)
    next()

  },

  catchAsynFunction(async (req, res) => {
    let bodyData = req.body;

    // Check image
    if (req.file) {
      const filePath = req.file.path;

      // Upload to Cloudinary
      const uploaded = await sendImagetoCloudinary("post_image", filePath);

      // Set image URL inside body
      bodyData.image = uploaded.secure_url;
    }

    // Create post in DB
    const result = await Post.create(bodyData);

    res.status(201).json({
      message: "Post created successfully!",
      data: result,
    });
  })
);

// Get all post
router.get(
  "/all-post",
  catchAsynFunction(async (req, res) => {
    let { search, category, tag, page = 1, limit = 10, sortBy = "createdAt", order = "desc" } = req.query;

    page = parseInt(page);
    limit = parseInt(limit);

    const query = {};

    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { excerpt: { $regex: search, $options: "i" } }
      ];
    }

    
    if (category) {
      query.categories = category; // exact match
    }

    
    if (tag) {
      query.tags = tag; // exact match
    }

   
    const skip = (page - 1) * limit;

   
    const sortOrder = order === "asc" ? 1 : -1;
    const sortQuery = {};
    sortQuery[sortBy] = sortOrder;

    
    const totalPosts = await Post.countDocuments(query);
    const posts = await Post.find(query)
      .sort(sortQuery)
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      totalPosts,
      page,
      totalPages: Math.ceil(totalPosts / limit),
      data: posts,
    });
  })
);



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




// Update Post
router.patch(
  "/update-post/:id",

  // Single file upload (optional)
  upload.single("image"),

  // JSON parse middleware
  (req, res, next) => {
    if (req.body.data) {
      req.body = JSON.parse(req.body.data);
    }
    next();
  },

  catchAsynFunction(async (req, res) => {
    const postId = req.params.id;
    let updateData = req.body;

    // Update image if new image is uploaded
    if (req.file) {
      const filePath = req.file.path;
      const uploaded = await sendImagetoCloudinary("post_image", filePath);
      updateData.image = uploaded.secure_url;
    }

    const updatedPost = await Post.findByIdAndUpdate(postId, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedPost) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.status(200).json({
      message: "Post updated successfully!",
      data: updatedPost,
    });
  })
);



// Delete Post
router.delete(
  "/delete-post/:id",
  catchAsynFunction(async (req, res) => {
    const postId = req.params.id;

    const deletedPost = await Post.findByIdAndDelete(postId);

    if (!deletedPost) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.status(200).json({
      message: "Post deleted successfully!",
      data: deletedPost,
    });
  })
);



export let postRoutes=router