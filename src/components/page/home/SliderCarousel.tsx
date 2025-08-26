import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { PLACEHOLDER_IMAGE_HORIZONTAL } from "@/constants/common";
import type { CarouselVideoResponse } from "@/types/api-schema/response";
import { useEffect, useState } from "react";

interface SliderCarouselProps {
  videos: CarouselVideoResponse[];
  onVideoClick?: (video: CarouselVideoResponse) => void;
}

const SliderCarousel = ({ videos, onVideoClick }: SliderCarouselProps) => {
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

  const handleVideoClick = (video: CarouselVideoResponse) => {
    onVideoClick?.(video);
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
          {videos.map((video, index) => (
            <CarouselItem key={video.vod_id} className="basis-2/3 pl-0">
              <div
                className={`group relative cursor-pointer ${
                  index !== current - 1
                    ? "flex h-full items-center justify-center"
                    : ""
                }`}
                onClick={() => handleVideoClick(video)}
              >
                <img
                  src={video.vod_pic}
                  alt={video.vod_name}
                  className={`h-[157px] w-full transform rounded-xl border border-[#222222] object-cover transition-all duration-500 ease-in-out ${
                    index === current - 1 ? "scale-100" : "scale-90"
                  }`}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = PLACEHOLDER_IMAGE_HORIZONTAL;
                  }}
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {/* Pagination Dots */}
      <div className="mt-6 flex justify-center gap-1">
        {Array.from({ length: videos.length }).map((_, index) => (
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
