"use client";

import { useCategories, useTags, useProducts } from "@/hooks";
import { useEffect, useMemo, useState } from "react";

const useDebounced = (value: string, delay = 300) => {
  const [v, setV] = useState(value);
  useEffect(() => {
    const timeoutId = setTimeout(() => setV(value), delay);
    return () => clearTimeout(timeoutId);
  }, [value, delay]);
  return v;
}

export default function Home() {
  const [q, setQ] = useState("");
  const dq = useDebounced(q, 300);
  const [categoryId, setCategoryId] = useState<string>("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(9);
  const [isTagsOpen, setIsTagsOpen] = useState(false);
  
  const toggleTag = (id: string) => {
    setSelectedTags((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  // lookup data
  const { data: catData, isLoading: catsLoading, error: catsError } = useCategories(true);
  const { data: tagData, isLoading: tagsLoading, error: tagsError } = useTags(true);

  // build products query params
  const productParams = useMemo(
    () => ({
      q: dq,
      category: categoryId ? Number(categoryId) : undefined,
      tags: selectedTags.length ? selectedTags.map((id) => Number(id)) : undefined,
      page,
      page_size: pageSize,
    }),
    [dq, categoryId, selectedTags, page, pageSize]
  );

  const {
    data: prodData,
    isLoading: productsLoading,
    error: productsError,
  } = useProducts(productParams, true);

  // pagination data
  const total = prodData?.pagination.count ?? 0;
  const currentPage = prodData?.pagination.page ?? 1;
  const totalPages = prodData?.pagination.num_pages ?? 1;

  // reset page when filters or debounced query changes 
  useEffect(() => {
    setPage(1);
  }, [dq, categoryId, selectedTags, pageSize]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <header className="sticky top-0 z-10 border-b bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
          <h1 className="text-lg sm:text-xl font-semibold tracking-tight text-black">Product Catalog</h1>
          <span className="text-xs sm:text-sm text-gray-900">
            {productsLoading ? "Loading…" : `${total} result(s)`}
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6 space-y-6">
        {/* Filters */}
        <section className="bg-white border rounded-2xl shadow-sm p-4 sm:p-5">
          <div className="grid gap-3 md:grid-cols-3">
            {/* Search */}
            <label className="block">
              <span className="block text-xs font-medium text-gray-900 mb-1">Search</span>
              <input
                className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white text-sm text-black"
                placeholder="Search description…"
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
            </label>

            {/* Category */}
            <label className="block">
              <span className="block text-xs font-medium text-gray-900 mb-1">Category</span>
              <select
                className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white text-sm text-black"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                disabled={catsLoading || !!catsError}
              >
                <option value="">All categories</option>
                {catData?.results?.map((c) => (
                  <option key={c.id} value={String(c.id)}>
                    {c.name}
                  </option>
                ))}
              </select>
              {catsLoading && <div className="mt-1 text-xs text-gray-900">Loading categories…</div>}
              {catsError && <div className="mt-1 text-xs text-red-600">Failed to load categories.</div>}
            </label>

            {/* Tags (minimal dropdown + chips) */}
            <div className="block">
              <span className="block text-xs font-medium text-gray-900 mb-1">Tags</span>

              <div className="relative">
                <button
                  type="button"
                  onClick={() => !tagsLoading && !tagsError && setIsTagsOpen((v) => !v)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white text-left text-sm text-black flex items-center justify-between disabled:bg-gray-50 disabled:text-gray-400"
                  disabled={tagsLoading || !!tagsError}
                >
                  <span className="truncate">
                    {selectedTags.length ? `${selectedTags.length} selected` : "All tags"}
                  </span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-4 w-4 text-gray-900 transition-transform ${isTagsOpen ? "rotate-180" : ""}`}
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.23 7.21a.75.75 0 011.06.02L10 10.19l3.71-2.96a.75.75 0 11.94 1.17l-4.18 3.33a.75.75 0 01-.94 0L5.21 8.4a.75.75 0 01.02-1.19z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>

                {isTagsOpen && (
                  <div className="absolute z-20 mt-2 w-full rounded-xl border bg-white shadow p-3 max-h-60 overflow-auto">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-xs text-gray-900">Select one or more</span>
                      <button
                        onClick={() => setSelectedTags([])}
                        className="text-xs text-indigo-800 hover:underline"
                      >
                        Clear
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
                      {tagData?.results?.map((t) => {
                        const id = String(t.id);
                        const checked = selectedTags.includes(id);
                        return (
                          <label key={id} className="inline-flex items-center gap-2 text-sm text-gray-900">
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() => toggleTag(id)}
                              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                            />
                            <span>{t.name}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Selected chips */}
              {selectedTags.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {selectedTags.map((id) => {
                    const t = tagData?.results?.find((x) => String(x.id) === id);
                    if (!t) return null;
                    return (
                      <span
                        key={id}
                        className="inline-flex items-center gap-1 rounded-full border bg-indigo-50 border-indigo-200 text-indigo-900 px-2 py-0.5 text-xs"
                      >
                        {t.name}
                        <button
                          aria-label={`Remove ${t.name}`}
                          onClick={() => toggleTag(id)}
                          className="hover:text-indigo-950"
                        >
                          ×
                        </button>
                      </span>
                    );
                  })}
                </div>
              )}

              <div className="mt-1 text-xs text-gray-900">
                {tagsLoading && "Loading tags…"}
                {tagsError && <span className="text-red-600">Failed to load tags.</span>}
              </div>
            </div>
          </div>

          {/* Footer controls */}
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <button
              className="text-sm rounded-lg border px-3 py-1.5 hover:bg-gray-100 text-black"
              onClick={() => {
                setQ("");
                setCategoryId("");
                setSelectedTags([]);
                setPageSize(12);
              }}
            >
              Clear all
            </button>
            <div className="ml-auto flex items-center gap-2">
              <span className="text-xs text-gray-900">Page size</span>
              <select
                className="text-sm rounded-lg border border-gray-300 bg-white px-2 py-1 text-black"
                value={pageSize}
                onChange={(e) => setPageSize(Number(e.target.value))}
              >
                <option value={6}>6</option>
                <option value={12}>12</option>
                <option value={24}>24</option>
                <option value={48}>48</option>
              </select>
            </div>
          </div>
        </section>

        {/* Results header + pagination */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:justify-between">
          <div className="text-sm text-gray-900">
            {productsLoading ? "Loading…" : `${total} result(s)`}
            {productsError && <span className="text-red-600 ml-2">Failed to load products.</span>}
          </div>

          <div className="flex items-center gap-2">
            <button
              className="border rounded-lg px-3 py-1.5 text-sm bg-white hover:bg-gray-50 disabled:opacity-50 text-black"
              disabled={productsLoading || currentPage <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              ← Prev
            </button>
            <span className="text-sm text-gray-900">
              Page <span className="font-medium">{currentPage}</span> of{" "}
              <span className="font-medium">{totalPages}</span>
            </span>
            <button
              className="border rounded-lg px-3 py-1.5 text-sm bg-white hover:bg-gray-50 disabled:opacity-50 text-black"
              disabled={productsLoading || currentPage >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              Next →
            </button>
          </div>
        </div>

        {/* Results grid */}
        <section>
          {productsLoading ? (
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <li key={i} className="bg-white border rounded-2xl shadow-sm p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="h-4 w-2/3 bg-gray-200 rounded mb-2" />
                      <div className="h-3 w-24 bg-gray-100 rounded" />
                    </div>
                    <div className="shrink-0 h-6 w-16 bg-gray-100 rounded" />
                  </div>
                  <div className="mt-3 space-y-2">
                    <div className="h-3 w-full bg-gray-100 rounded" />
                    <div className="h-3 w-5/6 bg-gray-100 rounded" />
                  </div>
                  <div className="mt-3 flex gap-2">
                    <div className="h-5 w-16 bg-gray-100 rounded-full" />
                    <div className="h-5 w-14 bg-gray-100 rounded-full" />
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <>
              <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {prodData?.results.map((p) => (
                  <li
                    key={p.id}
                    className="bg-white border rounded-2xl shadow-sm p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h2 className="text-base sm:text-lg font-semibold leading-tight text-black">
                          {p.name}
                        </h2>
                        <div className="text-xs text-gray-900 mt-0.5">
                          {p.category ? p.category.name : "Uncategorized"}
                        </div>
                      </div>
                      <div className="shrink-0 rounded-lg bg-gray-100 px-2.5 py-1 text-sm font-mono text-black">
                        ${p.price}
                      </div>
                    </div>

                    <p className="mt-2 text-sm text-gray-900">{p.description}</p>

                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {p.tags.length ? (
                        p.tags.map((t) => (
                          <span
                            key={t.id}
                            className="rounded-full bg-gray-100 text-gray-900 px-2 py-0.5 text-xs"
                          >
                            {t.name}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-gray-900">No tags</span>
                      )}
                    </div>
                  </li>
                ))}
              </ul>

              {!productsLoading && (prodData?.results.length ?? 0) === 0 && (
                <div className="mt-8 text-center text-sm text-gray-900">
                  No products match your filters.
                </div>
              )}
            </>
          )}
        </section>
      </main>
    </div>
  );
}
