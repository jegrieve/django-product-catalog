"use client";

import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { API_BASE } from "@/lib/config";

type IdName = { id: number; name: string };

export type Product = {
  id: number;
  name: string;
  description: string;
  price: string;
  category: IdName | null;
  tags: IdName[];
};

export type ProductsResponse = {
  results: Product[];
  pagination: {
    count: number;
    page: number;
    num_pages: number;
    page_size: number;
  };
};

const fetchJSON = (url: string) => {
  return fetch(url).then((res) => {
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  });
}

function buildQuery(params: Record<string, string | number | undefined>) {
  const sp = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v === undefined || v === null || v === "") continue;
    sp.set(k, String(v));
  }
  return sp.toString();
}

export function useCategories(enabled = false) {
  return useQuery({
    queryKey: ["categories"],
    queryFn: () => fetchJSON(`${API_BASE}/categories`) as Promise<{ results: IdName[] }>,
    enabled,
  });
}

export function useTags(enabled = false) {
  return useQuery({
    queryKey: ["tags"],
    queryFn: () => fetchJSON(`${API_BASE}/tags`) as Promise<{ results: IdName[] }>,
    enabled,
  });
}

export type ProductParams = {
  q?: string;
  category?: number;
  tags?: number[];
  page?: number;
  page_size?: number;
};

export function useProducts(params: ProductParams, enabled = false) {
  const query = buildQuery({
    q: params.q,
    category: params.category,
    tags: params.tags?.length ? params.tags.join(",") : undefined,
    page: params.page ?? 1,
    page_size: params.page_size ?? 10,
  });

  return useQuery({
    queryKey: ["products", params],
    queryFn: () =>
      fetchJSON(`${API_BASE}/products?${query}`) as Promise<ProductsResponse>,
    enabled,
  });
}

type ProductFilters = {
  q?: string;
  category?: number;
  tags?: number[];
  page_size?: number;
};

// products data is paginated
export function useProductsInfinite(filters: ProductFilters) {
  return useInfiniteQuery({
    queryKey: ["products-infinite", filters],
    queryFn: ({ pageParam = 1 }) => {
      const query = buildQuery({
        q: filters.q,
        category: filters.category,
        tags: filters.tags?.length ? filters.tags.join(",") : undefined,
        page: pageParam,
        page_size: filters.page_size ?? 10,
      });
      return fetchJSON(`${API_BASE}/products?${query}`) as Promise<ProductsResponse>;
    },
    initialPageParam: 1,
    getNextPageParam: (last) => {
      const { page, num_pages } = last.pagination;
      return page < num_pages ? page + 1 : undefined;
    },
  });
}
