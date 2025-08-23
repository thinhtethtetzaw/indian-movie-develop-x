import { useGetSearch } from "@/apis/app/queryGetSearch";
import { useGetSearchSuggestion } from "@/apis/app/queryGetSearchSuggestion";
import ArrowUpLeftIcon from "@/assets/svgs/icon-arrow-up-left.svg?react";
import TrashIcon from "@/assets/svgs/icon-trash.svg?react";
import SearchHeader from "@/components/common/layouts/SearchHeader";
import Loading from "@/components/common/Loading";
import MovieCard from "@/components/common/MovieCard";
import type {
  SearchResultResponse,
  SearchResultVideoResponse,
  SearchSuggestionResponse,
} from "@/types/api-schema/response";
import { createFileRoute } from "@tanstack/react-router";
import { t } from "i18next";
import { motion } from "motion/react";
import { parseAsString, useQueryState } from "nuqs";
import { useState } from "react";

export const Route = createFileRoute("/search")({
  component: RouteComponent,
  beforeLoad: () => {
    return {
      layoutConfig: {
        isShowBottomNavbar: false,
      },
    };
  },
});

// Helper function to highlight matching text
const highlightText = (text: string, searchTerm: string) => {
  if (!searchTerm) return { highlighted: text, remaining: "" };

  const lowerText = text.toLowerCase();
  const lowerSearchTerm = searchTerm.toLowerCase();
  const matchIndex = lowerText.indexOf(lowerSearchTerm);

  if (matchIndex === -1) return { highlighted: "", remaining: text };

  const highlighted = text.substring(
    matchIndex,
    matchIndex + searchTerm.length,
  );
  const remaining = text.substring(matchIndex + searchTerm.length);

  return { highlighted, remaining };
};

function RouteComponent() {
  const [isSearched, setIsSearched] = useState(false);
  const [recentlySearched, setRecentlySearched] = useState([
    "Havana",
    "Archon",
    "Novaria",
    "Angela",
    "The Dark Knight",
    "Inception",
    "Interstellar",
    "The Matrix",
  ]);
  const [searchTerm, setSearchTerm] = useQueryState(
    "q",
    parseAsString.withDefault(""),
  );

  const handleRecentItemClick = (item: string) => {
    console.log("Searching for:", item);
  };

  const handleClearRecent = () => {
    setRecentlySearched([]);
  };

  const handleSuggestionClick = (suggestion: SearchSuggestionResponse) => {
    setSearchTerm(suggestion.text || "");
    setIsSearched(true);
  };

  if (recentlySearched.length === 0) {
    return (
      <div>
        <SearchHeader isShowBack autoFocus={true} />
      </div>
    );
  }

  const { suggestions, isLoading: isLoadingSuggestions } =
    useGetSearchSuggestion({
      q: searchTerm,
    });

  console.log("suggestion");

  // Search query for when user clicks on a suggestion
  const { data: searchResults, isLoading: isLoadingSearch } = useGetSearch({
    q: searchTerm,
    enabled: isSearched && !!searchTerm,
  });

  console.log("searchResult", searchResults?.data);
  //   {
  //     "vod_id": "MS1xx411c782",
  //     "vod_name": "MyHomeHero",
  //     "vod_pic": "https://m.media-amazon.com/images/M/MV5BMDg2ZDQ4ZmYtNjRlZS00NGNkLWI3YzAtZjc2MDMxYzUzOTlmXkEyXkFqcGdeQXVyMTEzMTI1Mjk3._V1_QL75_UX380_CR0,0,380,562_.jpg",
  //     "vod_remarks": null,
  //     "vod_class": "Crime,Drama,Thriller,Movies",
  //     "vod_year": "2023",
  //     "vod_time": 1752743369,
  //     "vod_hits_week": 950,
  //     "vod_score": "9.0",
  //     "type_id": 1
  // }
  return (
    <div>
      <SearchHeader isShowBack={true} autoFocus={true} />

      {/* Recent Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        {!searchTerm && recentlySearched.length > 0 && (
          <div>
            <div className="flex flex-col gap-y-4">
              <div className="flex items-center justify-between px-4">
                <p className="text-base font-semibold text-white">
                  {t("pages.search.recent")}
                </p>

                <TrashIcon className="h-5 w-5" onClick={handleClearRecent} />
              </div>

              <div className="scrollbar-hide flex gap-2 overflow-x-auto pb-2 pl-4 last:pr-4">
                {recentlySearched.map((item, index) => (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{
                      duration: 0.3,
                      delay: Number(index) * 0.07,
                    }}
                    key={item}
                    className="flex-shrink-0 rounded-md bg-white/10 px-4 py-2.5 text-sm font-medium whitespace-nowrap text-gray-300 transition-colors hover:bg-white/20"
                    onClick={() => handleRecentItemClick(item)}
                  >
                    {item}
                  </motion.div>
                ))}
              </div>
            </div>
            {/* <section className="mt-5 space-y-4 px-4">
              <h2 className="text-forground font-semibold">
                {t("pages.search.popularSearches")}
              </h2>
              <div className="scrollbar-hide grid grid-cols-3 gap-x-3 gap-y-6">
                {MOCK_MOVIES.map((movie) => (
                  <div key={movie.id} className="flex-shrink-0">
                    <MovieCard
                      movie={movie}
                      onFavoriteToggle={() => console.log("favorite")}
                      onClick={() => {}}
                    />
                  </div>
                ))}
              </div>
              <Button
                variant="default"
                className="text-forground w-full bg-white/10 py-6 hover:bg-white/20"
              >
                {t("common.viewMore")}
                <ChevronDownIcon />
              </Button>
            </section> */}
          </div>
        )}

        {isLoadingSuggestions && searchTerm && searchTerm.length >= 2 && (
          <div className="m-auto h-[calc(100vh-var(--search-header-height))]">
            <Loading />
          </div>
        )}

        {/* Search Results */}
        {/* {isSearched && searchResults && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="px-4"
          >
            <div className="space-y-4">
              <h2 className="text-base font-medium text-white">
                Search Results
              </h2>
              {isLoadingSearch ? (
                <div className="flex justify-center py-8">
                  <Loading />
                </div>
              ) : (searchResults as any)?.data?.videos &&
                (searchResults as any).data.videos.length > 0 ? (
                <div className="space-y-4">
                  {(searchResults as any).data.videos.map(
                    (result: any, index: number) => (
                      <motion.div
                        key={result.id || index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className="flex cursor-pointer items-center justify-between border-b border-[#222222] py-4 transition-colors last:border-b-0 hover:bg-white/5"
                      >
                        <div className="flex-1">
                          <span className="text-sm font-semibold text-white">
                            {result.title || result.name || "Untitled"}
                          </span>
                        </div>
                        <ArrowUpLeftIcon className="h-4 w-4 text-white/60" />
                      </motion.div>
                    ),
                  )}
                </div>
              ) : (
                <div className="py-8 text-center text-white/60">
                  No results found for "{searchTerm}"
                </div>
              )}
            </div>
          </motion.div>
        )} */}
      </motion.div>

      {/* Search Suggestions */}
      {!isSearched &&
        searchTerm &&
        searchTerm.length >= 2 &&
        suggestions &&
        suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="px-4"
          >
            <div className="space-y-0">
              {suggestions.map((suggestion, index) => {
                console.log("suggestion", suggestion);
                const { highlighted, remaining } = highlightText(
                  suggestion.text || "",
                  searchTerm,
                );
                return (
                  <motion.div
                    key={suggestion.id || index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="flex cursor-pointer items-center justify-between border-b border-[#222222] py-4 transition-colors last:border-b-0 hover:bg-white/5"
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    <div className="flex-1">
                      <span className="text-brand-red text-sm font-semibold">
                        {highlighted}
                      </span>
                      <span className="text-sm font-semibold text-white">
                        {remaining}
                      </span>
                    </div>
                    <ArrowUpLeftIcon className="h-4 w-4 text-white/60" />
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

      {isSearched && searchTerm && (searchResults as any)?.data?.length > 0 && (
        <div className="scrollbar-hide grid grid-cols-3 gap-x-3 gap-y-6">
          {(searchResults as SearchResultResponse)?.data?.map(
            (movie: SearchResultVideoResponse, index) => (
              <div key={movie.vod_id} className="flex-shrink-0">
                <MovieCard
                  movie={movie}
                  // onClick={handleMovieClick}
                  index={index}
                />
              </div>
            ),
          )}
        </div>
      )}
    </div>
  );
}
