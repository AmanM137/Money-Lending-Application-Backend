import express from "express"
import cors from "cors"
import { connectDB } from "./config/db.js"
import userRouter from "./routes/userRoute.js"
import 'dotenv/config'
import loanRouter from "./routes/borrowRoute.js"

//app config
const app = express()
const port = process.env.PORT

//middleware
app.use(express.json())
app.use(cors())

//DB connection
connectDB();

//api endpoints
app.use("/api/user", userRouter)
app.use("/api/loan", loanRouter)

app.get("/", (req, res) => {
    res.send("API working")
})

app.listen(port, () => {
    console.log(`Server started on http://localhost:${port}`)
})
