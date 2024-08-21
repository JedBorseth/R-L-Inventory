"use client";

import algoliasearch from "algoliasearch/lite";
import { Hits, SearchBox, Configure } from "react-instantsearch";
import { InstantSearchNext } from "react-instantsearch-nextjs";
import { Hit } from "./hit";
import { Input } from "./ui/input";
import { useState } from "react";
import { PlaceholdersAndVanishInput } from "./inputAnimation";

const searchClient = algoliasearch(
  "KH60NZV6Q6",
  "2c44fcbda3712ff9731a7d9037c95f32",
);
const placeholders = ["Crown 32C", "48x96", "Block Pallet"];

const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  console.log(e.target.value);
};
const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  console.log("submitted");
};

export function Search() {
  const [query, setQuery] = useState("");
  return (
    <InstantSearchNext
      indexName="your_index_name"
      searchClient={searchClient}
      future={{ preserveSharedStateOnUnmount: true }}
    >
      {/* <Input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for products"
      /> */}
      {/* <PlaceholdersAndVanishInput
        placeholders={placeholders}
        onChange={handleChange}
        onSubmit={onSubmit}
      /> */}
      <Input
        type="search"
        placeholder="Search..."
        className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[320px]"
      />

      <Configure hitsPerPage={3} query={query} />
      {query && (
        <div className="absolute left-0 top-10 border">
          <Hits hitComponent={Hit} />
        </div>
      )}
    </InstantSearchNext>
  );
}
