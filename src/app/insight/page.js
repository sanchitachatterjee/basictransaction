"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function InsightPage() {
    const [insights, setInsights] = useState([]);
    const router=useRouter()
    useEffect(() => { fetchDetails(); }, []);

    const fetchDetails = async () => {
        try {
            const {data} = await axios.get("/api/budgethandle");
            setInsights(data);
        } catch (error) {
            console.error("Failed to fetch details", error);
        }
    };

    return (
        <div>
            <h2 className="font-bold">Insights Details</h2>
            {insights.length > 0 ? (
                insights.map((i) => (
                    <ul key={i.category}>
                         <li>Category: {i.category}</li>
                        <li>Budget: {i.budget}</li>
                        <li>Total Spending: {i.totalSpent}</li>
                    </ul>
                ))
            ) : (
                <p>No insights.</p>
            )}

            <Button className="mt-6 bg-sky-700 text-white" onClick={() => router.push("/")}>
                Back to Transactions
            </Button>
        </div>
    );
};
