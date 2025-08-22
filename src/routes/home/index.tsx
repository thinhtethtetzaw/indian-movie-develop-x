import { useGetHomeRecommendList } from "@/apis/app/queryGetHomeRecommendList";
import MovieCard, { MovieCardSkeleton } from "@/components/common/MovieCard";
import SliderCarousel from "@/components/page/home/SliderCarousel";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { HomeRecommendListResponseMovie } from "@/types/api-schema/response";
import { createFileRoute } from "@tanstack/react-router";
import { ChevronDownIcon, ChevronRightIcon } from "lucide-react";
import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/home/")({
  component: RouteComponent,
  beforeLoad: () => {
    return {
      layoutConfig: {
        isShowBottomNavbar: true,
      },
    };
  },
});

function RouteComponent() {
  const { t } = useTranslation();
  const handleMovieClick = (movie: HomeRecommendListResponseMovie) => {
    console.log("Movie clicked:", movie);
  };

  const renderMovieSkeleton = useCallback(
    (index: number) => <MovieCardSkeleton index={index} />,
    [],
  );

  const CarouselSkeleton = () => (
    <div className="px-4">
      <Skeleton className="h-[157px] w-full rounded-xl" />
      <div className="mt-6 flex justify-center gap-1">
        {Array.from({ length: 3 }).map((_, index) => (
          <Skeleton
            key={index}
            className={`h-1 w-4 rounded-full ${
              index === 0 ? "bg-red-500" : "bg-gray-400/70"
            }`}
          />
        ))}
      </div>
    </div>
  );

  const ListSectionSkeleton = () => (
    <section className="space-y-4">
      <div className="flex items-center justify-between px-4">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-6 w-20" />
      </div>
      <div className="scrollbar-hide flex gap-3 overflow-x-auto pl-4">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="flex-shrink-0 last:pr-4">
            {renderMovieSkeleton(index)}
          </div>
        ))}
      </div>
    </section>
  );

  const TopicSectionSkeleton = () => (
    <section className="space-y-4 px-4">
      <Skeleton className="h-6 w-32" />
      <div className="grid grid-cols-3 gap-x-3 gap-y-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="flex-shrink-0">
            {renderMovieSkeleton(index)}
          </div>
        ))}
      </div>
      <Skeleton className="h-14 w-full" />
    </section>
  );

  const HomeSkeleton = () => (
    <div className="mt-5 space-y-10">
      <CarouselSkeleton />
      <ListSectionSkeleton />
      <TopicSectionSkeleton />
    </div>
  );

  const { homeRecommendList, isLoading } = useGetHomeRecommendList({});

  if (isLoading) {
    return <HomeSkeleton />;
  }

  return (
    <div className="mt-5 space-y-10">
      {homeRecommendList?.map((item) => {
        return (
          <React.Fragment key={item.title}>
            {item.type === "carousel" && item.list && item.list.length > 0 && (
              <section>
                <SliderCarousel
                  movies={item.list as HomeRecommendListResponseMovie[]}
                  onMovieClick={handleMovieClick}
                />
              </section>
            )}
            {item.type === "list" && item.list && item.list.length > 0 && (
              <section className="space-y-4">
                <div className="flex items-center justify-between px-4">
                  <h2 className="text-forground font-semibold">{item.title}</h2>
                  <Button
                    variant="link"
                    className="text-forground text-sm font-medium"
                  >
                    {/* TODO: update text after backend fix */}
                    {t("common.viewAll")} <ChevronRightIcon />
                  </Button>
                </div>
                <div className="scrollbar-hide flex gap-3 overflow-x-auto pl-4">
                  {item.list.map((movie, index) => (
                    <div key={movie.vod_id} className="flex-shrink-0 last:pr-4">
                      <MovieCard
                        movie={movie}
                        onClick={handleMovieClick}
                        index={index}
                      />
                    </div>
                  ))}
                </div>
              </section>
            )}
            {item.type === "topic" && item.list && item.list.length > 0 && (
              <section className="space-y-4 px-4">
                <h2 className="text-forground font-semibold">{item.title}</h2>
                <div className="scrollbar-hide grid grid-cols-3 gap-x-3 gap-y-6">
                  {item.list.map((movie, index) => (
                    <div key={movie.vod_id} className="flex-shrink-0">
                      <MovieCard
                        movie={movie}
                        onClick={handleMovieClick}
                        index={index}
                      />
                    </div>
                  ))}
                </div>
                <Button
                  variant="default"
                  className="text-forground w-full bg-white/10 py-6 hover:bg-white/20"
                >
                  {t("common.viewMore")}
                  <ChevronDownIcon />
                </Button>
              </section>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
