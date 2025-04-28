"use client";
import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function ChartPage() {
  const [transactions, setTransactions] = useState([]);
  const router = useRouter();

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const {data} = await axios.get("/api/transactionhandle");
      setTransactions(data);
    } catch (error) {
      console.error("Failed to fetch transactions", error);
    }
  };

  const processChartData = () => {
    const months = {};
    transactions.forEach((transaction) => {
      const month = transaction.date.slice(0, 7);
      if (!months[month]) 
        months[month] = 0;
      months[month] = (months[month]) + Number(transaction.amount);
    });
    return Object.keys(months).map((m) => ({
      m,
      amount: months[m],
    }));
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Monthly Expenses Bar Chart</h1>

      <div className="w-full h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={processChartData()}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis dataKey="amount" />
            <Bar dataKey="amount" fill="#0092ca" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <Button className="mt-8 bg-sky-700 hover:bg-sky-400" onClick={() => router.push("/")}>
        Back to Transactions
      </Button>
    </div>
  );
}
