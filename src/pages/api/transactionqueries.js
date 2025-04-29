

import dbConnect from "@/lib/db";
import newTransaction from "@/models/transactionmodel";

export default async function handler(req, res) {
  await dbConnect();
  if(req.method=== "GET"){
    try{
    const totalTransactions = await newTransaction.aggregate([
        {
          $group: {
            _id: null,
            totalAmount: { $sum:  "$amount" },
          },
        },
      ])
 
      const categoryTransactions = await newTransaction.aggregate([
        { $group: 
            { _id: "$category", 
                total: { $sum: "$amount" } } },
      ]);

   const recentTransactions = await newTransaction.find().sort({ date: -1 });

      return res.status(200).json({totalTransactions,categoryTransactions, recentTransactions});
    } 
    
    catch (error) {
        console.error("Backend API Error (GET /api/transactionqueries):", error); // <-- This is key!
      return res.status(500).json({ error: "Failed to fetch data" });
    }
  }
}