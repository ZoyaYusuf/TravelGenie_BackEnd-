import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from 'uuid';

const userSchema = new mongoose.Schema({
    userId: {
      type: String, 
      required : true,
      unique: true,
      default: uuidv4
    },
    name: {
        type: String,
        required: true,
        minlength: 2
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    }
});

// Hash password before saving
userSchema.pre("save", async function(next){
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// Method to compare password for Login
userSchema.methods.matchPassword = function(enteredPassword){
    return bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model("User", userSchema);
