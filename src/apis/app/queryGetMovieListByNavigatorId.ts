import i18n from "@/config/i18n";
import { LANGUAGES_API_HEADER } from "@/constants/common";
import { API_CLIENT } from "@/lib/openapi-api-client";
import { infiniteQueryOptions, useInfiniteQuery } from "@tanstack/react-query";
import type { QueryConfig } from "..";

export const getMovieListByNavigatorIdQueryOptions = (navigatorId: string) => {
  const selectedLanguage = i18n.language;

  return infiniteQueryOptions({
    queryKey: ["movie-list-by-navigator-id"],
    queryFn: ({ pageParam }) =>
      API_CLIENT.GET("/api/v1/video/topic/{navigatorId}", {
        params: {
          header: {
            "Accept-Language":
              LANGUAGES_API_HEADER[
                selectedLanguage as keyof typeof LANGUAGES_API_HEADER
              ],
          },
          path: {
            navigatorId,
          },
          query: {
            page: pageParam ?? 1,
          },
        },
      }),
    staleTime: 10 * 1000,
    initialPageParam: 1,
    getNextPageParam: (page) => {
      const totalPages = page.data?.data?.total ?? 0;
      const nextPage = (page.data?.data?.current_page || 1) + 1;
      return nextPage <= totalPages ? nextPage : undefined;
    },
  });
};

type UseGetMovieListByIdsOptions = {
  navigatorId: string;
  queryConfig?: QueryConfig<typeof getMovieListByNavigatorIdQueryOptions>;
};

export const useGetMovieListByNavigatorId = ({
  navigatorId,
  queryConfig,
}: UseGetMovieListByIdsOptions) => {
  const data = useInfiniteQuery({
    ...getMovieListByNavigatorIdQueryOptions(navigatorId),
    ...queryConfig,
  });

  const movieList = data.data?.pages.flatMap((page) => page.data?.data);

  return {
    ...data,
    movieList,
    totalItems: data.data?.pages[0]?.data?.data?.total,
  };
};
