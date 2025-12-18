import mongoose from "mongoose";

const brandSchema = new mongoose.Schema({
  brandName: {
    type: String,
    required: true,
    unique: true,      // ✅ duplicate block
    trim: true,
    lowercase: true,  // Apple = apple
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Brand = mongoose.model("Brand", brandSchema);
export default Brand;
