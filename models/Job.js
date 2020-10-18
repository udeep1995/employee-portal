const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const JobSchema = new Schema({
  projectname: {
    type: String,
    required: true
  },
  clientname: {
    type: String,
    required: true
  },
  technologies: {
      type: [String],
      required: true
  },
  role: {
    type: String,
    required: true
  },
  jobdescription: {
    type: String,
    required: true
  },
  status: {
      type: Boolean,
      default: false,
      required: true
  },
  createdby: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: true
  }
});

module.exports = Job = mongoose.model("job", JobSchema);
