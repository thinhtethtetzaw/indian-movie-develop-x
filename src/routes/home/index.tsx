import type { Movie } from "@/components/common/MovieCard";
import MovieCard from "@/components/common/MovieCard";
import SliderCarousel from "@/components/page/home/SliderCarousel";
import { Button } from "@/components/ui/button";
import { MOCK_MOVIES } from "@/constants/mock";
import { createFileRoute } from "@tanstack/react-router";
import { ChevronDownIcon, ChevronRightIcon } from "lucide-react";
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
  const handleMovieClick = (movie: Movie) => {
    console.log("Movie clicked:", movie);
  };

  return (
    <div className="space-y-10">
      {/* Featured Movies Carousel */}
      <section>
        <SliderCarousel movies={MOCK_MOVIES} onMovieClick={handleMovieClick} />
      </section>

      {/* Popular Movies Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between px-4">
          <h2 className="text-forground font-semibold">
            {t("pages.home.popularMovies")}
          </h2>
          <Button
            variant="link"
            className="text-forground !px-0 text-sm font-medium"
          >
            {t("common.viewAll")} <ChevronRightIcon />
          </Button>
        </div>
        <div className="scrollbar-hide flex gap-3 overflow-x-auto pl-4">
          {MOCK_MOVIES.map((movie, index) => (
            <div key={movie.id} className="flex-shrink-0 last:pr-4">
              <MovieCard
                movie={movie}
                onClick={handleMovieClick}
                index={index}
              />
            </div>
          ))}
        </div>
      </section>

      {/* Popular TV Series Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between px-4">
          <h2 className="text-forground font-semibold">
            {t("pages.home.popularTVSeries")}
          </h2>
          <Button
            variant="link"
            className="text-forground !px-0 text-sm font-medium"
          >
            {t("common.viewAll")} <ChevronRightIcon />
          </Button>
        </div>
        <div className="scrollbar-hide flex gap-3 overflow-x-auto pl-4">
          {MOCK_MOVIES.map((movie, index) => (
            <div key={movie.id} className="flex-shrink-0 last:pr-4">
              <MovieCard
                movie={movie}
                onClick={handleMovieClick}
                index={index}
              />
            </div>
          ))}
        </div>
      </section>

      {/* You May Like Section */}
      <section className="space-y-4 px-4">
        <h2 className="text-forground font-semibold">
          {t("pages.home.youMayLike")}
        </h2>
        <div className="scrollbar-hide grid grid-cols-3 gap-x-3 gap-y-6">
          {MOCK_MOVIES.map((movie, index) => (
            <div key={movie.id} className="flex-shrink-0">
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
    </div>
  );
}
