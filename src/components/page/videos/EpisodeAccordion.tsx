import EpisodeIcon from "@/assets/svgs/icon-episode.svg?react";
import { ChevronUp } from "lucide-react";
import React, { useEffect, useState } from "react";

import { Tag } from "@/components/common/Tag";
import { parseAsInteger, useQueryState } from "nuqs";

interface Episode {
  id: number;
  title: string;
  url: string;
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
  <Tag
    variant={isActive ? "active" : "default"}
    size="lg"
    className="relative cursor-pointer [&>svg]:size-4"
    onClick={onClick}
  >
    <span className="relative flex items-center gap-1.5">{episode.title}</span>
    {isActive && (
      <EpisodeIcon className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-white" />
    )}
  </Tag>
);

const EpisodeAccordion: React.FC<EpisodeAccordionProps> = ({
  seasonTitle,
  episodes = [],
  onEpisodeSelect,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeEpisodeId, setActiveEpisodeId] = useQueryState(
    "epId",
    parseAsInteger.withDefault(1),
  );

  useEffect(() => {
    if (episodes.length > 0 && activeEpisodeId === null) {
      setActiveEpisodeId(episodes[0]?.id ?? 0);
    }
  }, [episodes, activeEpisodeId]);

  const handleEpisodeSelect = (id: number) => {
    setActiveEpisodeId(id);
    onEpisodeSelect?.(id);
  };

  return (
    <div className="mx-auto w-full overflow-hidden rounded-lg bg-gradient-to-r from-white/4 to-black/88">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between bg-gradient-to-r from-white/4 to-black/88 p-4 text-white"
        aria-label={
          isOpen ? "Collapse season episodes" : "Expand season episodes"
        }
      >
        <div className="flex items-center gap-3">
          <span className="font-semibold">{seasonTitle}</span>
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
            <div className="scrollbar-hide flex items-center gap-x-1.5 overflow-auto">
              {episodes.map((episode) => (
                <EpisodeItem
                  key={episode.id}
                  episode={episode}
                  isActive={activeEpisodeId === episode.id}
                  onClick={() => handleEpisodeSelect(episode.id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EpisodeAccordion;
