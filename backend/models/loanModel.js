import mongoose from 'mongoose'

//database schema to store loan data
const loanSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    borrowedAmount: { type: Number, required: true },
    monthlypayment: { type: Number, required: true},
    tenure: { type: String, required: true}
})

const loanModel = mongoose.model.loan || mongoose.model("loan",loanSchema);

export default loanModel;