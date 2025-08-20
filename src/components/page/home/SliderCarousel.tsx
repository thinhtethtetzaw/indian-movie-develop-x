import type { Movie } from "@/components/common/MovieCard";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { useEffect, useState } from "react";

interface SliderCarouselProps {
  movies: Movie[];
  onMovieClick?: (movie: Movie) => void;
}

const SliderCarousel = ({ movies, onMovieClick }: SliderCarouselProps) => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }

    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  const handleMovieClick = (movie: Movie) => {
    onMovieClick?.(movie);
  };

  return (
    <div className="relative">
      <Carousel
        setApi={setApi}
        className="w-full"
        opts={{
          align: "center",
          loop: true,
        }}
      >
        <CarouselContent className="ml-0">
          {movies.map((movie, index) => (
            <CarouselItem key={movie.id} className="basis-2/3 pl-0">
              <div
                className={`group relative cursor-pointer ${
                  index !== current - 1
                    ? "flex h-full items-center justify-center"
                    : ""
                }`}
                onClick={() => handleMovieClick(movie)}
              >
                <img
                  src={movie.imageUrl}
                  alt={movie.title}
                  className={`h-[157px] w-full transform rounded-xl border border-[#222222] object-cover transition-all duration-500 ease-in-out ${
                    index === current - 1 ? "scale-100" : "scale-90"
                  }`}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src =
                      "https://via.placeholder.com/800x400/1f2937/ffffff?text=No+Image";
                  }}
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {/* Pagination Dots */}
      <div className="mt-6 flex justify-center gap-1">
        {Array.from({ length: movies.length }).map((_, index) => (
          <button
            key={index}
            type="button"
            aria-label={`Go to slide ${index + 1}`}
            className={`h-1 rounded-full transition-all duration-200 ${
              index === current - 1
                ? "w-4 bg-red-500"
                : "w-4 bg-gray-400/70 hover:bg-gray-400"
            }`}
            onClick={() => api?.scrollTo(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default SliderCarousel;
