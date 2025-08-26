import Backward from "@/assets/svgs/icon-backward.svg?react";
import Forward from "@/assets/svgs/icon-forward.svg?react";
import { db } from "@/lib/db";
import Artplayer from "artplayer";
import { useLiveQuery } from "dexie-react-hooks";
import { Pause, Play } from "lucide-react";
import React, { useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";

interface VideoPlayerProps {
  id: string;
  url: string;
  poster: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ id, url, poster }) => {
  const playerRef = useRef<HTMLDivElement>(null);
  const artRef = useRef<Artplayer | null>(null);

  const curretWishlist = useLiveQuery(() => db.watchList.get(id));

  useEffect(() => {
    if (!playerRef.current || !url) return;

    artRef.current = new Artplayer({
      container: playerRef.current,
      url,
      poster,
      autoplay: false,
      setting: false,
      fullscreen: true,
      playbackRate: true,
      aspectRatio: true,
      hotkey: true,
      icons: {
        state: "",
      },
      plugins: [
        function centerControls(art: Artplayer) {
          art.on("ready", () => {
            // art.currentTime = curretWishlist?.play_head_in_sec ?? 0;

            // Create center control overlay
            const centerControls = document.createElement("div");
            centerControls.className = "art-center-controls";
            centerControls.style.cssText = `
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              display: flex;
              align-items: center;
              gap: 30px;
              opacity: 0;
              transition: opacity 0.3s ease;
              pointer-events: none;
              z-index: 20;
            `;

            // Backward button
            const backwardBtn = document.createElement("div");
            backwardBtn.className = "art-center-btn art-backward-btn";
            backwardBtn.style.cssText = `
              cursor: pointer;
              pointer-events: auto;
              transition: transform 0.2s ease;
              width: 33px;
              height: 33px;
              display: flex;
              align-items: center;
              justify-content: center;
              position: relative;
            `;
            const backwardRoot = createRoot(backwardBtn);
            backwardRoot.render(<Backward style={{ width: 33, height: 33 }} />);
            backwardBtn.addEventListener("click", () => {
              art.currentTime = Math.max(0, art.currentTime - 10);
            });

            // Play/Pause button
            const playPauseBtn = document.createElement("div");
            playPauseBtn.className = "art-center-btn art-play-pause-btn";
            playPauseBtn.style.cssText = `
              cursor: pointer;
              pointer-events: auto;
              transition: transform 0.2s ease;
              width: 56px;
              height: 56px;
              border-radius: 50%;
              background-color: rgba(0, 0, 0, 0.5);
              display: flex;
              align-items: center;
              justify-content: center;
            `;
            const playPauseRoot = createRoot(playPauseBtn);
            const updatePlayPauseButton = () => {
              playPauseRoot.render(
                art.playing ? (
                  <Pause
                    style={{
                      width: 33,
                      height: 33,
                      color: "white",
                    }}
                  />
                ) : (
                  <Play style={{ width: 33, height: 33, fill: "white" }} />
                ),
              );
            };
            updatePlayPauseButton();
            playPauseBtn.addEventListener("click", () => art.toggle());
            art.on("play", updatePlayPauseButton);
            art.on("pause", updatePlayPauseButton);

            // Forward button
            const forwardBtn = document.createElement("div");
            forwardBtn.className = "art-center-btn art-forward-btn";
            forwardBtn.style.cssText = `
              cursor: pointer;
              pointer-events: auto;
              transition: transform 0.2s ease;
              width: 33px;
              height: 33px;
              display: flex;
              align-items: center;
              justify-content: center;
              position: relative;
            `;
            const forwardRoot = createRoot(forwardBtn);
            forwardRoot.render(<Forward style={{ width: 33, height: 33 }} />);
            forwardBtn.addEventListener("click", () => {
              art.currentTime = Math.min(art.duration, art.currentTime + 10);
            });
            centerControls.appendChild(backwardBtn);
            centerControls.appendChild(playPauseBtn);
            centerControls.appendChild(forwardBtn);
            art.template.$player.appendChild(centerControls);

            // Show/hide on hover
            let hideTimeout: NodeJS.Timeout;
            const showControls = () => {
              centerControls.style.opacity = "1";
              clearTimeout(hideTimeout);
            };
            const hideControls = () => {
              hideTimeout = setTimeout(() => {
                centerControls.style.opacity = art.playing ? "0" : "1";
              }, 2000);
            };
            art.template.$player.addEventListener("mouseenter", showControls);
            art.template.$player.addEventListener("mousemove", showControls);
            art.template.$player.addEventListener("mouseleave", hideControls);

            art.on("destroy", async () => {
              // Use the art parameter directly instead of artRef.current
              const currentTime = art.currentTime || 0;
              console.log(art.currentTime);
              db.watchList.update(id, {
                play_head_in_sec: currentTime,
                created_at: new Date(),
              });

              setTimeout(() => {
                backwardRoot.unmount();
                playPauseRoot.unmount();
                forwardRoot.unmount();

                clearTimeout(hideTimeout);
              }, 0);
            });
          });
        },
      ],
    });

    return () => {
      artRef.current?.destroy();
      artRef.current = null;
    };
  }, [id, url, poster, curretWishlist]);

  return (
    <div
      ref={playerRef}
      className="mb-5 aspect-video w-full overflow-hidden bg-black"
    />
  );
};

export default VideoPlayer;
