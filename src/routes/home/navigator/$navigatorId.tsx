import { useGetMovieListByNavigatorId } from "@/apis/app/queryGetMovieListByNavigatorId";
import MovieCard, { MovieCardSkeleton } from "@/components/common/MovieCard";
import type { MovieResponse } from "@/types/api-schema/response";
import { createFileRoute } from "@tanstack/react-router";
import { useCallback } from "react";

export const Route = createFileRoute("/home/navigator/$navigatorId")({
  component: RouteComponent,
});

function RouteComponent() {
  const { navigatorId } = Route.useParams();
  const { movieList, isLoading } = useGetMovieListByNavigatorId({
    navigatorId,
  });

  const renderMovieSkeleton = useCallback(
    (index: number) => <MovieCardSkeleton index={index} />,
    [],
  );

  function handleMovieClick(movie: MovieResponse) {
    console.log("Movie clicked:", movie);
  }

  if (isLoading)
    return (
      <div className="grid grid-cols-3 gap-x-3 gap-y-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="flex-shrink-0">
            {renderMovieSkeleton(index)}
          </div>
        ))}
      </div>
    );
  console.log("movieList", movieList);

  return (
    <section className="space-y-4 px-4">
      <div className="scrollbar-hide grid grid-cols-3 gap-x-3 gap-y-6">
        {movieList?.map((movie, index) => (
          <div key={movie.vod_id} className="flex-shrink-0">
            <MovieCard
              movie={movie as MovieResponse}
              onClick={handleMovieClick}
              index={index}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
