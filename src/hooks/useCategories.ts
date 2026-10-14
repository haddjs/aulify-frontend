import { useState } from "react";

import { updateCategory } from "../api/categories";
import { useFetch } from "./useFetch";

export interface Category {
  id: string;
  name: string;
  type: "income" | "expense";
  user_id: string | null;
}

export function useCategories() {
  const { data, loading, error } = useFetch<Category[]>("/categories");
  const [localCategories, setLocalCategories] = useState<Category[] | null>(
    null,
  );

  const categories = localCategories ?? data ?? [];

  const addCategoryLocally = (newCat: Category) => {
    setLocalCategories((prev) => [...(prev ?? data ?? []), newCat]);
  };

  const updateCategoryLocally = (updatedCat: Category) => {
    setLocalCategories((prev) =>
      (prev ?? data ?? []).map((c) => (c.id === updatedCat.id ? updatedCat : c)),
    );
  };

  const editCategory = async (id: string, name: string) => {
    const updated = await updateCategory(id, { name });
    updateCategoryLocally(updated);
    return updated;
  };

  return {
    categories,
    loading,
    error,
    addCategoryLocally,
    updateCategoryLocally,
    editCategory,
  };
}


