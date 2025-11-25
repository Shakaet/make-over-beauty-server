import mongoose from "mongoose";

const addToCartSchema = new mongoose.Schema({
  userEmail: {           // new field
    type: String,
    required: true
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  name: { type: String },
  price: { type: Number },
  quantity: { type: Number, required: true, default: 1 },
  image: {type:String},
  createdAt: { type: Date, default: Date.now },
});

const AddToCart = mongoose.model("AddToCart", addToCartSchema);
export default AddToCart;
