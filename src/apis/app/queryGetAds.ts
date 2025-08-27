import { API_CLIENT } from "@/lib/openapi-api-client";
import type { SingleAds } from "@/types/api-schema/response";
import { queryOptions, useQuery } from "@tanstack/react-query";
import type { QueryConfig } from "..";

// Query options for fetching video detail
export const getAdsQueryOptions = (uniqueLabel: string) => {
  return queryOptions({
    queryKey: ["ads", uniqueLabel],
    queryFn: () =>
      API_CLIENT.GET("/api/v1/adverts", {
        params: {
          query: { unique_label: uniqueLabel, channel: "ios" },
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

  const allAds: SingleAds[] = data.data?.data?.data ?? [];

  return { ...data, allAds };
};
