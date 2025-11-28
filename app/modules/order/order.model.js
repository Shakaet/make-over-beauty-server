import mongoose from "mongoose";


const orderSchema = new mongoose.Schema({
  invoiceId: {
    type: String,
    unique: true
  },
  email:{type: String},
  subtotal: {type: Number},
  couponCode: {type: String},
  discountPercent: {type: String},
  totalAmount: {type: Number},

  items: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
      },
      quantity: {type: Number},
      price: {type: Number}
    }
  ],

  createdAt: {
    type: Date,
    default: Date.now
  }
});



export const Order= mongoose.model("Order", orderSchema);
