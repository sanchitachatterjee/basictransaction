"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import axios from "axios";

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editTransaction, setEditTransaction] = useState(null);
const router = useRouter();

  useEffect(() => {
    fetchTransactionDetails();
  }, []);

  const fetchTransactionDetails = async () => {
    try {
      const res = await axios.get("/api/transactionhandle");
      setTransactions(res.data);
    } catch (error) {
      console.error("Failed to fetch transactions", error);
    }
  };

  const addTransaction = async () => {
    if (!amount || !date || !description) return;
    try {
      const { data } = await axios.post("/api/transactionhandle", { amount, date, description });
      setTransactions((prev) => [...prev, data]);
      setAmount("");
      setDate("");
      setDescription("");
    } catch (error) {
      console.error("Failed to add transaction", error);
    }
  };

  const deleteTransaction = async (id) => {
    try {
      setTransactions((prev) => prev.filter((t) => t._id !== id));
      await axios.delete("/api/transactionhandle", { data: { id } });
      await fetchTransactionDetails();
    } catch (error) {
      console.error("Failed to delete transaction", error);
    }
  };

  const updateDetails = async () => {
    try {
      const { _id, amount, date, description } = editTransaction;
      const { data } = await axios.put("/api/transactionhandle", { id: _id, amount, date, description });
      setTransactions((prev) => prev.map((t) => (t._id === _id ? data : t)));
      setEditTransaction(null);
      setIsDialogOpen(false)
    } catch (error) {
      console.error("Failed to update transaction", error);
    }
  };


  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 space-y-8 bg-sky-100 border-2 rounded-lg">
      <h1 className="text-3xl text-white font-bold mb-6 border p-1 rounded-2xl bg-sky-700 text-center">Transaction Tracker</h1>

      <div className="space-y-4 p-4">
        <h2 className="text-xl font-semibold">Add Transaction</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <Input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          <Input
            type="text"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <Button onClick={addTransaction} className="bg-sky-700 text-white">Add Transaction</Button>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Your Transactions</h2>

        {transactions.length === 0 ? (
          <p >No transactions yet.</p>
        ) :

          (
            <div className="space-y-2">
              {transactions.map((t) => (
                <div key={t._id} className="flex items-center justify-between p-4">
                  <div>
                    <p >{t.amount}</p>
                    <p>{t.description}</p>
                    <p >{t.date}</p>
                  </div>
                  <div className="flex gap-2">
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" onClick={() => { setEditTransaction({ ...t }), setIsDialogOpen(true) }}>
                          Edit
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="p-6 space-y-4">
                        <h2 className="text-xl font-semibold">Edit Transaction</h2>
                        <div className="space-y-2">
                          Amount
                          <Input
                            type="number"
                            value={editTransaction?.amount || ""}
                            onChange={(e) =>
                              setEditTransaction((prev) => ({ ...prev, amount: e.target.value }))
                            }
                          />
                          Date
                          <Input
                            type="date"
                            value={editTransaction?.date || ""}
                            onChange={(e) =>
                              setEditTransaction((prev) => ({ ...prev, date: e.target.value }))
                            }
                          />
                          Description
                          <Input
                            type="text"
                            value={editTransaction?.description || ""}
                            onChange={(e) =>
                              setEditTransaction((prev) => ({ ...prev, description: e.target.value }))
                            }
                          />
                        </div>
                        <Button onClick={updateDetails}>
                          Save Changes
                        </Button>
                      </DialogContent>
                    </Dialog>
                    <Button variant="destructive" className="hover:bg-sky-700" size="sm" onClick={() => deleteTransaction(t._id)}>
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
      </div>

      <div className="flex justify-center">
        <Button className="mt-6 bg-sky-700 text-white" onClick={()=>{router.push("/transactionchart")}}>
          Show Monthly Expenses Bar Chart
        </Button>
      </div>
    </div>
  );
}

