const mongoose = require("mongoose"); // Import mongoose

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  rollNo: { type: String, required: true, unique: true },
  course: { type: String, required: true },
});

// Export the model correctly
module.exports = mongoose.model("Student", studentSchema, "student");
