import i18n from "@/config/i18n";
import { LANGUAGES_API_HEADER } from "@/constants/common";
import { API_CLIENT } from "@/lib/openapi-api-client";
import { infiniteQueryOptions, useInfiniteQuery } from "@tanstack/react-query";
import type { QueryConfig } from "..";

export const getSearchInfiniteQueryOptions = (
  params: {
    q: string;
    year?: string;
    class?: string;
    sort_by?: string;
    sort_order?: string;
  },
  per_page: number = 10,
  type_id?: number,
) => {
  const selectedLanguage = i18n.language;

  return infiniteQueryOptions({
    queryKey: ["search-infinite", params, per_page, type_id],
    queryFn: ({ pageParam }) =>
      API_CLIENT.GET("/api/v1/videos/search", {
        params: {
          query: {
            q: params.q,
            page: pageParam ?? 1,
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
    enabled: !!params.q && params.q.length >= 1, // Enable for queries with 1+ characters
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
    retry: 1, // Only retry once
    initialPageParam: 1,
    getNextPageParam: (page: any) => {
      const totalPages = page?.data?.pagination?.last_page ?? 0;
      const currentPage = page?.data?.pagination?.current_page || 1;
      const nextPage = currentPage + 1;

      return nextPage <= totalPages ? nextPage : undefined;
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
  };
  per_page?: number;
  type_id?: number;
  queryConfig?: QueryConfig<typeof getSearchInfiniteQueryOptions>;
};

export const useGetSearchInfinite = ({
  params,
  per_page = 10,
  type_id,
  queryConfig,
}: UseGetSearchInfiniteOptions) => {
  const data = useInfiniteQuery({
    ...getSearchInfiniteQueryOptions(params, per_page, type_id),
    ...queryConfig,
    enabled: !!params.q && params.q.length >= 1,
  });

  const searchResults = data.data?.pages.flatMap(
    (page) => page?.data?.data || [],
  );

  return {
    ...data,
    searchResults,
    totalItems: data.data?.pages[0]?.data?.pagination?.total,
  };
};
