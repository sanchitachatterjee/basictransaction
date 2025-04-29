"use client";
import { useState } from "react";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function BudgetForm () {
  const [month,setMonth] = useState("");
  const [category,setCategory] = useState("");
  const [budget,setBudget] = useState("");
  const router=useRouter();
const setbudgetDetails = async () => {
    try {
      const {data} = await axios.post("/api/budgethandle", {category, budget, month});
    } 
   catch (error) {
      console.error("Failed to set budget Details", error);}
  };

  return (
    <div>
      <h3 className="font-semibold text-sky-700">Set Monthly Budget</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
      <Input type="month" placeholder="Enter Month" value={month} onChange={(e) => setMonth(e.target.value)}/>
       <Input type="text" placeholder="Enter category" value={category}  onChange={(e) => setCategory(e.target.value)}/>
      <Input type="number" placeholder="Enter Budget" value={budget}onChange={(e) => setBudget(e.target.value)}/>
      </div>
      <Button className="mt-6 bg-sky-700 text-white hover:text-sky-700 hover:bg-white" onClick={setbudgetDetails}>Submit</Button> <br/>  <br/>
      <Button className="mt-6 bg-sky-700 text-white hover:text-sky-700 hover:bg-white" onClick={()=>router.push('/insight')}>Move to Insights</Button>
    </div>

  );
};
