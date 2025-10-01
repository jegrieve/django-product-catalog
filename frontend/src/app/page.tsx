"use client";

import { useCategories } from "@/hooks";
import { useState } from "react";

export default function Home() {
  const [categoryId, setCategoryId] = useState<string>("");

  // fetch categories via our hook
  const { data, isLoading, error } = useCategories(true); // enabled=true

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top bar */}
      <header className="sticky top-0 z-10 border-b bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
          <h1 className="text-lg sm:text-xl font-semibold tracking-tight">Product Catalog</h1>
          <span className="text-xs sm:text-sm text-slate-500">0 result(s)</span>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6 space-y-6">
        {/* Filters */}
        <section className="bg-white border rounded-2xl shadow-sm p-4 sm:p-5">
          <div className="grid gap-3 md:grid-cols-3">
            {/* Search (static for now) */}
            <label className="block">
              <span className="block text-xs font-medium text-slate-600 mb-1">Search</span>
              <input
                className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm"
                placeholder="e.g. wireless, stainless, comfy"
                readOnly
              />
            </label>

            {/* Category (now driven by hook) */}
            <label className="block">
              <span className="block text-xs font-medium text-slate-600 mb-1">Category</span>
              <select
                className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                disabled={isLoading || !!error}
              >
                <option value="">All categories</option>
                {data?.results?.map((c) => (
                  <option key={c.id} value={String(c.id)}>
                    {c.name}
                  </option>
                ))}
              </select>
              {isLoading && (
                <div className="mt-1 text-xs text-slate-500">Loading categories…</div>
              )}
              {error && (
                <div className="mt-1 text-xs text-red-600">Failed to load categories.</div>
              )}
            </label>

            {/* Tags (placeholder for now) */}
            <div className="block">
              <span className="block text-xs font-medium text-slate-600 mb-1">Tags</span>
              <button
                type="button"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-left text-sm flex items-center justify-between"
                disabled
              >
                <span className="truncate">All tags</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-slate-500"
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
            </div>
          </div>

          {/* Footer controls (still placeholder) */}
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <button className="text-sm rounded-lg border px-3 py-1.5 hover:bg-slate-100" disabled>
              Clear all
            </button>
            <div className="ml-auto flex items-center gap-2">
              <span className="text-xs text-slate-500">Page size</span>
              <select
                className="text-sm rounded-lg border border-slate-300 bg-white px-2 py-1"
                defaultValue={12}
                disabled
              >
                <option>6</option>
                <option>12</option>
                <option>24</option>
                <option>48</option>
              </select>
            </div>
          </div>
        </section>

        {/* Results header (placeholder) */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:justify-between">
          <div className="text-sm text-slate-600">0 result(s)</div>
          <div className="flex items-center gap-2">
            <button className="border rounded-lg px-3 py-1.5 text-sm bg-white text-slate-400" disabled>
              ← Prev
            </button>
            <span className="text-sm text-slate-700">
              Page <span className="font-medium">1</span> of <span className="font-medium">1</span>
            </span>
            <button className="border rounded-lg px-3 py-1.5 text-sm bg-white text-slate-400" disabled>
              Next →
            </button>
          </div>
        </div>

        {/* Skeleton grid (still static) */}
        <section>
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <li key={i} className="bg-white border rounded-2xl shadow-sm p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="h-4 w-2/3 bg-slate-200 rounded mb-2" />
                    <div className="h-3 w-24 bg-slate-100 rounded" />
                  </div>
                  <div className="shrink-0 h-6 w-16 bg-slate-100 rounded" />
                </div>
                <div className="mt-3 space-y-2">
                  <div className="h-3 w-full bg-slate-100 rounded" />
                  <div className="h-3 w-5/6 bg-slate-100 rounded" />
                </div>
                <div className="mt-3 flex gap-2">
                  <div className="h-5 w-16 bg-slate-100 rounded-full" />
                  <div className="h-5 w-14 bg-slate-100 rounded-full" />
                </div>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
}
