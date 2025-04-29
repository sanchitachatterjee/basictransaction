import mongoose from "mongoose";
const MonthlyBudgetSchema = new mongoose.Schema({
    month: {type: String, required: true},
    category: {type: String, required: true},
    budget: {type: Number, required: true}
  });

const MonthlyBudget = mongoose.models.MonthlyBudget || mongoose.model("MonthlyBudget", MonthlyBudgetSchema);

export default MonthlyBudget;
