import type { Movie } from "@/components/common/MovieCard";
import MovieCard from "@/components/common/MovieCard";
import SliderCarousel from "@/components/page/home/SliderCarousel";
import { Button } from "@/components/ui/button";
import { createFileRoute } from "@tanstack/react-router";
import { ChevronDownIcon, ChevronRightIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

const MOCK_MOVIES: Movie[] = [
  {
    id: "1",
    title: "Superman",
    imageUrl: "https://image.tmdb.org/t/p/w500/1E5baAaEse26fej7uHcjOgEE2t2.jpg",
    rating: 4.0,
    episode: null,
    isFavorite: false,
  },
  {
    id: "2",
    title: "The Dark Knight",
    imageUrl: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
    rating: null,
    episode: 10,
    isFavorite: true,
  },
  {
    id: "3",
    title: "Inception",
    imageUrl: "https://image.tmdb.org/t/p/w500/edv5CZvWj09upOsy2Y6IwDhK8bt.jpg",
    rating: 4.5,
    episode: null,
    isFavorite: false,
  },
  {
    id: "4",
    title: "Interstellar",
    imageUrl: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
    rating: 4.7,
    episode: null,
    isFavorite: false,
  },
  {
    id: "5",
    title: "Interstellar",
    imageUrl: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
    rating: 4.7,
    episode: null,
    isFavorite: false,
  },
];

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
          <h2 className="font-semibold text-white">
            {t("pages.home.popularMovies")}
          </h2>
          <Button
            variant="link"
            className="!px-0 text-sm font-medium text-white"
          >
            {t("common.viewAll")} <ChevronRightIcon />
          </Button>
        </div>
        <div className="scrollbar-hide flex gap-3 overflow-x-auto pl-4">
          {MOCK_MOVIES.map((movie) => (
            <div key={movie.id} className="flex-shrink-0 last:pr-4">
              <MovieCard
                movie={movie}
                onFavoriteToggle={() => console.log("favorite")}
                onClick={handleMovieClick}
              />
            </div>
          ))}
        </div>
      </section>

      {/* Popular TV Series Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between px-4">
          <h2 className="font-semibold text-white">
            {t("pages.home.popularTVSeries")}
          </h2>
          <Button
            variant="link"
            className="!px-0 text-sm font-medium text-white"
          >
            {t("common.viewAll")} <ChevronRightIcon />
          </Button>
        </div>
        <div className="scrollbar-hide flex gap-3 overflow-x-auto pl-4">
          {MOCK_MOVIES.map((movie) => (
            <div key={movie.id} className="flex-shrink-0 last:pr-4">
              <MovieCard
                movie={movie}
                onFavoriteToggle={() => console.log("favorite")}
                onClick={handleMovieClick}
              />
            </div>
          ))}
        </div>
      </section>

      {/* You May Like Section */}
      <section className="space-y-4 px-4">
        <h2 className="font-semibold text-white">
          {t("pages.home.youMayLike")}
        </h2>
        <div className="scrollbar-hide grid grid-cols-3 gap-3">
          {MOCK_MOVIES.map((movie) => (
            <div key={movie.id} className="flex-shrink-0">
              <MovieCard
                movie={movie}
                onFavoriteToggle={() => console.log("favorite")}
                onClick={handleMovieClick}
              />
            </div>
          ))}
        </div>
        <Button
          variant="default"
          className="w-full bg-white/10 py-6 text-white hover:bg-white/20"
        >
          {t("common.viewMore")}
          <ChevronDownIcon />
        </Button>
      </section>
    </div>
  );
}
