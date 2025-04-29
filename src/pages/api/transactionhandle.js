import dbConnect from "@/lib/db";
import newTransaction from "@/models/transactionmodel";

export default async function handler(req, res) {
  await dbConnect();
  if (req.method === "GET") {
    try {
        const transactions = await newTransaction.find({});
        return res.status(200).json(transactions);
    }
       catch (error) { 
        return res.status(500).json({  error: error.message });
      }
  }

  if (req.method === "POST") {
    try {    
      console.log(req.body)
      const transaction = await newTransaction.create(req.body);
      return res.status(201).json(transaction);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  if (req.method === "PUT") {
    const { id, ...data } = req.body;
    try {
      const transaction = await newTransaction.findByIdAndUpdate(id, data, { new: true });
      return res.status(200).json(transaction);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  if (req.method === "DELETE") {
    const { id } = req.body;
    try {
        await newTransaction.findByIdAndDelete(id);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
}
