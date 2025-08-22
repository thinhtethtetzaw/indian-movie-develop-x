import { API_CLIENT } from "@/lib/openapi-api-client";
import { queryOptions, useQuery } from "@tanstack/react-query";
import type { QueryConfig } from "..";

export const getMovieListByIdsQueryOptions = (videoIds: string[]) => {
  return queryOptions({
    queryKey: ["movie-list-by-ids"],
    queryFn: () =>
      API_CLIENT.POST("/api/v1/video/list-by-ids", {
        body: {
          video_ids: videoIds,
        },
      }),
  });
};

type UseGetMovieListByIdsOptions = {
  videoIds: string[];
  queryConfig?: QueryConfig<typeof getMovieListByIdsQueryOptions>;
};

export const useGetMovieListByIds = ({
  videoIds,
  queryConfig,
}: UseGetMovieListByIdsOptions) => {
  const data = useQuery({
    ...getMovieListByIdsQueryOptions(videoIds),
    ...queryConfig,
  });

  const movieList = data.data?.data?.data;

  return { ...data, movieList };
};
