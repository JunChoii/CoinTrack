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
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/main";
import { deleteExpense, Expense } from "@/network";
// import { Button, buttonVariants } from "@/components/ui/button";

export const Route = createFileRoute("/all-expenses")({
  component: AllExpenses,
});

function AllExpenses() {
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

  // const editExpenseMutation = useMutation({
  //   mutationFn: updateExpense,
  //   onSettled: () => {
  //     queryClient.invalidateQueries({ queryKey: ["expenseData"] });
  //   },
  // });

  // const handleEditExpense = async (id: number) => {
  //   try {
  //     await editExpenseMutation.mutateAsync({ id, title: "", total: 0 });
  //   } catch (error) {
  //     console.error("Error editing expense:", error);
  //   }
  // };

  return (
    <>
      <h1 className="text-2xl ml-5">All Expenses</h1>
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

              <TableCell
                onClick={() => handleDeleteExpense(expense.id)}
                className="text-red-500 hover:text-red-700 hover:bg-red-900 align-middle"
              >
                Delete
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
