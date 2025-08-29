import Backward from "@/assets/svgs/icon-backward.svg?react";
import Forward from "@/assets/svgs/icon-forward.svg?react";
import { db } from "@/lib/db";
import Artplayer from "artplayer";
import Hls from "hls.js";
import { Pause, Play } from "lucide-react";
import { parseAsString, useQueryState } from "nuqs";
import React, { useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";

interface VideoPlayerProps {
  id: string;
  url: string;
  currentPlayhead: number;
  poster: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  id,
  url,
  currentPlayhead,
  poster,
}) => {
  const [activeEpisode] = useQueryState(
    "episode",
    parseAsString.withDefault(""),
  );

  const playerRef = useRef<HTMLDivElement>(null);
  const artRef = useRef<Artplayer | null>(null);
  const hlsRef = useRef<Hls | null>(null);

  // Helper function to stop all media and audio in the browser
  const stopAllMedia = () => {
    // Stop all video elements on the page
    const allVideos = document.querySelectorAll("video");
    allVideos.forEach((video) => {
      video.pause();
      video.currentTime = 0;
      video.muted = true;
      // Clear src to fully stop the media
      video.src = "";
      video.load();
    });

    // Stop all audio elements on the page
    const allAudios = document.querySelectorAll("audio");
    allAudios.forEach((audio) => {
      audio.pause();
      audio.currentTime = 0;
      audio.muted = true;
      audio.src = "";
      audio.load();
    });

    // Stop any Web Audio API contexts
    if (window.AudioContext || (window as any).webkitAudioContext) {
      const audioContexts = (window as any).audioContexts || [];
      audioContexts.forEach((ctx: AudioContext) => {
        if (ctx.state !== "closed") {
          ctx.close();
        }
      });
    }
  };

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
        // Set initial time if available - prioritize currentPlayhead prop over database value
        if (currentPlayhead > 0) {
          art.currentTime = currentPlayhead;
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

        const { playPauseBtn, playPauseRoot } = createPlayPauseButton(art);

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
        const { cleanup } = setupHoverControls(art, centerControls);

        // Cleanup on destroy
        art.on("destroy", async () => {
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
      const isPlaying = !art.video.paused && !art.video.ended;
      root.render(
        isPlaying ? (
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

  // Enhanced destroy function with complete media cleanup
  const destroyPlayer = async () => {
    const currentTime = artRef.current?.currentTime || 0;
    const duration = artRef.current?.duration || 0;

    // Check if video is completed (watched 90% or more of the duration)
    const isCompleted = duration > 0 && currentTime / duration >= 0.9;

    if (currentTime > 0) {
      if (isCompleted) {
        // Remove from watchlist if video is completed
        await db.watchList
          .where("[id+ep_id]")
          .equals([id, activeEpisode])
          .delete()
          .catch((error) => {
            console.error("Failed to remove from watchlist:", error);
          });
      } else {
        // Save playback progress if video is not completed
        await db.watchList
          .put({
            id: id,
            ep_id: activeEpisode,
            play_head_in_sec: Math.floor(currentTime),
            duration: Math.floor(duration),
            updated_at: new Date(),
          })
          .catch((error) => {
            console.error("Failed to update watchlist:", error);
          });
      }
    }

    // Stop all media first to ensure no audio continues
    stopAllMedia();

    // Stop and clean up the video element specifically
    if (playerRef.current) {
      const videoElement = playerRef.current.querySelector("video");
      if (videoElement) {
        videoElement.pause();
        videoElement.muted = true;
        videoElement.currentTime = 0;
        videoElement.src = "";
        videoElement.srcObject = null;
        videoElement.load();
        videoElement.remove();
      }
    }

    // Destroy HLS instance with additional cleanup
    if (hlsRef.current) {
      console.log("Destroying HLS instance");
      hlsRef.current.stopLoad();
      hlsRef.current.detachMedia();
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    // Destroy Artplayer instance
    if (artRef.current) {
      console.log("Destroying Artplayer instance");
      // Pause and mute before destroying
      if (artRef.current.video) {
        artRef.current.video.pause();
        artRef.current.video.muted = true;
      }
      artRef.current.destroy();
      artRef.current = null;
    }

    // Clear the container
    if (playerRef.current) {
      playerRef.current.innerHTML = "";
    }

    // Force garbage collection hint
    if (window.gc) {
      window.gc();
    }
  };

  useEffect(() => {
    stopAllMedia();
    destroyPlayer();
  }, [url]);

  useEffect(() => {
    if (!playerRef.current || !url) return;
    stopAllMedia();

    const isHLS = url.toLowerCase().endsWith(".m3u8");

    const baseConfig = {
      container: playerRef.current,
      url,
      poster,
      autoplay: true,
      muted: false,
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

    // Handle autoplay policies - try to play after a short delay
    artRef.current.on("ready", () => {
      if (artRef.current) {
        // Try to autoplay, handle potential browser restrictions
        artRef.current.play().catch((error) => {
          console.log("Autoplay was prevented:", error);
          // If autoplay fails, try with muted first
          if (artRef.current?.video) {
            artRef.current.video.muted = true;
            artRef.current
              .play()
              .then(() => {
                // After starting muted, try to unmute
                setTimeout(() => {
                  if (artRef.current?.video) {
                    artRef.current.video.muted = false;
                  }
                }, 1000);
              })
              .catch(() => {
                console.log(
                  "Even muted autoplay failed - user interaction required",
                );
              });
          }
        });
      }
    });

    return () => {
      destroyPlayer();
    };
  }, [url, poster, id]);

  // Handle page visibility changes to pause video when tab is not active
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Page is hidden, pause the video
        if (artRef.current?.video) {
          artRef.current.video.pause();
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      stopAllMedia();
      destroyPlayer();
    };
  }, []);

  return (
    <div
      ref={playerRef}
      className="mb-5 aspect-video w-full overflow-hidden bg-black"
    />
  );
};

export default VideoPlayer;
