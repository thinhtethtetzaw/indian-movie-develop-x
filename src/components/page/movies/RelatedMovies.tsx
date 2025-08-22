import MovieCard from "@/components/common/MovieCard";
import type { HomeRecommendListResponseMovie } from "@/types/api-schema/response";
import React from "react";

interface RelatedMoviesProps {
  movies: HomeRecommendListResponseMovie[];
  onMovieClick?: (movie: HomeRecommendListResponseMovie) => void;
  title: string;
}

const RelatedMovies: React.FC<RelatedMoviesProps> = ({
  movies,
  onMovieClick,
  title,
}) => {
  return (
    <section className="space-y-4">
      <h2 className="font-semibold text-white">{title}</h2>
      <div className="scrollbar-hide grid grid-cols-3 gap-3">
        {movies.map((movie) => (
          <div key={movie.vod_id} className="flex-shrink-0">
            <MovieCard movie={movie} onClick={() => onMovieClick?.(movie)} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default RelatedMovies;
