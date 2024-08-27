/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Highlight } from "react-instantsearch";
import Image from "next/image";

type HitProps = {
  hit: any;
};
export const Hit = ({ hit }: HitProps) => {
  return (
    <article className="flex w-full gap-2">
      <div className="flex-1">
        <Highlight attribute="width" hit={hit} />
        x
        <Highlight attribute="length" hit={hit} />
      </div>
      <div>| Scrap</div>
    </article>
  );
};
