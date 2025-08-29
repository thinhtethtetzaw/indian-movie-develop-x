import i18n from "@/config/i18n";
import { LANGUAGES_API_HEADER } from "@/constants/common";
import { API_CLIENT } from "@/lib/openapi-api-client";
import { queryOptions, useQuery } from "@tanstack/react-query";
import type { QueryConfig } from "..";

export const getVideoRecommendQueryOptions = (vod_id: string) => {
  const selectedLanguage = i18n.language;

  return queryOptions({
    queryKey: ["video-recommend", vod_id],
    queryFn: () =>
      API_CLIENT.GET("/api/v1/video/recommend", {
        params: {
          query: {
            vod_id,
          },
          header: {
            "Accept-Language":
              LANGUAGES_API_HEADER[
                selectedLanguage as keyof typeof LANGUAGES_API_HEADER
              ],
          },
        },
      }),
    enabled: !!vod_id,
  });
};

type UseGetVideoRecommendOptions = {
  vod_id: string;
  queryConfig?: QueryConfig<typeof getVideoRecommendQueryOptions>;
};

export const useGetVideoRecommend = ({
  vod_id,
  queryConfig,
}: UseGetVideoRecommendOptions) => {
  const data = useQuery({
    ...getVideoRecommendQueryOptions(vod_id),
    ...queryConfig,
  });

  const videoRecommendList = data.data?.data?.data;

  return { ...data, videoRecommendList };
};
