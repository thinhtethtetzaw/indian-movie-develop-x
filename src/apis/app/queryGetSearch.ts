import i18n from "@/config/i18n";
import { LANGUAGES_API_HEADER } from "@/constants/common";
import { API_CLIENT } from "@/lib/openapi-api-client";
import { queryOptions, useQuery } from "@tanstack/react-query";
import type { QueryConfig } from "..";

// Query options for fetching search results
export const getSearchQueryOptions = (
  params: {
    q: string;
    year?: string;
    class?: string;
    sort_by?: string;
    sort_order?: string;
  },
  page: number = 1,
  per_page: number = 10,
  type_id?: number,
) => {
  const selectedLanguage = i18n.language;

  return queryOptions({
    queryKey: ["search", params, page, per_page, type_id],
    queryFn: () =>
      API_CLIENT.GET("/api/v1/videos/search", {
        params: {
          query: {
            q: params.q,
            page,
            per_page,
            ...(type_id && { type_id }),
            ...(params.year && { year: params.year }),
            ...(params.class && { class: params.class }),
            ...(params.sort_by && { sort_by: params.sort_by }),
            ...(params.sort_order && { sort_order: params.sort_order }),
          },
          header: {
            "Accept-Language":
              LANGUAGES_API_HEADER[
                selectedLanguage as keyof typeof LANGUAGES_API_HEADER
              ],
          },
        },
      }),
    select: (data) => data.data,
    enabled: !!params.q && params.q.length >= 1, // Enable for queries with 1+ characters
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
    retry: 1, // Only retry once
  });
};

type UseGetSearchOptions = {
  params: {
    q: string;
    year?: string;
    class?: string;
    sort_by?: string;
    sort_order?: string;
  };
  page?: number;
  per_page?: number;
  type_id?: number;
} & QueryConfig<typeof getSearchQueryOptions>;

export const useGetSearch = ({
  params,
  page = 1,
  per_page = 10,
  type_id,
  ...queryConfig
}: UseGetSearchOptions) => {
  return useQuery({
    ...getSearchQueryOptions(params, page, per_page, type_id),
    ...queryConfig,
  });
};
