import mongoose from "mongoose";

//setting database connection
export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DB_URL);
        console.log('DB Connected');
    } catch (error) {
        console.error('DB Connection Error:', error);
        process.exit(1); // Exit the process with failure
    }
};