import mongoose from "mongoose";

const fileSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    mimetype: {
      type: String,
      required: true,
    },
    path: {
      type: String,
    },
  },
  { timestamps: true }
);

const File = mongoose.model("File", fileSchema);

export default File;
