import { useGetSearchSuggestion } from "@/apis/app/queryGetSearchSuggestion";
import ArrowUpLeftIcon from "@/assets/svgs/icon-arrow-up-left.svg?react";
import TrashIcon from "@/assets/svgs/icon-trash.svg?react";
import SearchHeader from "@/components/common/layouts/SearchHeader";
import Loading from "@/components/common/Loading";
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
  const [searchTerm] = useQueryState("q", parseAsString.withDefault(""));

  const handleRecentItemClick = (item: string) => {
    console.log("Searching for:", item);
  };

  const handleClearRecent = () => {
    setRecentlySearched([]);
  };

  const handleSuggestionClick = (suggestion: any) => {
    console.log("Selected suggestion:", suggestion);
    // Navigate to movie detail or search results
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

  return (
    <div>
      <SearchHeader isShowBack={true} autoFocus={true} />

      {/* Search Suggestions */}
      {searchTerm &&
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
                  suggestion.text || suggestion.suggestion || "",
                  searchTerm,
                );
                return (
                  <motion.div
                    key={suggestion.id || suggestion.vod_id || index}
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
      </motion.div>
    </div>
  );
}
