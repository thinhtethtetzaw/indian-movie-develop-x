import i18n from "@/config/i18n";
import { LANGUAGES_API_HEADER } from "@/constants/common";
import { API_CLIENT } from "@/lib/openapi-api-client";
import { infiniteQueryOptions, useInfiniteQuery } from "@tanstack/react-query";
import type { QueryConfig } from "..";

export const getPopularSearchQueryOptions = ({
  per_page = 15,
}: {
  per_page?: number;
}) => {
  const selectedLanguage = i18n.language;

  return infiniteQueryOptions({
    queryKey: ["popular-search"],
    queryFn: ({ pageParam }) =>
      API_CLIENT.GET("/api/v1/video/popular", {
        params: {
          header: {
            "Accept-Language":
              LANGUAGES_API_HEADER[
                selectedLanguage as keyof typeof LANGUAGES_API_HEADER
              ],
          },
          query: {
            page: pageParam ?? 1,
            per_page,
          },
        },
      }),
    staleTime: 10 * 1000,
    initialPageParam: 1,
    getNextPageParam: (page) => {
      const totalPages = page.data?.pagination?.total ?? 0;
      const nextPage = (page.data?.pagination?.current_page || 1) + 1;
      return nextPage <= totalPages ? nextPage : undefined;
    },
  });
};

type UseGetPopularSearchOptions = {
  per_page?: number;
  queryConfig?: QueryConfig<typeof getPopularSearchQueryOptions>;
};

export const useGetPopularSearch = ({
  per_page,
  queryConfig,
}: UseGetPopularSearchOptions) => {
  const data = useInfiniteQuery({
    ...getPopularSearchQueryOptions({ per_page }),
    ...queryConfig,
  });

  const videoList = data.data?.pages.flatMap((page) => page.data?.data);

  return {
    ...data,
    videoList,
    currentPage:
      data.data?.pages[data.data.pages.length - 1]?.data?.pagination
        ?.current_page,
    totalItems: data.data?.pages[0]?.data?.pagination?.total,
  };
};
