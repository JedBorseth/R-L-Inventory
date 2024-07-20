/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Highlight } from "react-instantsearch";
import Image from "next/image";

export const Hit = ({ hit }: any) => {
  return (
    <article className="flex w-full flex-wrap gap-2">
      {/* <Image src={hit.poster_path} width={50} height={28} alt="Movie Poster" /> */}
      <div className="hit-title flex-1">
        <Highlight attribute="title" hit={hit} />
      </div>
      <div className="">{`${String(hit.overview).slice(0, 30)}...`}</div>
      <div className="hit-release_date">
        {/* <Highlight attribute="release_date" hit={hit} /> */}
      </div>
    </article>
  );
};
