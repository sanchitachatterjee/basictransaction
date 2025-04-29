"use client";
import { useState, useEffect } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function CategoryPieChart() {
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

  const processCategoryData = () => {
    const categories = {};

    transactions.forEach((transaction) => {
      const { category, amount } = transaction;
      if (category) {
        if (!categories[category]) 
          categories[category] = 0;
        
        categories[category] += amount;
      }
    });
return Object.keys(categories).map((category) => ({
      category,
      amount: categories[category],
    }));
  };
  const colors = ["#d9b650","#962071","#61b390","#9d53c3"];
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-sky-700">Category Wise Pie Chart</h1>

      <div className="w-full h-100">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
            data={processCategoryData()}
            dataKey="amount"
            nameKey="category"
            cx="50%"
            cy="50%"
            outerRadius={80}
            fill="#0092ca"
            label
            >
            { processCategoryData().map((e, i) => (
                <Cell key={i} fill={colors[i % colors.length]} />
              ))
             }

            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <Button className="mt-6 bg-sky-700 text-white" onClick={() => router.push("/")}>
        Back to Transactions
      </Button>
    </div>
  );
}
