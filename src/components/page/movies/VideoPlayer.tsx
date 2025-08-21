import Artplayer from "artplayer";
import React, { useEffect, useRef } from "react";

interface VideoPlayerProps {
  url: string;
  poster: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ url, poster }) => {
  const playerRef = useRef<HTMLDivElement>(null);
  const artRef = useRef<Artplayer | null>(null);

  useEffect(() => {
    if (!playerRef.current) return;

    artRef.current = new Artplayer({
      container: playerRef.current,
      url,
      poster,
      autoplay: false,
      setting: false,
      fullscreen: true,
      playbackRate: true,
      aspectRatio: true,
    });

    return () => {
      artRef.current?.destroy();
      artRef.current = null;
    };
  }, [url, poster]);

  return (
    <div
      ref={playerRef}
      className="mb-5 aspect-video w-full overflow-hidden rounded-lg bg-black"
    />
  );
};

export default VideoPlayer;
