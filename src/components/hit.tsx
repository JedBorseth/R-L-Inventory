/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Highlight } from "react-instantsearch";
import Image from "next/image";
import { Hits } from "react-instantsearch";

export const Hit = ({ hit }: any) => {
  return (
    <article className="flex gap-5">
      <Image src={hit.poster_path} width={50} height={28} alt="Movie Poster" />
      <div className="hit-title">
        <Highlight attribute="title" hit={hit} />
      </div>
      <div className="hit-overview">
        {/* <Highlight attribute="overview" hit={hit} /> */}
      </div>
      <div className="hit-release_date">
        {/* <Highlight attribute="release_date" hit={hit} /> */}
      </div>
    </article>
  );
};
