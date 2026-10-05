import { useEffect, useState } from "react";
import { useFetch } from "./useFetch";

export interface Category {
  id: string;
  name: string;
  type: "income" | "expense";
  user_id: string | null;
}

export function useCategories() {
  const { data, loading, error } = useFetch<Category[]>("/categories");
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    if (data) setCategories(data);
  }, [data]);

  const addCategoryLocally = (newCat: Category) => {
    setCategories((prev) => [...prev, newCat]);
  };

  return {
    categories,
    loading,
    error,
    addCategoryLocally,
  };
}
