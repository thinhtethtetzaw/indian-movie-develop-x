import { useGetMovieListByNavigatorId } from "@/apis/app/queryGetMovieListByNavigatorId";
import NavHeader from "@/components/common/layouts/NavHeader";
import MovieCard, { MovieCardSkeleton } from "@/components/common/MovieCard";
import { Skeleton } from "@/components/ui/skeleton";
import type { MovieResponse } from "@/types/api-schema/response";
import { createFileRoute } from "@tanstack/react-router";
import { useCallback } from "react";

export const Route = createFileRoute("/home/navigator/$navigatorId")({
  component: RouteComponent,
});

function RouteComponent() {
  const { navigatorId } = Route.useParams();
  const { pageTitle, movieList, isPending } = useGetMovieListByNavigatorId({
    navigatorId,
  });

  const renderMovieSkeleton = useCallback(
    (index: number) => <MovieCardSkeleton index={index} />,
    [],
  );

  function handleMovieClick(movie: MovieResponse) {
    console.log("Movie clicked:", movie);
  }

  if (isPending)
    return (
      <>
        <Skeleton className="h-[var(--nav-header-height)] w-full rounded-none" />
        <div className="mt-5 grid grid-cols-3 gap-x-3 gap-y-6 px-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="flex-shrink-0">
              {renderMovieSkeleton(index)}
            </div>
          ))}
        </div>
      </>
    );

  return (
    <>
      <NavHeader isShowBack={true} title={pageTitle || ""} />

      <section className="mt-5 space-y-4 px-4">
        <div className="scrollbar-hide grid grid-cols-3 gap-x-3 gap-y-6">
          {movieList?.map(
            (movie, index) =>
              !!movie && (
                <div key={movie.vod_id} className="flex-shrink-0">
                  <MovieCard
                    movie={movie}
                    onClick={handleMovieClick}
                    index={index}
                  />
                </div>
              ),
          )}
        </div>
      </section>
    </>
  );
}
