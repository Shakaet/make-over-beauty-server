import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  date: {
    type: String, // তুমি চাইলে Date type ও ব্যবহার করতে পারো, কিন্তু JSON এ string আছে
    required: true,
  },
  excerpt: {
    type: String,
    required: true,
  },
  categories: {
    type: [String],
    required: true,
  },
  tags: {
    type: [String],
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  content: {
    type: String,
    required: true,
  }
}, {
  timestamps: true // createdAt এবং updatedAt automatically add করবে
});

const Post = mongoose.model("Post", postSchema);

export default Post;
