import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Heart, Star } from "lucide-react";
import { motion } from "motion/react";
import React from "react";

export interface Movie {
  id: string;
  title: string;
  imageUrl: string;
  rating?: number | null;
  isFavorite?: boolean;
  episode?: number | null;
}

interface MovieCardProps {
  movie: Movie;
  onFavoriteToggle?: (movieId: string, isFavorite: boolean) => void;
  onClick?: (movie: Movie) => void;
  className?: string;
  showFavoriteButton?: boolean;
}

const MovieCard: React.FC<MovieCardProps> = ({
  movie,
  onFavoriteToggle,
  onClick,
  className,
  showFavoriteButton = true,
}) => {
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onFavoriteToggle?.(movie.id, !movie.isFavorite);
  };

  const handleCardClick = () => {
    onClick?.(movie);
  };

  const renderRating = () => {
    if (!movie.rating && !movie.episode) return null;

    return (
      <div className="absolute bottom-2 left-2">
        {movie.rating && (
          <div className="flex items-center gap-1">
            <span className="text-forground text-xs font-medium">
              {movie?.rating.toFixed(1)}
            </span>
            <Star className="text-forground h-3 w-3 fill-white" />
          </div>
        )}
        {movie.episode && (
          <div className="text-forground flex items-center gap-1 text-xs font-medium">
            <span>{movie?.episode}</span>
            <span>Episode</span>
          </div>
        )}
      </div>
    );
  };

  const renderFavoriteButton = () => {
    if (!showFavoriteButton) return null;

    return (
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          "absolute top-1 right-1 size-7 rounded-full bg-white/20 backdrop-blur-sm transition-all hover:bg-black/40",
        )}
        onClick={handleFavoriteClick}
      >
        <Heart
          className={cn(
            "size-4 transition-all",
            movie.isFavorite
              ? "fill-red-500 text-red-500"
              : "text-forground hover:text-red-400",
          )}
        />
      </Button>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{
        duration: 0.3,
        delay: Number(movie.id) * 0.05,
      }}
      className={cn("min-h-46 w-31", className)}
      onClick={handleCardClick}
    >
      <div className="relative">
        <img
          src={movie.imageUrl}
          alt={movie.title}
          className="h-40 w-full rounded-[3px] object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src =
              "https://via.placeholder.com/300x450/1f2937/ffffff?text=No+Image";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 from-10% via-black/20 via-30% to-transparent to-50%" />

        {renderFavoriteButton()}
        {renderRating()}
      </div>
      <h3 className="text-forground mt-1.5 truncate text-sm font-semibold">
        {movie.title}
      </h3>
    </motion.div>
  );
};

export default MovieCard;
