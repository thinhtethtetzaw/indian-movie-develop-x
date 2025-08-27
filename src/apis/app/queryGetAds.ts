import i18n from "@/config/i18n";
import { LANGUAGES_API_HEADER } from "@/constants/common";
import { API_CLIENT } from "@/lib/openapi-api-client";
import { queryOptions, useQuery } from "@tanstack/react-query";
import type { QueryConfig } from "..";

// Query options for fetching video detail
export const getAdsQueryOptions = (uniqueLabel: string) => {
  const selectedLanguage = i18n.language;

  return queryOptions({
    queryKey: ["ads", uniqueLabel],
    queryFn: () =>
      API_CLIENT.GET("/api/v1/adverts", {
        params: {
          query: { unique_label: uniqueLabel, channel: "ios" },
          header: {
            "Accept-Language":
              LANGUAGES_API_HEADER[
                selectedLanguage as keyof typeof LANGUAGES_API_HEADER
              ],
          },
        },
      }),
    enabled: !!uniqueLabel,
  });
};

type UseGetAdsOptions = {
  uniqueLabel: string;
  queryConfig?: QueryConfig<typeof getAdsQueryOptions>;
};

// Hook for fetching video detail
export const useGetAds = ({ uniqueLabel, queryConfig }: UseGetAdsOptions) => {
  const data = useQuery({
    ...getAdsQueryOptions(uniqueLabel),
    ...queryConfig,
  });

  const allAds = data.data?.data?.data;

  return { ...data, allAds };
};
