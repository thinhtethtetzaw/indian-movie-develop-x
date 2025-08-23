import i18n from "@/config/i18n";
import { LANGUAGES_API_HEADER } from "@/constants/common";
import { API_CLIENT } from "@/lib/openapi-api-client";
import { infiniteQueryOptions, useInfiniteQuery } from "@tanstack/react-query";
import type { QueryConfig } from "..";

export const getVideoListByNavigatorIdQueryOptions = (navigatorId: string) => {
  const selectedLanguage = i18n.language;

  return infiniteQueryOptions({
    queryKey: ["video-list-by-navigator-id", navigatorId],
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
      const totalPages = page.data?.data?.pagination?.total ?? 0;
      const nextPage = (page.data?.data?.pagination?.current_page || 1) + 1;
      return nextPage <= totalPages ? nextPage : undefined;
    },
  });
};

type UseGetVideoListByIdsOptions = {
  navigatorId: string;
  queryConfig?: QueryConfig<typeof getVideoListByNavigatorIdQueryOptions>;
};

export const useGetVideoListByNavigatorId = ({
  navigatorId,
  queryConfig,
}: UseGetVideoListByIdsOptions) => {
  const data = useInfiniteQuery({
    ...getVideoListByNavigatorIdQueryOptions(navigatorId),
    ...queryConfig,
  });

  const videoList = data.data?.pages.flatMap((page) => page.data?.data?.videos);

  return {
    ...data,
    videoList,
    pageTitle: data.data?.pages[0]?.data?.data?.topic_name,
    totalItems: data.data?.pages[0]?.data?.data?.pagination?.total,
  };
};
