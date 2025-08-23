import VideoCard from "@/components/common/VideoCard";
import type { VideoResponse } from "@/types/api-schema/response";
import React, { useEffect, useRef, useState } from "react";

interface RelatedMoviesProps {
  movies: VideoResponse[];
  onMovieClick?: (movie: VideoResponse) => void;
  /** Pass this if your grid is inside a scrollable container (overflow-auto) */
  scrollContainerRef?: React.RefObject<HTMLElement>;
}

const RelatedMovies: React.FC<RelatedMoviesProps> = ({
  movies = [],
  onMovieClick,
  scrollContainerRef,
}) => {
  const COLUMNS = 3;
  const [visibleCount, setVisibleCount] = useState(COLUMNS);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Reset when movies change
  useEffect(() => {
    setVisibleCount(COLUMNS);
  }, [movies]);

  // Observe sentinel
  useEffect(() => {
    if (!loadMoreRef.current) return;

    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        setVisibleCount((prev) => {
          if (prev >= movies.length) return prev;
          return Math.min(prev + COLUMNS, movies.length); // add one full row (3 items)
        });
      },
      {
        root: scrollContainerRef?.current ?? null, // null = window
        rootMargin: "0px 0px 200px 0px", // pre-load a bit before bottom
        threshold: 0.1,
      },
    );

    observerRef.current.observe(loadMoreRef.current);
    return () => observerRef.current?.disconnect();
  }, [movies.length, scrollContainerRef]);

  if (!movies.length) return null;

  return (
    <section className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        {movies.slice(0, visibleCount).map((movie) => (
          <div key={movie.vod_id} className="flex-shrink-0">
            <VideoCard video={movie} onClick={onMovieClick} />
          </div>
        ))}
      </div>

      {/* Sentinel (tiny spacer is fine) */}
      <div ref={loadMoreRef} className="h-1" />
    </section>
  );
};

export default RelatedMovies;
