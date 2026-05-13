"use client";

import { Search as SearchIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { Badge } from "~/components/ui/badge";
import { Input } from "~/components/ui/input";
import { api } from "~/trpc/react";

const MIN_SEARCH_LENGTH = 2;

const typeLabel = {
  stock: "Stock",
  scrap: "Scrap",
  pallet: "Pallet",
} as const;

export function Search() {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setDebouncedQuery(query.trim());
    }, 250);

    return () => window.clearTimeout(timeout);
  }, [query]);

  const shouldSearch = debouncedQuery.length >= MIN_SEARCH_LENGTH;
  const results = api.all.search.useQuery(
    { query: debouncedQuery },
    {
      enabled: shouldSearch,
      staleTime: 60_000,
    },
  );

  const showResults = isOpen && query.trim().length >= MIN_SEARCH_LENGTH;

  return (
    <div className="relative w-full md:w-[320px]">
      <form
        role="search"
        onSubmit={(event) => {
          event.preventDefault();
        }}
      >
        <SearchIcon className="pointer-events-none absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          aria-label="Search inventory"
          autoComplete="off"
          className="w-full rounded-lg bg-background pl-8"
          maxLength={100}
          onChange={(event) => {
            setQuery(event.currentTarget.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={(event) => {
            if (event.key === "Escape") setIsOpen(false);
          }}
          placeholder="Search stock, scrap, pallets..."
          spellCheck={false}
          type="search"
          value={query}
        />
      </form>

      {showResults ? (
        <div className="absolute right-0 top-12 z-50 w-full overflow-hidden rounded-md border bg-card text-card-foreground shadow-md">
          {results.isLoading ? (
            <p className="px-3 py-2 text-sm text-muted-foreground">
              Searching...
            </p>
          ) : null}

          {results.isError ? (
            <p className="px-3 py-2 text-sm text-destructive">
              Search is unavailable.
            </p>
          ) : null}

          {results.data?.length === 0 ? (
            <p className="px-3 py-2 text-sm text-muted-foreground">
              No inventory matches found.
            </p>
          ) : null}

          {results.data?.map((result) => (
            <Link
              className="block border-b px-3 py-2 text-sm transition-colors last:border-b-0 hover:bg-muted"
              href={result.href}
              key={`${result.type}-${result.id}`}
              onClick={() => setIsOpen(false)}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-medium leading-none">{result.label}</p>
                  {result.description ? (
                    <p className="mt-1 text-xs text-muted-foreground">
                      {result.description}
                    </p>
                  ) : null}
                </div>
                <Badge variant="outline">{typeLabel[result.type]}</Badge>
              </div>
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  );
}
