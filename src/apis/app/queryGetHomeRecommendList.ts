import i18n from "@/config/i18n";
import { LANGUAGES_API_HEADER } from "@/constants/common";
import { API_CLIENT } from "@/lib/openapi-api-client";
import { queryOptions, useQuery } from "@tanstack/react-query";
import type { QueryConfig } from "..";

export const getHomeRecommendListQueryOptions = () => {
  const selectedLanguage = i18n.language;

  return queryOptions({
    queryKey: ["home-recommend-list"],
    queryFn: () =>
      API_CLIENT.GET("/api/v1/home/recommend/list", {
        params: {
          header: {
            "Accept-Language":
              LANGUAGES_API_HEADER[
                selectedLanguage as keyof typeof LANGUAGES_API_HEADER
              ],
          },
        },
      }),
  });
};

type UseGetHomeRecommendListOptions = {
  queryConfig?: QueryConfig<typeof getHomeRecommendListQueryOptions>;
};

export const useGetHomeRecommendList = ({
  queryConfig,
}: UseGetHomeRecommendListOptions) => {
  const data = useQuery({
    ...getHomeRecommendListQueryOptions(),
    ...queryConfig,
  });

  const homeRecommendList = data.data?.data?.data;

  return { ...data, homeRecommendList };
};
