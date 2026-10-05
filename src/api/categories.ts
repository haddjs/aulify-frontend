export interface CreateCategoryPayload {
  name: string;
  type: "income" | "expense";
}

export async function createCategory(data: CreateCategoryPayload) {
  const res = await fetch(`${import.meta.env.VITE_BASE_URL}/categories`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => null);
    throw new Error(errorBody?.message || `Failed to create category: ${res.status}`);
  }

  return res.json();
}
