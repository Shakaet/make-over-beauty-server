import { catchAsynFunction } from "../../utils/catchasync.js";
import { sendImagetoCloudinary } from "../../utils/sendImagestoCloudinary.js";
import siteSettingModel from "./siteSetting.model.js";



export const updateSiteSetting = catchAsynFunction(async (req, res) => {
  const { site_name } = req.body;

  const sections = [];

  for (let i = 1; i <= 4; i++) {
    let imageUrl = "";

    // Image exists?
    if (req.files && req.files[`image${i}`] && req.files[`image${i}`][0]) {
      const file = req.files[`image${i}`][0];

      // Use BUFFER instead of PATH (because we're using memoryStorage)
      const fileBuffer = file.buffer; // Changed from file.path

      
      const uploaded = await sendImagetoCloudinary(`section_${i}`, fileBuffer);

      imageUrl = uploaded.secure_url;
    }

    sections.push({
      image: imageUrl,
      eyebrow: req.body[`eyebrow${i}`] || "",
      title: req.body[`title${i}`] || "",
      copy: req.body[`copy${i}`] || "",
      cta: req.body[`cta${i}`] || "",
      align: req.body[`align${i}`] || "left",
    });
  }

  const data = await siteSettingModel.findOneAndUpdate(
    {},
    { site_name, sections },
    { new: true, upsert: true }
  );

  res.status(200).json({
    success: true,
    message: "Site settings updated successfully!",
    data,
  });
});

export let AllSiteSetting = catchAsynFunction(async (req, res) => {

  let result = await siteSettingModel.find()
  res.status(200).json({
    success: true,
    message: "Site setting retrived successfully!",
    data: result,
  });




})








