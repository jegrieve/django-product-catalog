"use client";

import { useCategories, useTags } from "@/hooks";
import { useState } from "react";

export default function Home() {
  const [categoryId, setCategoryId] = useState<string>("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const { data: catData, isLoading: catsLoading, error: catsError } = useCategories(true);
  const { data: tagData, isLoading: tagsLoading, error: tagsError } = useTags(true);

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

            {/* Category (driven by hook) */}
            <label className="block">
              <span className="block text-xs font-medium text-slate-600 mb-1">Category</span>
              <select
                className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm"
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
              {catsLoading && (
                <div className="mt-1 text-xs text-slate-500">Loading categories…</div>
              )}
              {catsError && (
                <div className="mt-1 text-xs text-red-600">Failed to load categories.</div>
              )}
            </label>

            {/* Tags (now driven by hook; simple multi-select) */}
            <label className="block">
              <span className="block text-xs font-medium text-slate-600 mb-1">Tags</span>
              <select
                multiple
                className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm h-[120px]"
                value={selectedTags}
                onChange={(e) => {
                  const values = Array.from(e.target.selectedOptions).map((o) => o.value);
                  setSelectedTags(values);
                }}
                disabled={tagsLoading || !!tagsError}
              >
                {tagData?.results?.map((t) => (
                  <option key={t.id} value={String(t.id)}>
                    {t.name}
                  </option>
                ))}
              </select>
              <div className="mt-1 text-xs text-slate-500">
                {tagsLoading && "Loading tags…"}
                {tagsError && <span className="text-red-600">Failed to load tags.</span>}
                {!tagsLoading && !tagsError && selectedTags.length > 0 && (
                  <>Selected: {selectedTags.length}</>
                )}
              </div>
            </label>
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
