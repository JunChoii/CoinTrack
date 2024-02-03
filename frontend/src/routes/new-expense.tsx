import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useNavigate } from "@tanstack/react-router";
import { createFileRoute } from "@tanstack/react-router";
import { createExpense } from "@/network";

export const Route = createFileRoute("/new-expense")({
  component: NewExpensePage,
});

function NewExpensePage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState<string>('');
  const [total, setTotal] = useState<number | ''>(''); // using '' to allow an empty string temporarily

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      // Convert the total to a number (if not empty) before submitting
      const expenseTotal = total === '' ? '' : Number(total);

      // Call the createExpense function to add a new expense
      await createExpense({ title, total: Number(expenseTotal) });

      // Navigate to the expenses list page after successful submission
      navigate({ to: "/all-expenses" });
    } catch (error) {
      console.error('Error creating expense:', error);
      // Handle error as needed
    }
  };

  return (
    <>
      <h1 className="text-2xl">New Expense</h1>

      <form className="flex flex-col gap-y-10" onSubmit={handleSubmit}>
        <Label>
          Title
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </Label>

        <Label>
          Total
          <Input
            type="number"
            value={total}
            onChange={(e) => setTotal(e.target.value as number | '')}
          />
        </Label>

        <Button type="submit">
          Submit
        </Button>
      </form>
    </>
  );
}

export default NewExpensePage;
