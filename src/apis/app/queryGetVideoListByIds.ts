import { API_CLIENT } from "@/lib/openapi-api-client";
import { queryOptions, useQuery } from "@tanstack/react-query";
import type { QueryConfig } from "..";

export const getVideoListByIdsQueryOptions = (videoIds: string[]) => {
  return queryOptions({
    queryKey: ["video-list-by-ids"],
    queryFn: () =>
      API_CLIENT.POST("/api/v1/video/list-by-ids", {
        body: {
          video_ids: videoIds,
        },
      }),
  });
};

type UseGetVideoListByIdsOptions = {
  videoIds: string[];
  queryConfig?: QueryConfig<typeof getVideoListByIdsQueryOptions>;
};

export const useGetVideoListByIds = ({
  videoIds,
  queryConfig,
}: UseGetVideoListByIdsOptions) => {
  const data = useQuery({
    ...getVideoListByIdsQueryOptions(videoIds),
    ...queryConfig,
  });

  const videoList = data.data?.data?.data;

  return { ...data, videoList };
};
