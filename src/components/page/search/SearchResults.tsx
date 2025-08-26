import VideoCard, { VideoCardSkeleton } from "@/components/common/VideoCard";
import type {
  SearchResultResponse,
  VideoResponse,
} from "@/types/api-schema/response";
import { useNavigate } from "@tanstack/react-router";
import { Filter } from "./Filter";

interface SearchResultsProps {
  searchResults: SearchResultResponse["data"] | undefined;
  isFetchingNextPage: boolean;
}

export function SearchResults({
  searchResults,
  isFetchingNextPage,
}: SearchResultsProps) {
  const navigate = useNavigate();

  if (!searchResults || searchResults.length === 0) return null;

  // Event handlers
  const handleVideoClick = (video: VideoResponse) => {
    navigate({
      to: "/videos/$videoId",
      params: {
        videoId: video.vod_id ?? "",
      },
    });
  };

  return (
    <section className="space-y-5 px-4">
      <Filter />

      <h2 className="text-forground font-semibold">Search results</h2>
      <div className="scrollbar-hide grid grid-cols-3 gap-x-3 gap-y-6">
        {searchResults.map((video: VideoResponse, index) => (
          <div key={`${video.vod_id}-${index}`} className="flex-shrink-0">
            <VideoCard video={video} onClick={handleVideoClick} index={index} />
          </div>
        ))}
        {isFetchingNextPage &&
          Array.from({ length: 3 }).map((_, index) => (
            <VideoCardSkeleton key={index} index={index} />
          ))}
      </div>
    </section>
  );
}
