"use client";

import algoliasearch from "algoliasearch/lite";
import { Hits, SearchBox, Configure } from "react-instantsearch";
import { InstantSearchNext } from "react-instantsearch-nextjs";
import { Hit } from "./hit";
import { Input } from "./ui/input";
import { useState } from "react";

const searchClient = algoliasearch(
  "KH60NZV6Q6",
  "2c44fcbda3712ff9731a7d9037c95f32",
);

export function Search() {
  const [query, setQuery] = useState("");
  return (
    <InstantSearchNext
      indexName="your_index_name"
      searchClient={searchClient}
      future={{ preserveSharedStateOnUnmount: true }}
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <Input
          type="search"
          placeholder="Search..."
          className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[320px]"
        />
      </form>
      <Configure hitsPerPage={3} query={query} />
      {query && (
        <div className="absolute left-0 top-10 border">
          <Hits hitComponent={Hit} />
        </div>
      )}
    </InstantSearchNext>
  );
}
