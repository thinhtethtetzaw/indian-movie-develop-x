import VideoCard from "@/components/common/VideoCard";
import type {
  SearchResultResponse,
  VideoResponse,
} from "@/types/api-schema/response";
import { Filter } from "./Filter";

interface SearchResultsProps {
  searchResults: SearchResultResponse | undefined;
}

export function SearchResults({ searchResults }: SearchResultsProps) {
  if (!searchResults?.data || searchResults.data.length === 0) return null;

  return (
    <section className="space-y-5 px-4">
      <Filter />

      <h2 className="text-forground font-semibold">Search results</h2>
      <div className="scrollbar-hide grid grid-cols-3 gap-x-3 gap-y-6">
        {searchResults.data.map((movie: VideoResponse, index) => (
          <div key={movie.vod_id} className="flex-shrink-0">
            <VideoCard
              video={movie}
              // onClick={handleMovieClick}
              index={index}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
