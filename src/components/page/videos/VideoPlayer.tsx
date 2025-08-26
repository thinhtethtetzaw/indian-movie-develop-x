import Backward from "@/assets/svgs/icon-backward.svg?react";
import Forward from "@/assets/svgs/icon-forward.svg?react";
import { db } from "@/lib/db";
import Artplayer from "artplayer";
import { useLiveQuery } from "dexie-react-hooks";
import Hls from "hls.js";
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
  const hlsRef = useRef<Hls | null>(null);

  const currentWishlist = useLiveQuery(() => db.watchList.get(id));

  // Helper function to create HLS configuration
  const createHLSConfig = (baseConfig: any) => ({
    ...baseConfig,
    type: "customHls",
    customType: {
      customHls: function (video: HTMLVideoElement, url: string) {
        if (Hls.isSupported()) {
          const hls = new Hls({
            enableWorker: true,
            lowLatencyMode: true,
            backBufferLength: 90,
          });

          hlsRef.current = hls;
          hls.loadSource(url);
          hls.attachMedia(video);

          hls.on(Hls.Events.ERROR, (_, data) => {
            console.error("HLS Error:", data);
            if (data.fatal) {
              switch (data.type) {
                case Hls.ErrorTypes.NETWORK_ERROR:
                  console.log("Network error, trying to recover...");
                  hls.startLoad();
                  break;
                case Hls.ErrorTypes.MEDIA_ERROR:
                  console.log("Media error, trying to recover...");
                  hls.recoverMediaError();
                  break;
                default:
                  console.log("Fatal error, destroying HLS...");
                  hls.destroy();
                  break;
              }
            }
          });
        } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
          video.src = url;
        } else {
          console.error("HLS not supported in this browser");
        }
      },
    },
  });

  // Helper function to create center controls plugin
  const createCenterControlsPlugin = () => {
    return function centerControls(art: Artplayer) {
      art.on("ready", () => {
        // Set initial time if available
        if (currentWishlist?.play_head_in_sec) {
          art.currentTime = currentWishlist.play_head_in_sec;
        }

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

        // Create control buttons
        const { button: backwardBtn, root: backwardRoot } = createControlButton(
          "art-backward-btn",
          <Backward style={{ width: 33, height: 33 }} />,
          () => (art.currentTime = Math.max(0, art.currentTime - 10)),
        );

        const { playPauseBtn, playPauseRoot, updatePlayPauseButton } =
          createPlayPauseButton(art);

        const { button: forwardBtn, root: forwardRoot } = createControlButton(
          "art-forward-btn",
          <Forward style={{ width: 33, height: 33 }} />,
          () =>
            (art.currentTime = Math.min(art.duration, art.currentTime + 10)),
        );

        // Assemble controls
        centerControls.appendChild(backwardBtn);
        centerControls.appendChild(playPauseBtn);
        centerControls.appendChild(forwardBtn);
        art.template.$player.appendChild(centerControls);

        // Setup hover controls
        const { hideTimeout, cleanup } = setupHoverControls(
          art,
          centerControls,
        );

        // Cleanup on destroy
        art.on("destroy", async () => {
          const currentTime = art.currentTime || 0;
          await db.watchList.update(id, {
            play_head_in_sec: currentTime,
            created_at: new Date(),
          });

          setTimeout(() => {
            backwardRoot.unmount();
            playPauseRoot.unmount();
            forwardRoot.unmount();
            cleanup();
          }, 0);
        });
      });
    };
  };

  // Helper function to create a control button
  const createControlButton = (
    className: string,
    icon: React.ReactElement,
    onClick: () => void,
  ) => {
    const button = document.createElement("div");
    button.className = `art-center-btn ${className}`;
    button.style.cssText = `
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

    const root = createRoot(button);
    root.render(icon);
    button.addEventListener("click", onClick);

    return { button, root };
  };

  // Helper function to create play/pause button
  const createPlayPauseButton = (art: Artplayer) => {
    const button = document.createElement("div");
    button.className = "art-center-btn art-play-pause-btn";
    button.style.cssText = `
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

    const root = createRoot(button);
    const updatePlayPauseButton = () => {
      root.render(
        art.playing ? (
          <Pause style={{ width: 33, height: 33, color: "white" }} />
        ) : (
          <Play style={{ width: 33, height: 33, fill: "white" }} />
        ),
      );
    };

    updatePlayPauseButton();
    button.addEventListener("click", () => art.toggle());
    art.on("play", updatePlayPauseButton);
    art.on("pause", updatePlayPauseButton);

    return { playPauseBtn: button, playPauseRoot: root, updatePlayPauseButton };
  };

  // Helper function to setup hover controls
  const setupHoverControls = (art: Artplayer, centerControls: HTMLElement) => {
    let hideTimeout: NodeJS.Timeout | undefined;

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

    const cleanup = () => {
      if (hideTimeout) clearTimeout(hideTimeout);
    };

    return { hideTimeout, cleanup };
  };

  // Force destroy existing player and clean up all resources
  const destroyPlayer = () => {
    console.log("Force destroying player and cleaning up resources");

    // Stop and pause the video element directly
    if (playerRef.current) {
      const videoElement = playerRef.current.querySelector("video");
      if (videoElement) {
        videoElement.pause();
        videoElement.src = "";
        videoElement.load();
        videoElement.remove();
      }
    }

    // Destroy HLS instance
    if (hlsRef.current) {
      console.log("Destroying HLS instance");
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    // Destroy Artplayer instance
    if (artRef.current) {
      console.log("Destroying Artplayer instance");
      artRef.current.destroy();
      artRef.current = null;
    }

    // Clear the container
    if (playerRef.current) {
      playerRef.current.innerHTML = "";
    }
  };

  // Destroy existing player when URL changes
  useEffect(() => {
    destroyPlayer();
  }, [url]);

  // Create new player
  useEffect(() => {
    if (!playerRef.current || !url) return;

    console.log("Creating new player with URL:", url);

    const isHLS = url.toLowerCase().endsWith(".m3u8");

    const baseConfig = {
      container: playerRef.current,
      url,
      poster,
      autoplay: false,
      setting: false,
      fullscreen: true,
      playbackRate: true,
      aspectRatio: true,
      hotkey: true,
      icons: { state: "" },
    };

    const playerConfig = isHLS ? createHLSConfig(baseConfig) : baseConfig;

    artRef.current = new Artplayer({
      ...playerConfig,
      plugins: [createCenterControlsPlugin()],
    });

    return () => {
      destroyPlayer();
    };
  }, [url, poster, id]);

  return (
    <div
      ref={playerRef}
      className="mb-5 aspect-video w-full overflow-hidden bg-black"
    />
  );
};

export default VideoPlayer;
