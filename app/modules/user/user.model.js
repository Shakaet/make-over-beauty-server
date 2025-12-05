import mongoose from "mongoose";

// Define user schema
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      minlength: [3, "Username must be at least 3 characters"],
      maxlength: [20, "Username cannot exceed 20 characters"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/, "Invalid email format"],
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
    },
    address: {
      type: String,
      required: [true, "Address is required"],
      minlength: [5, "Address must be at least 5 characters"],
      maxlength: [100, "Address cannot exceed 100 characters"],
    },
    role: {
      type: String,
      enum: ["customer", "admin","manager"],
      default: "customer",
    },
    
      product_access: {
        type: Boolean,
        default: false,
      },

      blog_access: {
        type: Boolean,
        default: false,
      },

      order_access: {
        type: Boolean,
        default: false,
      },

      siteSetting_access: {
        type: Boolean,
        default: false,
      },

      customer_access: {
        type: Boolean,
        default: false,
      },
        
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { versionKey: false }
);

// Export the model (avoid redefining model in dev)
const User = mongoose.model("User", userSchema);
export default User;
