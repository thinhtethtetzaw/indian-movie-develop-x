import { useGetAllTypes } from "@/apis/app/queryGetAllTypes";
import Loading from "@/components/common/Loading";
import { Tag, TagSkeleton } from "@/components/common/Tag";
import VideoCard from "@/components/common/VideoCard";
import { cn } from "@/lib/utils";
import type {
  SearchResultResponse,
  VideoResponse,
} from "@/types/api-schema/response";
import { parseAsString, useQueryState, useQueryStates } from "nuqs";
import { useCallback } from "react";
import { Filter } from "./Filter";

interface SearchResultsProps {
  searchResults: SearchResultResponse | undefined;
  isFetchingNextPage?: boolean;
  viewportRef?: React.RefObject<HTMLDivElement | null>;
  scrollRooms?: () => void;
}

export function SearchResults({
  searchResults,
  isFetchingNextPage,
  viewportRef,
  scrollRooms,
}: SearchResultsProps) {
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

  if (!searchResults?.data || searchResults.data.length === 0) return null;

  return (
    <>
      {searchTerm && (
        <section className="space-y-5">
          <div
            className="scrollbar-hide mt-2 flex items-center gap-x-1.5 overflow-auto"
            onScroll={scrollRooms}
          >
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

          <h2 className="text-forground px-4 font-semibold">Search results</h2>
          <div className="scrollbar-hide grid grid-cols-3 gap-x-3 gap-y-6 px-4">
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
          {/* Loading indicator for next page */}
          {searchResults.data.length > 0 && (
            <div className="flex justify-center py-6">
              {isFetchingNextPage && (
                <div className="flex flex-col items-center gap-2">
                  <Loading />
                </div>
              )}
            </div>
          )}

          {/* Intersection observer sentinel */}
          <div ref={viewportRef} className="h-1 w-full" />
        </section>
      )}
    </>
  );
}
