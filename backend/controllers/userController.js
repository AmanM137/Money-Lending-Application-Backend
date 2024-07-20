import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";

//login user
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await userModel.findOne({ email });//searching for user in the database

        //if the user haven't register already
        if (!user) {
            return res.json({ success: false, message: "User doesn't exist" })
        }

        const isMatch = await bcrypt.compare(password, user.password);//checking if the hashed password is matching or not

        //if not matched
        if (!isMatch) {
            return res.json({ success: false, message: "Invalid credentials" })
        }

        const token = createToken(user._id);//creating token
        res.json({ success: true, token })

    } catch (error) { //catch the error if encountered
        console.log(error);
        res.json({ success: false, message: "Error" })
    }
}

//function to create token using jwt authentication
const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET)
}

//register user
const registerUser = async (req, res) => {
    const { name, password, email, dob, salary, phoneNumber } = req.body;
    try {
        //cheking if user already exists
        const exist = await userModel.findOne({ email })
        if (exist) {
            return res.json({ success: false, messgae: "User already exists" })
        }

        //validationg email format and strong password
        if (!validator.isEmail(email)) {
            return res.json({ success: false, messgae: "Please enter a valid email" })
        }

        //checking for salary criteria
        if (salary < 25000) {
            return res.json({ success: false, messgae: "Salary requirement not satisfied" })
        }

        //checking for age criteria
        const birthDate = new Date(dob);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        if (age < 20) {
            return res.json({ success: false, messgae: "Age requirement not satisfied" })
        }

        //hashing user password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        //calculating purchasing power amount
        const maxDTI = 0.40; // 40%
        const loanTenureMonths = 60; // 5 years
        const purchasingPowerAmount = (salary * loanTenureMonths * maxDTI);

        //creating new user
        const newUser = new userModel({
            name: name,
            email: email,
            password: hashedPassword,
            phoneNumber: phoneNumber,
            dob: dob,
            salary: salary,
            purchasingPower: purchasingPowerAmount,
        });

        const user = await newUser.save(); //saving user data to database
        const token = createToken(user._id); //creating token for the user
        res.json({ success: true, token });

    } catch (error) {
        res.json({ success: false, messgae: "Error" })
    }
}

//get user details
const getUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await userModel.findOne({ email });//searching for user in the database

        //if the user doesn't sexist
        if (!user) {
            return res.json({ success: false, message: "User doesn't exist" })
        }

        //formatting user details to hide unnecessary details
        const userData = {
            purchasePowerAmount: user.purchasingPower,
            phoneNumber: user.phoneNumber,
            email: user.email,
            registrationDate: user.date,
            dob: user.dob,
            salary: user.salary,
        }
        res.json({ success: true, userData })

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" })
    }
}

export { loginUser, registerUser, getUser };
