import mongoose from "mongoose"

//database schema to store user data
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    dob: { type: String, required: true },
    salary: { type: Number, required: true },
    date: { type: Date,  default:()=> Date.now() },
    purchasingPower:{type: Number, required: true},
});

const userModel = mongoose.models.user || mongoose.model("user", userSchema);

export default userModel;