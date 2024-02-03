export type Expense = {
  id: number;
  title: string;
  total: number;
};



export async function getExpenses() {
  const result = await fetch("/api/Expenses");
  return await result.json();
}

export async function deleteExpense(id: number) {
  await fetch(`/api/Expenses/${id}`, { method: "DELETE" });
}

export async function createExpense({
  title,
  total,
}: {
  title: string;
  total: number;
}) {
  const expense = await fetch("/api/Expenses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title, total }),
  }).then((response) => response.json());
  return expense;
}

export async function updateExpense({
  id,
  title,
  total,
}: {
  id: number;
  title: string;
  total: number;
}): Promise<Expense> {
  try {
    const result = await fetch(`/api/Expenses/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, total }),
    });

    if (!result.ok) {
      throw new Error("Failed to update expense");
    }

    return await result.json();
  } catch (error) {
    console.error("Error updating expense:", error);
    throw error;
  }
}

// export default async function getExpenseByRating(rating: number) {
//   const result = await fetch(`/api/Expenses/ByRating?starRating=${rating}`, {
//     method: "GET",
//   });
//   return await result.json();
// }
