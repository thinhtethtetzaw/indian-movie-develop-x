import MovieCard from "@/components/common/MovieCard";
import React from "react";

interface Movie {
  id: string;
  title: string;
  imageUrl: string;
  rating?: number | null;
  isFavorite?: boolean;
  episode?: number | null;
}

interface RelatedMoviesProps {
  movies: Movie[];
  onMovieClick?: (movie: Movie) => void;
  onFavoriteToggle?: (movie: Movie) => void;
  title: string;
}

const RelatedMovies: React.FC<RelatedMoviesProps> = ({
  movies,
  onMovieClick,
  onFavoriteToggle,
  title,
}) => {
  return (
    <section className="space-y-4">
      <h2 className="font-semibold text-white">{title}</h2>
      <div className="scrollbar-hide grid grid-cols-3 gap-3">
        {movies.map((movie) => (
          <div key={movie.id} className="flex-shrink-0">
            <MovieCard
              movie={movie}
              onFavoriteToggle={() => onFavoriteToggle?.(movie)}
              onClick={() => onMovieClick?.(movie)}
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default RelatedMovies;
