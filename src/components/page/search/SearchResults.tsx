import { useGetAllTypes } from "@/apis/app/queryGetAllTypes";
import SearchEmptyImage from "@/assets/svgs/no-result.svg?react";
import { EmptyState } from "@/components/common/EmptyState";
import { Tag, TagSkeleton } from "@/components/common/Tag";
import VideoCard, { VideoCardSkeleton } from "@/components/common/VideoCard";
import { cn } from "@/lib/utils";
import { SEARCH_PER_PAGE } from "@/routes/search";
import type {
  SearchResultResponse,
  VideoResponse,
} from "@/types/api-schema/response";
import { useNavigate } from "@tanstack/react-router";
import { parseAsString, useQueryState, useQueryStates } from "nuqs";
import { useCallback } from "react";
import { Filter } from "./Filter";

interface SearchResultsProps {
  isHomePage?: boolean;
  searchResults: SearchResultResponse["data"] | undefined;
  currentPage: number;
  isFetchingNextPage: boolean;
}

export function SearchResults({
  isHomePage = false,
  searchResults,
  currentPage,
  isFetchingNextPage,
}: SearchResultsProps) {
  const navigate = useNavigate();

  const [searchState, setSearchState] = useQueryStates({
    type: parseAsString.withDefault("0"),
  });
  const [searchTerm] = useQueryState("q", parseAsString.withDefault(""));

  const renderTagSkeletons = useCallback(
    () =>
      Array.from({ length: 4 }).map((_, index) => (
        <TagSkeleton
          key={`tag-skeleton-${index}`}
          index={index}
          className={cn("", {
            "ml-4": index === 0,
            "mr-4": index === 3,
          })}
        />
      )),
    [],
  );
  const { allTypes, isLoading: isCategoryListLoading } = useGetAllTypes({});

  // Don't render anything if there's no search term
  if (!searchTerm && !isHomePage) return null;

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
    <>
      <section className="space-y-5">
        {!isHomePage && (
          <>
            <div className="scrollbar-hide mt-2 flex items-center gap-x-1.5 overflow-auto">
              {isCategoryListLoading
                ? renderTagSkeletons()
                : allTypes?.map((category, index) => (
                    <Tag
                      key={category.type_id}
                      index={category.type_id}
                      size="lg"
                      className={cn("cursor-pointer", {
                        "ml-4": index === 0,
                        "mr-4": index === allTypes.length - 1,
                      })}
                      variant={
                        searchState.type === category.type_id?.toString()
                          ? "active"
                          : "default"
                      }
                      onClick={() =>
                        setSearchState({
                          type: category.type_id?.toString() ?? "0",
                        })
                      }
                    >
                      {category.type_name}
                    </Tag>
                  ))}
            </div>
            <div className="px-4">
              <Filter />
            </div>
            <h2 className="text-forground px-4 font-semibold">
              Search results
            </h2>
          </>
        )}
        {/* Show results if available, otherwise show empty state */}
        {searchResults && searchResults.length > 0 ? (
          <div className="scrollbar-hide grid grid-cols-2 gap-x-3 gap-y-6 px-4 sm:grid-cols-3">
            {searchResults.map((video: VideoResponse, index) => (
              <div key={`${video.vod_id}-${index}`} className="flex-shrink-0">
                <VideoCard
                  video={video}
                  onClick={handleVideoClick}
                  index={
                    currentPage && currentPage > 1
                      ? index - (currentPage - 1) * SEARCH_PER_PAGE
                      : index
                  }
                  className="w-full"
                />
              </div>
            ))}
            {isFetchingNextPage &&
              Array.from({ length: 3 }).map((_, index) => (
                <VideoCardSkeleton key={index} index={index} />
              ))}
          </div>
        ) : (
          <div className="m-auto h-[calc(100dvh-var(--search-header-height)-200px)]">
            <EmptyState
              imageSrc={<SearchEmptyImage />}
              title="Search Result Not Found!"
            />
          </div>
        )}
      </section>
    </>
  );
}
