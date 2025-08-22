import Backward from "@/assets/svgs/icon-backward.svg?react";
import Forward from "@/assets/svgs/icon-forward.svg?react";
import Artplayer from "artplayer";
import { Pause, Play } from "lucide-react";
import React, { useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";

interface VideoPlayerProps {
  url?: string;
  poster?: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ url, poster }) => {
  const playerRef = useRef<HTMLDivElement>(null);
  const artRef = useRef<Artplayer | null>(null);

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
              width: 22px;
              height: 22px;
              display: flex;
              align-items: center;
              justify-content: center;
              position: relative;
            `;
            const backwardRoot = createRoot(backwardBtn);
            backwardRoot.render(<Backward style={{ width: 22, height: 22 }} />);
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
              width: 36px;
              height: 36px;
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
                      width: 12,
                      height: 12,
                      color: "white",
                    }}
                  />
                ) : (
                  <Play style={{ width: 12, height: 12, fill: "white" }} />
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
              width: 22px;
              height: 22px;
              display: flex;
              align-items: center;
              justify-content: center;
              position: relative;
            `;
            const forwardRoot = createRoot(forwardBtn);
            forwardRoot.render(<Forward style={{ width: 22, height: 22 }} />);
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

            art.on("destroy", () => {
              backwardRoot.unmount();
              playPauseRoot.unmount();
              forwardRoot.unmount();
              clearTimeout(hideTimeout);
            });
          });
        },
      ],
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
