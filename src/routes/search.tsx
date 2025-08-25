import { useGetSearch } from "@/apis/app/queryGetSearch";
import { useGetSearchSuggestion } from "@/apis/app/queryGetSearchSuggestion";
import SearchEmptyImage from "@/assets/svgs/no-result.svg?react";
import { EmptyState } from "@/components/common/EmptyState";
import SearchHeader from "@/components/common/layouts/SearchHeader";
import Loading from "@/components/common/Loading";
import {
  RecentSearch,
  SearchResults,
  SearchSuggestions,
} from "@/components/page/search";
import type {
  SearchResultResponse,
  SearchSuggestionResponse,
} from "@/types/api-schema/response";
import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence } from "motion/react";
import { parseAsString, useQueryState, useQueryStates } from "nuqs";
import { useEffect, useState } from "react";

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
  const [searchTerm, setSearchTerm] = useQueryState(
    "q",
    parseAsString.withDefault(""),
  );
  // const [sortOrder] = useQueryState("sort", parseAsString.withDefault("asc"));
  // const [year] = useQueryState("year", parseAsString.withDefault(""));
  const [filters] = useQueryStates({
    sort_order: parseAsString.withDefault("asc"),
    year: parseAsString.withDefault(""),
    class: parseAsString.withDefault(""),
    type: parseAsString.withDefault("0"),
  });

  const [submittedSearchTerm, setSubmittedSearchTerm] = useState("");

  const shouldShowSearchResults =
    submittedSearchTerm && searchTerm === submittedSearchTerm;

  useEffect(() => {
    if (searchTerm !== submittedSearchTerm) {
      setSubmittedSearchTerm("");
    }
  }, [searchTerm, submittedSearchTerm]);

  const { suggestions, isLoading: isLoadingSuggestions } =
    useGetSearchSuggestion({
      q: searchTerm,
    });

  const handleRecentItemClick = (item: string) => {
    setSearchTerm(item);
    setSubmittedSearchTerm(item);
  };

  const handleClearRecent = () => {
    setTimeout(() => {
      setRecentlySearched([]);
    }, 300);
  };

  const handleSuggestionClick = (suggestion: SearchSuggestionResponse) => {
    const suggestionText = suggestion.text || "";
    setSearchTerm(suggestionText);
    setSubmittedSearchTerm(suggestionText);
  };

  const handleSearchSubmit = (term: string) => {
    if (term.trim()) {
      setSubmittedSearchTerm(term.trim());
    }
  };

  const { data: searchResults, isLoading: isLoadingSearch } = useGetSearch({
    params: {
      q: submittedSearchTerm,
      year: filters.year,
      sort_order: filters.sort_order,
      class: filters.class,
    },
    type_id: filters.type ? parseInt(filters.type) : undefined,
    enabled: !!submittedSearchTerm,
  });

  const shouldShowLoading =
    isLoadingSearch ||
    (isLoadingSuggestions && searchTerm && searchTerm.length >= 2);

  const shouldShowEmptyState =
    !isLoadingSearch &&
    !isLoadingSuggestions &&
    searchTerm &&
    searchTerm.length >= 2 &&
    ((shouldShowSearchResults &&
      (searchResults as SearchResultResponse)?.data?.length === 0) ||
      (!shouldShowSearchResults && suggestions && suggestions.length === 0));

  return (
    <div className="pb-10">
      <SearchHeader
        isShowBack={true}
        autoFocus={true}
        onSubmit={handleSearchSubmit}
      />

      <AnimatePresence mode="popLayout">
        {/* Recent Search */}
        {!searchTerm && (
          <RecentSearch
            key="recent-search"
            recentlySearched={recentlySearched}
            onItemClick={handleRecentItemClick}
            onClearRecent={handleClearRecent}
          />
        )}

        {/* Search Suggestions */}
        {!shouldShowSearchResults &&
          searchTerm &&
          searchTerm.length >= 2 &&
          suggestions &&
          suggestions.length > 0 && (
            <SearchSuggestions
              key="search-suggestions"
              suggestions={suggestions}
              searchTerm={searchTerm}
              onSuggestionClick={handleSuggestionClick}
            />
          )}

        {/* Search Results */}
        {shouldShowSearchResults && (
          <SearchResults
            key="search-results"
            searchResults={searchResults as SearchResultResponse}
          />
        )}

        {/* Shared Loading State */}
        {shouldShowLoading && (
          <div
            key="loading"
            className="m-auto h-[calc(100vh-var(--search-header-height)-40px)]"
          >
            <Loading />
          </div>
        )}

        {/* Shared Empty State */}
        {shouldShowEmptyState && (
          <div
            key="empty-state"
            className="m-auto h-[calc(100vh-var(--search-header-height)-40px)]"
          >
            <EmptyState
              imageSrc={<SearchEmptyImage />}
              title="Search Result Not Found!"
            />
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
