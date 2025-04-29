"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import axios from "axios";

export default function insightPage() {
    const [insights, setInsights] = useState([]);

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
            <h2>Insights Details</h2>
            {insights.length > 0 ? (
                insights.map((i) => (
                    <ul key={i.category} className="space-y-2">
                        <li>Budget: {i.budget}</li>
                        <li>Total Spending: {i.totalSpent}</li>
                        <li>Category: {i.category}</li>
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
