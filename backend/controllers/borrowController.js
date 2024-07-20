import loanModel from "../models/loanModel.js";
import userModel from "../models/userModel.js";

//borrowing loan
const borrow = async (req, res) => {

    try {
        const { userId, borrowedAmount } = req.body; //getting the required parameters

        const user = await userModel.findById(userId); //fetching the userId of the user borrowing loan

        //cheking if the borrowed amount less than the purchasing power
        if (borrowedAmount > user.purchasingPower) {
            return res.status(400).json({ success: false, message: 'Borrowed amount exceeds purchasing power' });
        }

        const interestRate = 8; // Annual interest rate in percentage
        const tenureMonths = 60; // 5 years tenure

        //searching the database to check the user already borrowed a loan or not
        let loan = await loanModel.findOne({ userId });

        //if user doesn't have any previous loan new loan credentials is created
        if (!loan) {
            //calculating monthly payment
            const monthlyPayment = calculateMonthlyRepayment(borrowedAmount, interestRate, tenureMonths);

            loan = new loanModel({
                userId: userId,
                borrowedAmount: borrowedAmount,
                monthlypayment: monthlyPayment,
                tenure: "60 months"
            })

            await loan.save();//saving the loan model
        }
        else { //if the user have a borrowed loan his credentials gets updated
            loan.borrowedAmount += Number(borrowedAmount);//adding the borrowedAmount to previous loan amount 

            //calculating monthly payment with new loan amount
            const monthlyPayment = calculateMonthlyRepayment(loan.borrowedAmount, interestRate, tenureMonths);
            //updating and then saving to database
            loan.monthlyPayment = monthlyPayment;
            await loan.save();
        }

        // Updating purchase power
        user.purchasingPower -= borrowedAmount;
        await user.save();

        //generating a response
        res.json({
            success: true, data: {
                loan,
                updatedPurchasingPower: user.purchasingPower
            }
        })
    } catch (error) { //to catch errors
        console.log(error);
        res.json({ success: false, message: "Error" })
    }
}

//fucntion to calculate monthly payment
const calculateMonthlyRepayment = (loanAmount, interestRate, tenureMonths) => {
    //converting annual interest rate to monthly rate
    const monthlyRate = interestRate / 12 / 100;

    //calculating monthly payment using the formula
    const monthlyPayment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) / (Math.pow(1 + monthlyRate, tenureMonths) - 1);

    return monthlyPayment;
};


export { borrow };