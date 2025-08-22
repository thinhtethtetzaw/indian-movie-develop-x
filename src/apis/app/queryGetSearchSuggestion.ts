import i18n from "@/config/i18n";
import { LANGUAGES_API_HEADER } from "@/constants/common";
import { API_CLIENT } from "@/lib/openapi-api-client";
import { queryOptions, useQuery } from "@tanstack/react-query";
import type { QueryConfig } from "..";

// Query options for fetching search suggestions
export const getSearchSuggestionQueryOptions = (q: string) => {
  const selectedLanguage = i18n.language;

  return queryOptions({
    queryKey: ["search-suggestion", q],
    queryFn: () =>
      API_CLIENT.GET("/api/v1/videos/search/suggestions", {
        params: {
          query: { q },
          header: {
            "Accept-Language":
              LANGUAGES_API_HEADER[
                selectedLanguage as keyof typeof LANGUAGES_API_HEADER
              ],
          },
        },
      }),
    enabled: !!q && q.length >= 2, // Only enable for queries with 2+ characters to avoid redirects
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
    retry: 1, // Only retry once
  });
};

type UseGetSearchSuggestionOptions = {
  q: string;
  queryConfig?: QueryConfig<typeof getSearchSuggestionQueryOptions>;
};

// Hook for fetching search suggestions
export const useGetSearchSuggestion = ({
  q,
  queryConfig,
}: UseGetSearchSuggestionOptions) => {
  const data = useQuery({
    ...getSearchSuggestionQueryOptions(q),
    ...queryConfig,
  });

  const suggestions = data.data?.data?.data;

  return { ...data, suggestions };
};
