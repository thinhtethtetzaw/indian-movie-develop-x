import type { Movie } from "@/components/common/MovieCard";
import MovieCard from "@/components/common/MovieCard";
import { Button } from "@/components/ui/button";
import { createFileRoute } from "@tanstack/react-router";
import { ChevronRightIcon } from "lucide-react";

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
    title: "The Matrix",
    imageUrl: "https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg",
    rating: 4.6,
    episode: null,
    isFavorite: true,
  },
  {
    id: "6",
    title: "Pulp Fiction",
    imageUrl: "https://image.tmdb.org/t/p/w500/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg",
    rating: 4.9,
    episode: null,
    isFavorite: false,
  },
];

export const Route = createFileRoute("/home/")({
  component: RouteComponent,
});

function RouteComponent() {
  const handleMovieClick = (movie: Movie) => {
    console.log("Movie clicked:", movie);
  };

  return (
    <div className="mx-auto">
      {/* Popular Movies Section */}
      <section>
        <div className="mb-6 flex items-center justify-between px-4">
          <h2 className="text-2xl font-bold text-white">Popular Movies</h2>
          <Button
            variant="link"
            className="!px-0 text-sm font-medium text-white"
          >
            View All <ChevronRightIcon />
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
    </div>
  );
}
