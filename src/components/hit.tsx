/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Highlight, Snippet } from "react-instantsearch";
import Image from "next/image";
import Link from "next/link";

type HitProps = {
  hit: any;
};
export const Hit = ({ hit }: HitProps) => {
  return (
    <Link
      className="flex w-full gap-2"
      href={`/dashboard/${String(hit.id).replace("_", "/")}`}
    >
      <div className="flex-1">
        <Highlight attribute="width" hit={hit} />
        x
        <Highlight attribute="length" hit={hit} />
        <div className="flex gap-2">
          <Highlight attribute="strength" hit={hit} />
          <Highlight attribute="flute" hit={hit} />
        </div>
        <Snippet attribute="notes" hit={hit} />
      </div>
      <div>| {hit.id}</div>
    </Link>
  );
};
