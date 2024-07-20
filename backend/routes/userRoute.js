import express from "express";
import { getUser, loginUser, registerUser } from "../controllers/userController.js";

const userRouter = express.Router()

userRouter.post("/register", registerUser) //setting route to register user api
userRouter.post("/login", loginUser) //setting route to login api
userRouter.get("/get",getUser) //setting route to get user api

export default userRouter;