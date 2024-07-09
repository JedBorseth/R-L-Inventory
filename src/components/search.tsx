// TODO: Make a search component
"use client";

import algoliasearch from "algoliasearch";
import "instantsearch.css/themes/satellite.css";
import { Hits, InstantSearch, SearchBox, Configure } from "react-instantsearch";
import { Hit } from "~/components/hit";

const searchClient = algoliasearch(
  "KH60NZV6Q6",
  "2c44fcbda3712ff9731a7d9037c95f32",
);

export const Search = () => {
  return (
    <InstantSearch
      searchClient={searchClient}
      indexName="your_index_name"
      future={{ preserveSharedStateOnUnmount: true }}
      initialUiState={{ UiState: { query: "empty" } }}
    >
      <Configure hitsPerPage={2} />
      <div className="ais-InstantSearch">
        <SearchBox className="border-red-500 focus:active:border-red-500" />
      </div>
      <div className="absolute left-0 top-10 h-48 w-48 border">
        <Hits hitComponent={Hit} />
      </div>
    </InstantSearch>
  );
};
export default Search;

//   const data = await fetch(
//     "https://dashboard.algolia.com/sample_datasets/movie.json",
//   );

//   const records: unknown = await data.json();

//   const client = algoliasearch(
//     "KH60NZV6Q6",
//     "c93619cf68b636ae5b51487b751f2e81",
//   );

//   const index = client.initIndex("your_index_name");

//   await index.saveObjects(records, { autoGenerateObjectIDIfNotExist: true });

// ^^^^^^ THIS CODE ADDS STUFF TO THE SEARCHER
