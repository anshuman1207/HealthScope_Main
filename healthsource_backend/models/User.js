import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  // Updated role field to match the frontend's select options
  role: {
    type: String,
    enum: ["PATIENT", "doctor", "ngo", "hospital","patient", "Patient", "government", "Government"],
    default: "public"
  },
  // Added city field to the schema to match the frontend form
  city: {
    type: String,
    required: false
  }
}, { timestamps: true });

// Hash password before saving. This is the correct place for this logic.
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare entered password with hashed password. This method is reusable.
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", UserSchema);
export default User;
