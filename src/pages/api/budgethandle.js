import dbConnect from "@/lib/db";
import MonthlyBudget from "@/models/monthlybugetmodel";
import newTransaction from "@/models/transactionmodel";
export default async function handler(req, res) {
     await dbConnect();

if (req.method === "POST") {
    try {
      const { category, budget, month } = req.body;
      const presentbudget = await MonthlyBudget.findOne({ category, month });

      if (presentbudget) {
        presentbudget.budget = budget;
         presentbudget.save();
        return res.status(200).json(presentbudget);
      }

      const newbudget = new MonthlyBudget({month, budget,category});
      await newbudget.save();
      return res.status(201).json(newbudget);
    } 
    
    catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

if(req.method === "GET") {
    try {
        const transactions = await newTransaction.aggregate([
          { $group: { _id: "$category", totalAmount: { $sum: "$amount" } } } ]);
  
        const monthlyBudgets = await MonthlyBudget.find();
        const insight=transactions.map((t) => {
          const budget=monthlyBudgets.find(b => b.category === t._id);
          return { category: t._id, totalSpent: t.totalAmount, budget: budget?.budget ?? 0};
        });
    return res.status(200).json(insight)
      } 
      
      catch (error) {
        return res.status(400).json({ error: error.message });
      }
} 

  res.setHeader("Allow", ["POST","GET"]);
}
