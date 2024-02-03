import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency } from "@/lib/utils";
import { createFileRoute } from "@tanstack/react-router";
import { getExpenses } from "@/network";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/main";
import { deleteExpense, Expense, updateExpense } from "@/network";
import React from "react";

export const Route = createFileRoute("/all-expenses")({
  component: AllExpenses,
});

function AllExpenses() {
  const [editingExpense, setEditingExpense] = React.useState<Expense | null>(
    null
  );

  let { isPending, error, data } = useQuery({
    queryKey: ["expenseData"],
    queryFn: () => fetch("/api/Expenses").then((res) => res.json()),
  });

  const deleteExpenseMutation = useMutation({
    mutationFn: deleteExpense,
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: ["expenseData"] }),
  });

  if (isPending) return <h1>Loading...</h1>;
  if (error) return <h1>Error: {error.message}</h1>;

  const handleDeleteExpense = async (id: number) => {
    try {
      // Use the mutation function to delete the expense
      await deleteExpenseMutation.mutateAsync(id);
    } catch (error) {
      console.error("Error deleting expense:", error);
    }
  };

  // const handleEditExpense = (id: number) => {
  //   const expenseToEdit = data.find((expense: Expense) => expense.id === id);

  //   setEditingExpense(expenseToEdit);
  // };

  // const handleSaveEdit = async (editedExpense: Expense) => {
  //   try {
  //     await updateExpense({
  //       id: editingExpense!.id,
  //       newExpense: editedExpense,
  //     });

  //     setEditingExpense(null);

  //     queryClient.invalidateQueries({ queryKey: ["expenseData"] });
  //   } catch (error) {
  //     console.error("Error updating expense:", error);
  //   }
  // };

  return (
    <>
      <h1 className="text-2xl">All Expenses</h1>
      <Table>
        <TableCaption>A list of your recent expenses.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Invoice</TableHead>
            <TableHead className="text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.map((expense: Expense) => (
            <TableRow key={expense.id}>
              <TableCell className="font-medium">{expense.title}</TableCell>
              <TableCell className="text-right">
                {formatCurrency(expense.total)}
              </TableCell>
              <button
                onClick={() => handleDeleteExpense(expense.id)}
                className="text-red-500 hover:text-red-700"
              >
                Delete
              </button>
              <button
                // onClick={() => handleEditExpense(expense.id)}
                className="text-blue-500 hover:text-blue-700"
              >
                Edit
              </button>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
