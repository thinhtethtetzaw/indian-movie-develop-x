import i18n from "@/config/i18n";
import { LANGUAGES_API_HEADER } from "@/constants/common";
import { API_CLIENT } from "@/lib/openapi-api-client";
import type { SearchResultResponse } from "@/types/api-schema/response";
import { infiniteQueryOptions, useInfiniteQuery } from "@tanstack/react-query";
import type { QueryConfig } from "..";

export const getSearchInfiniteQueryOptions = (
  params: {
    q: string;
    year?: string;
    class?: string;
    sort_by?: string;
    sort_order?: string;
    type_id?: number;
  },
  per_page: number = 10,
  isHomePage: boolean = false,
) => {
  const selectedLanguage = i18n.language;

  return infiniteQueryOptions({
    queryKey: ["search-infinite", params, per_page],
    queryFn: ({ pageParam }) =>
      API_CLIENT.GET("/api/v1/videos/search", {
        params: {
          query: {
            q: params.q,
            page: pageParam ?? 1,
            per_page,
            ...(params.type_id && { type_id: params.type_id }),
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
    enabled: isHomePage ? !!params.type_id : !!params.q && params.q.length >= 1, // Home page: type_id required, Non-home: q required
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
    retry: 1, // Only retry once
    initialPageParam: 1,
    getNextPageParam: (page) => {
      const pagination = page.data?.pagination;

      if (!pagination) {
        return undefined;
      }

      const currentPage = pagination.current_page || 1;
      const lastPage = pagination.last_page || 0;
      const nextPage = currentPage + 1;

      // Stop when we've reached or exceeded the last page
      return nextPage <= lastPage ? nextPage : undefined;
    },
  });
};

type UseGetSearchInfiniteOptions = {
  params: {
    q: string;
    year?: string;
    class?: string;
    sort_by?: string;
    sort_order?: string;
    type_id?: number;
  };
  per_page?: number;
  isHomePage?: boolean;
  queryConfig?: QueryConfig<typeof getSearchInfiniteQueryOptions>;
};

export const useGetSearchInfinite = ({
  params,
  per_page = 10,
  isHomePage = false,
  queryConfig,
}: UseGetSearchInfiniteOptions) => {
  const data = useInfiniteQuery({
    ...getSearchInfiniteQueryOptions(params, per_page, isHomePage),
    ...queryConfig,
  });

  const searchResults: SearchResultResponse["data"] | undefined =
    data.data?.pages
      .flatMap((page) => page.data?.data ?? [])
      .filter((item): item is NonNullable<typeof item> => item !== undefined);

  const currentPage = data.data?.pages[0]?.data?.pagination?.current_page;

  return {
    ...data,
    searchResults,
    currentPage,
    totalItems: data.data?.pages[0]?.data?.pagination?.total,
  };
};
