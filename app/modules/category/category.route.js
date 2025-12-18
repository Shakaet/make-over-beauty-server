
import { Router } from "express";
import { catchAsynFunction } from "../../utils/catchasync.js";
import Category from "./category.model.js";


let router = Router()

router.post(
  "/",
  catchAsynFunction(async (req, res) => {
    const { categoryName, subCategories } = req.body;

    // 🔍 check existing category
    const isExist = await Category.findOne({
      categoryName: categoryName.toLowerCase(),
    });

    if (isExist) {
      return res.status(409).json({
        message: "Category already exists",
      });
    }

    const result = await Category.create({
      categoryName,
      subCategories,
    });

    res.status(201).json({
      message: "Category created successfully",
      data: result,
    });
  })
);

router.get(
  "/",
  catchAsynFunction(async (req, res) => {
    const result = await Category.find();

    res.status(200).json({
      data: result,
    });
  })
);

router.get(
  "/:id",
  catchAsynFunction(async (req, res) => {
    const { id } = req.params;

    const result = await Category.findById(id);

    res.status(200).json({
      data: result,
    });
  })
);


router.put(
  "/:id",
  catchAsynFunction(async (req, res) => {
    const { id } = req.params;

    const result = await Category.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      message: "Category updated successfully",
      data: result,
    });
  })
);



router.delete(
  "/:id",
  catchAsynFunction(async (req, res) => {
    const { id } = req.params;

    await Category.findByIdAndDelete(id);

    res.status(200).json({
      message: "Category deleted successfully",
    });
  })
);


export let categoryRoutes = router