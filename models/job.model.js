const mongoose = require("mongoose");

const JobSchema = new mongoose.Schema({
  company: { type: String, required: [true, "Missing field"] },
  location: { type: String, required: [true, "Missing field"] },
  type: { type: String, required: [true, "Missing field"] },
  position: { type: String, required: [true, "Missing field"] },
  specialty: { type: String, required: [true, "Missing field"] },
  description: { type: String, required: [true, "Missing field"] },
  skills: [{ type: String, required: [true, "Missing field"] }],
  image: {
    type: String,
    get: (v) => `${v}`,
    required: [true, "Missing field"],
  },
});

const Job = mongoose.model("Job", JobSchema);

module.exports = Job;
