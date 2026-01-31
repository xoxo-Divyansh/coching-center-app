import mongoose from "mongoose";
console.log("🔥 COURSE MODEL LOADED FROM:", import.meta.url);
const courseSchema = new mongoose.Schema(
  
  {
    title: {
      type: String,
      required: [true, "Course title is required"],
      trim: true,
    },

    description: {
      type: String,
       required: [true, "Course description is required"],
    },

    price: {
      type: Number,
       required: [true, "Course price is required"],
      min: 0,
    },

    duration: {
      type: String, //"3 months"
      required: true,
    },

    level: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      default: "beginner",
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const Course = mongoose.model("Course", courseSchema);
export default Course;
