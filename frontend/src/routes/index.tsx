import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Expense } from "@/network";


export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  // Get this from the api
  // const totalSpent = formatCurrency(4321);
  let { isPending, error, data } = useQuery({
    queryKey: ["expenseData"],
    queryFn: () => fetch("/api/Expenses").then((res) => res.json()),
  });

  if (isPending) return <h1 className="flex justify-center items-center">Loading...</h1>;
  if (error) return <h1>Error: {error.message}</h1>;

  const totalSpent = formatCurrency(
    data.reduce((acc: number, expense: Expense) => acc + expense.total, 0)
  );

  return (
    <>
      <Card className="w-fit mx-auto">
        <CardHeader>
          <CardTitle className="text-sm">Total Spent:</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalSpent}</div>
        </CardContent>
      </Card>
    </>
  );
}
