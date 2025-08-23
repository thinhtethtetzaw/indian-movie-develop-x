import { useGetSearch } from "@/apis/app/queryGetSearch";
import { useGetSearchSuggestion } from "@/apis/app/queryGetSearchSuggestion";
import ArrowUpLeftIcon from "@/assets/svgs/icon-arrow-up-left.svg?react";
import TrashIcon from "@/assets/svgs/icon-trash.svg?react";
import SearchHeader from "@/components/common/layouts/SearchHeader";
import Loading from "@/components/common/Loading";
import VideoCard from "@/components/common/VideoCard";
import { Button } from "@/components/ui/button";
import type {
  SearchResultResponse,
  SearchSuggestionResponse,
  VideoResponse,
} from "@/types/api-schema/response";
import { createFileRoute } from "@tanstack/react-router";
import { t } from "i18next";
import { AnimatePresence, motion } from "motion/react";
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

  // Move the hook call before any conditional returns
  const { suggestions, isLoading: isLoadingSuggestions } =
    useGetSearchSuggestion({
      q: searchTerm,
    });

  const handleRecentItemClick = (item: string) => {
    console.log("Searching for:", item);
  };

  const handleClearRecent = () => {
    // Use a timeout to allow exit animations to play
    setTimeout(() => {
      setRecentlySearched([]);
    }, 300); // Match the exit animation duration
  };

  const handleSuggestionClick = (suggestion: SearchSuggestionResponse) => {
    setSearchTerm(suggestion.text || "");
    setIsSearched(true);
  };
  // Search query for when user clicks on a suggestion
  const { data: searchResults, isLoading: isLoadingSearch } = useGetSearch({
    q: searchTerm,
    enabled: isSearched && !!searchTerm,
  });

  console.log("searchResult", searchResults?.data);

  return (
    <div>
      <SearchHeader isShowBack={true} autoFocus={true} />

      {/* Recent Search */}
      <AnimatePresence mode="popLayout">
        {!searchTerm && recentlySearched.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{
              opacity: 0,
              transition: { duration: 0.3, delay: 0.5 },
            }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <div>
              <div className="flex flex-col gap-y-4">
                <div className="flex items-center justify-between px-4">
                  <p className="text-base font-semibold text-white">
                    {t("pages.search.recent")}
                  </p>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleClearRecent}
                  >
                    <TrashIcon />
                  </Button>
                </div>

                <div className="scrollbar-hide flex gap-2 overflow-x-auto pb-2 pl-4 last:pr-4">
                  {recentlySearched.map((item, index) => (
                    <motion.div
                      initial={{ opacity: 0, rotateX: -5 }}
                      animate={{ opacity: 1 }}
                      transition={{
                        duration: 0.3,
                        delay: Number(index) * 0.07,
                      }}
                      exit={{
                        opacity: 0,
                        y: -10,
                        rotateX: -5,
                        transition: {
                          duration: 0.3,
                          delay: (recentlySearched.length - 1 - index) * 0.07,
                        },
                      }}
                      layout
                      key={item}
                      className="flex-shrink-0 rounded-md bg-white/10 px-4 py-2.5 text-sm font-medium whitespace-nowrap text-gray-300 transition-colors hover:bg-white/20"
                      onClick={() => handleRecentItemClick(item)}
                    >
                      {item}
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
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
      </AnimatePresence>

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
                    key={suggestion.id || suggestion.id || index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="group flex cursor-pointer items-center justify-between border-b border-[#222222] py-4 transition-colors last:border-b-0"
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
                    <ArrowUpLeftIcon className="h-4 w-4 text-white/60 transition-transform duration-300 ease-in-out group-hover:-translate-x-0.5 group-hover:-translate-y-0.5" />
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

      {isSearched && searchTerm && (searchResults as any)?.data?.length > 0 && (
        <section className="space-y-4 px-4">
          <h2 className="text-forground font-semibold">Search results</h2>
          <div className="scrollbar-hide grid grid-cols-3 gap-x-3 gap-y-6">
            {(searchResults as SearchResultResponse)?.data?.map(
              (movie: VideoResponse, index) => (
                <div key={movie.vod_id} className="flex-shrink-0">
                  <VideoCard
                    video={movie}
                    // onClick={handleMovieClick}
                    index={index}
                  />
                </div>
              ),
            )}
          </div>
        </section>
      )}
    </div>
  );
}
