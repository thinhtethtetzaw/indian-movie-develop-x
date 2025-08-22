import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { ChartNoAxesColumn, ChevronUp } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

interface Episode {
  id: number;
  title: string;
}

interface EpisodeAccordionProps {
  seasonTitle: string;
  episodes?: Episode[];
  onEpisodeSelect?: (id: number) => void;
}

const EpisodeItem: React.FC<{
  episode: Episode;
  isActive: boolean;
  onClick: () => void;
}> = ({ episode, isActive, onClick }) => (
  <button
    type="button"
    className={`flex-group relative flex min-w-fit items-center gap-2 rounded-full px-4 py-3 whitespace-nowrap transition-all duration-200 ${
      isActive
        ? "blur-1 bg-[#D5123A] text-white"
        : "blur-1 bg-gradient-to-r from-white/4 to-white/12"
    } cursor-pointer`}
    onClick={onClick}
  >
    <span className="text-sm font-medium">{episode.title}</span>
    {isActive && (
      <ChartNoAxesColumn className="absolute bottom-1 left-1/2 h-5 w-5 -translate-x-1/2 translate-y-1/2 text-white" />
    )}
  </button>
);

interface EpisodeCarouselProps {
  episodes: Episode[];
  activeEpisodeId: number | null;
  onEpisodeClick: (id: number) => void;
}

const EpisodeCarousel: React.FC<EpisodeCarouselProps> = ({
  episodes,
  activeEpisodeId,
  onEpisodeClick,
}) => {
  const [api, setApi] = useState<CarouselApi>();

  const onEpisodeClickRef = useRef(onEpisodeClick);
  useEffect(() => {
    onEpisodeClickRef.current = onEpisodeClick;
  }, [onEpisodeClick]);

  const handleSelectEpisode = (id: number) => {
    onEpisodeClickRef.current(id);
    const index = episodes.findIndex((ep) => ep.id === id);
    if (api && index >= 0) {
      api.scrollTo(index);
    }
  };

  return (
    <Carousel className="w-full" setApi={setApi}>
      <CarouselContent className="-ml-2 flex">
        {episodes.map((episode) => (
          <CarouselItem key={episode.id} className="basis-auto pl-2">
            <EpisodeItem
              episode={episode}
              isActive={activeEpisodeId === episode.id}
              onClick={() => handleSelectEpisode(episode.id)}
            />
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
};

const EpisodeAccordion: React.FC<EpisodeAccordionProps> = ({
  seasonTitle,
  episodes = [],
  onEpisodeSelect,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeEpisodeId, setActiveEpisodeId] = useState<number | null>(null);

  useEffect(() => {
    // default active: first episode
    if (episodes.length > 0 && activeEpisodeId === null) {
      setActiveEpisodeId(episodes[0]?.id ?? 0);
    }
  }, [episodes, activeEpisodeId]);

  const handleEpisodeSelect = (id: number) => {
    setActiveEpisodeId(id);
    onEpisodeSelect?.(id);
  };

  return (
    <div className="mx-auto w-full max-w-4xl overflow-hidden rounded-lg bg-gradient-to-r from-white/4 to-black/88">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between bg-gradient-to-r from-white/4 to-black/88 p-4 text-white"
        aria-label={
          isOpen ? "Collapse season episodes" : "Expand season episodes"
        }
      >
        <div className="flex items-center gap-3">
          <span className="text-lg font-semibold">{seasonTitle}</span>
          <span className="text-sm text-gray-400">
            {episodes.length} Episodes
          </span>
        </div>
        <ChevronUp
          className={`h-5 w-5 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      <div
        className={`overflow-hidden transition-all duration-300 ${
          isOpen ? "max-h-32" : "max-h-0"
        }`}
      >
        <div className="p-4">
          {episodes.length === 0 ? (
            <p className="text-sm text-gray-400">No episodes available.</p>
          ) : (
            <EpisodeCarousel
              episodes={episodes}
              activeEpisodeId={activeEpisodeId}
              onEpisodeClick={handleEpisodeSelect}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default EpisodeAccordion;
