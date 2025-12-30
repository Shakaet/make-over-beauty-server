import { Router } from "express";
import { catchAsynFunction } from "../../utils/catchasync.js";
import Brand from "./brand.model.js";


const router = Router();


router.post(
  "/",
  catchAsynFunction(async (req, res) => {
    const { brandName } = req.body;

    const isExist = await Brand.findOne({
      brandName: brandName,
    });

    if (isExist) {
      return res.status(409).json({
        message: "Brand already exists",
      });
    }

    const result = await Brand.create({
      brandName: brandName,
    });

    res.status(201).json({
      message: "Brand created successfully",
      data: result,
    });
  })
);

router.get(
  "/",
  catchAsynFunction(async (req, res) => {
    const result = await Brand.find();

    res.status(200).json({
      data: result,
    });
  })
);

router.get(
  "/:id",
  catchAsynFunction(async (req, res) => {
    const { id } = req.params;

    const result = await Brand.findById(id);

    res.status(200).json({
      data: result,
    });
  })
);


router.put(
  "/:id",
  catchAsynFunction(async (req, res) => {
    const { id } = req.params;
    const { brandName } = req.body;

    const result = await Brand.findByIdAndUpdate(
      id,
      { brandName: brandName },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      message: "Brand updated successfully",
      data: result,
    });
  })
);

router.delete(
  "/:id",
  catchAsynFunction(async (req, res) => {
    const { id } = req.params;

    await Brand.findByIdAndDelete(id);

    res.status(200).json({
      message: "Brand deleted successfully",
    });
  })
);


export let brandRoutes = router
