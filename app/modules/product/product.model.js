import mongoose from "mongoose";

// Define Product Schema
const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      minlength: [3, "Product name must be at least 3 characters"],
      maxlength: [100, "Product name cannot exceed 100 characters"],
    },
    lowprice: {
      type: Number,
      required: [true, "Low price is required"],
      min: [0, "Price cannot be negative"],
    },
    highprice: {
      type: Number,
      min: [0, "Price cannot be negative"],
    },
    discount: {
      type: Number,
      required: [true, "Discount is required"],
      min: [0, "Discount cannot be negative"],
      max: [100, "Discount cannot exceed 100%"],
    },
    stock: {
      type: Number,
      required: [true, "Stock quantity is required"],
      min: [0, "Stock cannot be negative"],
    },
    rating: {
      type: Number,
      min: [0, "Rating cannot be less than 0"],
      max: [5, "Rating cannot exceed 5"],
      default: 0,
    },
    reviews: {
      type: Number,
      default: 0,
      min: [0, "Reviews count cannot be negative"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
    },
    imagePrimary: {
      type: String,
      required: [true, "Primary image is required"],
    },
    imageSecondary: {
      type: String,
      required: [true, "Secondary image is required"],
    },
    imageThird: {
      type: String,
      required: [true, "Third image is required"],
    },
    imageFourth: {
      type: String,
      required: [true, "Fourth image is required"],
    },
    quantity: {
      type: Number,
      default: 10,
      min: [0, "Quantity cannot be negative"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      minlength: [10, "Description must be at least 10 characters"],
    },
    ingredients: {
      type: [String],
      required: [true, "Ingredients list is required"],
    },
    tags: {
      type: [String],
      default: [],
    },
    shippingInfo: {
      type: [String],
      default: [],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { versionKey: false }
);

// Export the model (avoid redefining model in dev)
const Product = mongoose.model("Product", productSchema);
export default Product;
