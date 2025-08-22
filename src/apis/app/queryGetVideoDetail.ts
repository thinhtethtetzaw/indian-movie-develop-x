import i18n from "@/config/i18n";
import { LANGUAGES_API_HEADER } from "@/constants/common";
import { API_CLIENT } from "@/lib/openapi-api-client";
import { queryOptions, useQuery } from "@tanstack/react-query";
import type { QueryConfig } from "..";

// Query options for fetching video detail
export const getVideoDetailQueryOptions = (vodId: string) => {
  const selectedLanguage = i18n.language;

  return queryOptions({
    queryKey: ["video-detail", vodId],
    queryFn: () =>
      API_CLIENT.GET("/api/v1/video/detail", {
        params: {
          query: { vod_id: vodId },
          header: {
            "Accept-Language":
              LANGUAGES_API_HEADER[
                selectedLanguage as keyof typeof LANGUAGES_API_HEADER
              ],
          },
        },
      }),
    enabled: !!vodId,
  });
};

type UseGetVideoDetailOptions = {
  vodId: string;
  queryConfig?: QueryConfig<typeof getVideoDetailQueryOptions>;
};

// Hook for fetching video detail
export const useGetVideoDetail = ({
  vodId,
  queryConfig,
}: UseGetVideoDetailOptions) => {
  const data = useQuery({
    ...getVideoDetailQueryOptions(vodId),
    ...queryConfig,
  });

  const videoDetail = data.data?.data?.data;

  return { ...data, videoDetail };
};
