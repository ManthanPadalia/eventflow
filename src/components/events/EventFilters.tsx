"use client";

import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { type CategoryWithEventCount } from "@/lib/data/categories";

type EventFiltersProps = {
  categories: CategoryWithEventCount[];
  initialSearch: string;
  initialCategory: string;
};

export function EventFilters({
  categories,
  initialSearch,
  initialCategory
}: EventFiltersProps) {
  const router = useRouter();
  const [search, setSearch] = useState(initialSearch);
  const [category, setCategory] = useState(initialCategory);
  const [isPending, startTransition] = useTransition();

  function applyFilters(nextCategory = category, nextSearch = search) {
    const params = new URLSearchParams();
    const trimmedSearch = nextSearch.trim();

    if (trimmedSearch) {
      params.set("search", trimmedSearch);
    }

    if (nextCategory) {
      params.set("category", nextCategory);
    }

    const query = params.toString();
    startTransition(() => {
      router.push(query ? `/?${query}` : "/");
    });
  }

  function resetFilters() {
    setSearch("");
    setCategory("");
    startTransition(() => {
      router.push("/");
    });
  }

  return (
    <form
      className="grid gap-3 border-y border-border py-5 md:grid-cols-[1fr_16rem_auto]"
      onSubmit={(event) => {
        event.preventDefault();
        applyFilters();
      }}
    >
      <label className="relative block">
        <span className="sr-only">Search events</span>
        <Search
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search by title, description, or location"
          className="h-11 w-full rounded-md border border-input bg-card pl-10 pr-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-accent focus:ring-2 focus:ring-ring"
        />
      </label>
      <label className="block">
        <span className="sr-only">Filter by category</span>
        <select
          value={category}
          onChange={(event) => {
            const nextCategory = event.target.value;
            setCategory(nextCategory);
            applyFilters(nextCategory);
          }}
          className="h-11 w-full rounded-md border border-input bg-card px-3 text-sm text-foreground outline-none transition-colors focus:border-accent focus:ring-2 focus:ring-ring"
        >
          <option value="">All categories</option>
          {categories.map((item) => (
            <option key={item.id} value={item.slug}>
              {item.name}
            </option>
          ))}
        </select>
      </label>
      <div className="flex flex-col gap-3 sm:flex-row md:justify-end">
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex h-11 items-center justify-center rounded-md border border-accent bg-accent px-5 text-sm font-medium text-accent-foreground transition-colors hover:border-foreground disabled:cursor-not-allowed disabled:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          Search
        </button>
        <button
          type="button"
          onClick={resetFilters}
          className="inline-flex h-11 items-center justify-center rounded-md border border-border bg-background px-4 text-sm font-medium text-foreground transition-colors hover:border-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          Reset
        </button>
      </div>
    </form>
  );
}
