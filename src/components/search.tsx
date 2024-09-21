"use client";
import algoliasearch from "algoliasearch/lite";
import {
  Hits,
  Configure,
  useInstantSearch,
  useSearchBox,
  UseSearchBoxProps,
} from "react-instantsearch";
import { InstantSearchNext } from "react-instantsearch-nextjs";

import { Hit } from "./hit";
import { Input } from "./ui/input";
import { PlaceholdersAndVanishInput } from "./inputAnimation";
import React, { useState, useRef } from "react";
import { Card, CardContent } from "./ui/card";
import { Table, TableBody } from "./ui/table";
const searchClient = algoliasearch(
  "KH60NZV6Q6",
  "2c44fcbda3712ff9731a7d9037c95f32",
);

function SearchBox(props: UseSearchBoxProps) {
  const { query, refine } = useSearchBox(props);
  const { status } = useInstantSearch();
  const [inputValue, setInputValue] = useState(query);
  const inputRef = useRef<HTMLInputElement>(null);

  const isSearchStalled = status === "stalled";

  function setQuery(newQuery: string) {
    setInputValue(newQuery);

    refine(newQuery);
  }

  return (
    <div>
      <form
        action=""
        role="search"
        noValidate
        onSubmit={(event) => {
          event.preventDefault();
          event.stopPropagation();

          if (inputRef.current) {
            inputRef.current.blur();
          }
        }}
        onReset={(event) => {
          event.preventDefault();
          event.stopPropagation();

          setQuery("");
          // this is causing several errors in console when navigating from login page

          if (inputRef.current) {
            inputRef.current.focus();
          }
        }}
      >
        <Input
          ref={inputRef}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          placeholder="Search..."
          className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[320px]"
          spellCheck={false}
          maxLength={512}
          type="search"
          value={inputValue}
          onChange={(event) => {
            setQuery(event.currentTarget.value);
          }}
        />
        <span hidden={!isSearchStalled}>Searching…</span>
      </form>
    </div>
  );
}
function EmptyQueryBoundary({
  children,
  fallback,
}: {
  children: React.ReactNode;
  fallback: React.ReactNode;
}) {
  const { indexUiState } = useInstantSearch();

  if (!indexUiState.query) {
    return (
      <>
        {fallback}
        <div hidden>{children}</div>
      </>
    );
  }

  return children;
}

export function Search() {
  return (
    <InstantSearchNext
      indexName="rlinventory"
      searchClient={searchClient}
      future={{ preserveSharedStateOnUnmount: true }}
      insights={true}
    >
      <div className="relative">
        <SearchBox />
        <div className="absolute w-full border bg-card">
          <EmptyQueryBoundary fallback={null}>
            <Hits hitComponent={Hit} />
          </EmptyQueryBoundary>
        </div>
      </div>

      <Configure
        hitsPerPage={3}
        attributesToHighlight={["width", "length"]}
        attributesToSnippet={["description"]}
      />
    </InstantSearchNext>
  );
}
