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

export interface UpdateCategoryPayload {
  name: string;
}

export async function updateCategory(id: string, data: UpdateCategoryPayload) {
  const res = await fetch(`${import.meta.env.VITE_BASE_URL}/categories/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => null);
    throw new Error(errorBody?.message || `Failed to update category: ${res.status}`);
  }

  return res.json();
}

