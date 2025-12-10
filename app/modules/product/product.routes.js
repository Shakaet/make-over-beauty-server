import { Router } from "express";
import Product from "./product.model.js";
import { catchAsynFunction } from "../../utils/catchasync.js";
import { sendImagetoCloudinary, upload } from "../../utils/sendImagestoCloudinary.js";


const router = Router()


router.post(
  "/create-product",

  // Multiple image upload (fields)
  upload.fields([
    { name: "imagePrimary", maxCount: 1 },
    { name: "imageSecondary", maxCount: 1 },
    { name: "imageThird", maxCount: 1 },
    { name: "imageFourth", maxCount: 1 },
  ]),

  // JSON parse middleware
  (req, res, next) => {
    if (req.body.data) {
      try {
        req.body = JSON.parse(req.body.data);
      } catch (error) {
        return res.status(400).json({ message: "Invalid JSON in form-data 'data'" });
      }
    }
    next();
  },

  catchAsynFunction(async (req, res) => {
    let bodyData = req.body;

    // Helper function to upload buffer to Cloudinary
    const uploadImage = async (fieldName, publicId) => {
      if (req.files[fieldName]) {
        const file = req.files[fieldName][0];

        const uploaded = await sendImagetoCloudinary(
          publicId,
          file.buffer   // ⬅ HERE: Uploading buffer instead of file path
        );

        bodyData[fieldName] = uploaded.secure_url;
      }
    };

    // Upload each image (if exists)
    await uploadImage("imagePrimary", "product_primary");
    await uploadImage("imageSecondary", "product_secondary");
    await uploadImage("imageThird", "product_third");
    await uploadImage("imageFourth", "product_fourth");

    // Create product in DB
    const result = await Product.create(bodyData);

    res.status(201).json({
      message: "Product created successfully!",
      data: result,
    });
  })
);




// Get all products
router.get(
  "/all-products",
  catchAsynFunction(async (req, res) => {
    let {
      search,         // product name search
      category,       // filter by category
      tag,            // filter by tags
      minPrice,       // minimum lowprice
      maxPrice,       // maximum lowprice
      page = 1,       // pagination page
      limit = 10,     // items per page
      sortBy = "createdAt", // sort field
      order = "desc",        // asc or desc
    } = req.query;

    page = parseInt(page);
    limit = parseInt(limit);

    const query = {};

    // 🔎 Search by product name
    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    // 📌 Filter by category
    if (category) {
      query.category = category;
    }

    // 📌 Filter by tag
    if (tag) {
      query.tags = tag;
    }

    // 📌 Filter by price range
    if (minPrice || maxPrice) {
      query.lowprice = {};
      if (minPrice) query.lowprice.$gte = parseFloat(minPrice);
      if (maxPrice) query.lowprice.$lte = parseFloat(maxPrice);
    }

    // Pagination
    const skip = (page - 1) * limit;

    // Sorting
    const sortOrder = order === "asc" ? 1 : -1;
    const sortQuery = {};
    sortQuery[sortBy] = sortOrder;

    // Fetch products
    const totalProducts = await Product.countDocuments(query);
    const products = await Product.find(query)
      .sort(sortQuery)
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      totalProducts,
      page,
      totalPages: Math.ceil(totalProducts / limit),
      data: products,
    });
  })
);







// Get single products
router.get("/product/:id", catchAsynFunction(async (req, res) => {


  let id = req.params.id
  // use the underlying MongoDB collection directly
  const result = await Product.findById(id);

  res.status(201).json({
    data: result
  });
}
))


// Update Product
router.patch(
  "/update-product/:id",

  upload.fields([
    { name: "imagePrimary", maxCount: 1 },
    { name: "imageSecondary", maxCount: 1 },
    { name: "imageThird", maxCount: 1 },
    { name: "imageFourth", maxCount: 1 },
  ]),

  (req, res, next) => {
    if (req.body.data) {
      try {
        req.body = JSON.parse(req.body.data);
      } catch (e) {
        return res.status(400).json({ message: "Invalid JSON in data" });
      }
    }
    next();
  },

  catchAsynFunction(async (req, res) => {
    const productId = req.params.id;
    let updateData = req.body;

    const uploadImage = async (fieldName, publicId) => {
      if (req.files[fieldName]) {
        const file = req.files[fieldName][0];

        const uploaded = await sendImagetoCloudinary(publicId, file.buffer);
        updateData[fieldName] = uploaded.secure_url;
      }
    };

    // Upload images if provided
    await uploadImage("imagePrimary", "product_primary");
    await uploadImage("imageSecondary", "product_secondary");
    await uploadImage("imageThird", "product_third");
    await uploadImage("imageFourth", "product_fourth");

    const result = await Product.findByIdAndUpdate(productId, updateData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      message: "Product updated successfully!",
      data: result,
    });
  })
);



// Delete Product
router.delete(
  "/delete-product/:id",
  catchAsynFunction(async (req, res) => {
    const productId = req.params.id;

    const deletedProduct = await Product.findByIdAndDelete(productId);

    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({
      message: "Product deleted successfully!",
      data: deletedProduct,
    });
  })
);




export let productRoutes = router