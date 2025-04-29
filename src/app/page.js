"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import axios from "axios";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
} from "@/components/ui/select"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editTransaction, setEditTransaction] = useState(null);
  const [category, setCategory] = useState("")
  const [totalExpenses, setTotalExpenses] = useState([])
  const [categoryBreakdown, setCategoryBreakdown] = useState([])
  const [recentTransaction, setRecentTransactions] = useState([])
  const [summary, setSummary] = useState(true)
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
    if (!amount || !date || !description || !category) return;
    try {
      const { data } = await axios.post("/api/transactionhandle", { amount, date, description,category});
      setTransactions((prev) => [...prev, data]);
      setAmount("");
      setDate("");
      setDescription("");
      setCategory("")
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



  const total = async () => {
    try {
      const { data } = await axios.get("/api/transactionqueries")
      console.log(data)
      setTotalExpenses(data.totalTransactions)
    } catch (error) {
      console.error("Failed to fetch total transactions", error);
    }
  }

  const categorywisedata = async () => {
    try {
      const { data } = await axios.get("/api/transactionqueries")
      setCategoryBreakdown(data.categoryTransactions)
    } catch (error) {
      console.error("Failed to fetch total transactions", error);
    }
  }

  const recentdata = async () => {
    try {
      const { data } = await axios.get("/api/transactionqueries")
      setRecentTransactions(data.recentTransactions)
    } catch (error) {
      console.error("Failed to fetch total transactions", error);
    }
  }
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
          <input
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
          <Select value={category} onValueChange={(value) => setCategory(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select a Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="fd">Fixed Deposit</SelectItem>
                <SelectItem value="investment">Investment</SelectItem>
                <SelectItem value="stockmarket">Stock Market</SelectItem>
                <SelectItem value="others">Other</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
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

      <div className="flex-col justify-center">
        <div>
        <Button className="mt-6 bg-sky-700 text-white" onClick={() => { router.push("/transactionchart") }}>
          Show Monthly Expenses Bar Chart
        </Button>
        </div>
        <div> 
        <Button className="mt-6 bg-sky-700 text-white" onClick={() => router.push("/categorywisechart") } >
        Show Categorywise Bar Chart
        </Button>
        </div>
      </div>
      <div>
        {summary && (
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="mt-6 bg-sky-700 text-white" onClick={() =>{total(),categorywisedata(),recentdata(), setSummary(true)}}>Show Summary</Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium leading-none">Summary</h4>
                </div>
                <div className="grid gap-2">
                  <div className="grid grid-cols-3 items-center gap-4">
                    {/* <p>Total expenses :- {totalExpenses.totalAmount}</p> */}
                  </div>
                  <div className="grid grid-cols-3 items-center gap-4">
                    {categoryBreakdown.map((e, i) => (<h4 key={i}>Category:-{e._id} Amount:-{e.total} </h4>))}
                  </div>
                  <div className="grid grid-cols-3 items-center gap-4">
                    Recent Transactions:-
                    {recentTransaction?.slice(0, 3).map((e, i) => (
                      <div key={i} className="mb-2">
                        <p className="font-medium">{e.amount} {e.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        )}
      </div>
    </div>
  );
}

