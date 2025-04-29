import mongoose from "mongoose";

const TransactionSchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },

});

const NewTransactionSchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },
  category:{type:String,required:true}
});

// // const Transaction= mongoose.model("Transaction",TransactionSchema)
// const newTransaction= mongoose.model("newTransaction",NewTransactionSchema)
// export default newTransaction;

const newTransaction = mongoose.models.newTransaction || mongoose.model("newTransaction", NewTransactionSchema);

export default newTransaction;

