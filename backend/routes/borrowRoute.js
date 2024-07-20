import express from 'express';
import authMiddleware from '../middleware/auth.js';
import { borrow } from '../controllers/borrowController.js';

const loanRouter = express.Router();

loanRouter.post("/borrow", authMiddleware, borrow); //setting route to loan api

export default loanRouter;