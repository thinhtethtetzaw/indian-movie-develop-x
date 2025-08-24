import { API_CLIENT } from "@/lib/openapi-api-client";
import { queryOptions, useQuery } from "@tanstack/react-query";
import type { QueryConfig } from "..";

export const getVideoListByIdsQueryOptions = (
  videoIds: string[],
  typeId?: number,
) => {
  return queryOptions({
    queryKey: ["video-list-by-ids", typeId],
    queryFn: () =>
      API_CLIENT.POST("/api/v1/video/list-by-ids", {
        body: {
          video_ids: videoIds,
          type_id: typeId ?? 0,
        },
      }),
  });
};

type UseGetVideoListByIdsOptions = {
  videoIds: string[];
  typeId?: number;
  queryConfig?: QueryConfig<typeof getVideoListByIdsQueryOptions>;
};

export const useGetVideoListByIds = ({
  videoIds,
  typeId,
  queryConfig,
}: UseGetVideoListByIdsOptions) => {
  const data = useQuery({
    ...getVideoListByIdsQueryOptions(videoIds, typeId),
    ...queryConfig,
  });

  const videoList = data.data?.data?.data;

  return { ...data, videoList };
};
