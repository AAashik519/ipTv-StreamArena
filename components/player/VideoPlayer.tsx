"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  RefreshCw,
  AlertCircle,
  Wifi,
  ChevronDown,
} from "lucide-react";

interface Props {
  urls: string[];
  title: string;
  logoUrl?: string;
}

type PlayerState = "loading" | "playing" | "buffering" | "paused" | "error";

const LOAD_TIMEOUT_MS = 12000; // 12s per source before trying next

export default function VideoPlayer({ urls, title, logoUrl }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const hlsRef = useRef<import("hls.js").default | null>(null);
  const hideControlsTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const loadTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const currentIndexRef = useRef(0);
  const isMountedRef = useRef(true);

  const [state, setState] = useState<PlayerState>("loading");
  const [urlIndex, setUrlIndex] = useState(0);
  // Start muted so autoplay always works in all browsers
  const [muted, setMuted] = useState(true);
  const [volume, setVolume] = useState(1);
  const [fullscreen, setFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [showUrlSelector, setShowUrlSelector] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const validUrls = urls.filter((u) => u.startsWith("http"));

  function clearLoadTimeout() {
    if (loadTimeoutRef.current) {
      clearTimeout(loadTimeoutRef.current);
      loadTimeoutRef.current = null;
    }
  }

  function destroyHls() {
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }
  }

  const loadStream = useCallback(
    async (index: number) => {
      if (!isMountedRef.current) return;
      const url = validUrls[index];
      if (!url || !videoRef.current) {
        if (isMountedRef.current) {
          setState("error");
          setErrorMsg("No valid stream URL available.");
        }
        return;
      }

      currentIndexRef.current = index;
      setUrlIndex(index);
      setState("loading");
      setErrorMsg("");
      clearLoadTimeout();
      destroyHls();

      const video = videoRef.current;

      // Reset video element completely
      video.pause();
      video.removeAttribute("src");
      video.load();

      // Timeout: if stream doesn't start in 12s, try next
      loadTimeoutRef.current = setTimeout(() => {
        if (!isMountedRef.current) return;
        const next = index + 1;
        if (next < validUrls.length) {
          loadStream(next);
        } else {
          setState("error");
          setErrorMsg("All streams timed out. Please try again.");
        }
      }, LOAD_TIMEOUT_MS);

      const isM3U8 = url.includes(".m3u8");
      const isDirectTS = !isM3U8 && url.includes(".ts");

      try {
        const HlsModule = await import("hls.js");
        const Hls = HlsModule.default;

        if (!isDirectTS && Hls.isSupported()) {
          // ── HLS.js path (Chrome / Firefox / Edge) ──
          const hls = new Hls({
            enableWorker: false, // disable worker to avoid SW interference
            lowLatencyMode: false,
            backBufferLength: 5,
            maxBufferLength: 20,
            maxMaxBufferLength: 40,
            fragLoadingTimeOut: 10000,
            manifestLoadingTimeOut: 8000,
            levelLoadingTimeOut: 8000,
          });
          hlsRef.current = hls;

          hls.loadSource(url);
          hls.attachMedia(video);

          hls.on(Hls.Events.MANIFEST_PARSED, () => {
            if (!isMountedRef.current) return;
            clearLoadTimeout();
            video.muted = true; // ensure muted for autoplay
            video
              .play()
              .then(() => {
                if (isMountedRef.current) setState("playing");
              })
              .catch(() => {
                if (isMountedRef.current) setState("paused");
              });
          });

          hls.on(Hls.Events.ERROR, (_, data) => {
            if (!isMountedRef.current) return;
            if (data.fatal) {
              clearLoadTimeout();
              destroyHls();
              const next = index + 1;
              if (next < validUrls.length) {
                setTimeout(() => loadStream(next), 500);
              } else {
                setState("error");
                setErrorMsg("All streams failed to load.");
              }
            }
          });
        } else if (
          !isDirectTS &&
          video.canPlayType("application/vnd.apple.mpegurl")
        ) {
          // ── Native HLS (Safari / iOS) ──
          video.src = url;
          video.muted = true;
          video.load();
          video.play().then(() => {
            clearLoadTimeout();
            if (isMountedRef.current) setState("playing");
          }).catch(() => {
            if (isMountedRef.current) setState("paused");
          });
        } else {
          // ── Direct source (mp4 / ts / fallback) ──
          video.src = url;
          video.muted = true;
          video.load();
          video.play().then(() => {
            clearLoadTimeout();
            if (isMountedRef.current) setState("playing");
          }).catch(() => {
            clearLoadTimeout();
            const next = index + 1;
            if (next < validUrls.length) {
              setTimeout(() => loadStream(next), 300);
            } else {
              setState("error");
              setErrorMsg("Unable to play any stream.");
            }
          });
        }
      } catch (err) {
        console.error("Player init error:", err);
        clearLoadTimeout();
        const next = index + 1;
        if (next < validUrls.length) {
          setTimeout(() => loadStream(next), 300);
        } else {
          setState("error");
          setErrorMsg("Player initialization failed.");
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [validUrls.join(",")]
  );

  // Mount / unmount
  useEffect(() => {
    isMountedRef.current = true;
    if (validUrls.length > 0) loadStream(0);
    return () => {
      isMountedRef.current = false;
      clearLoadTimeout();
      destroyHls();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadStream]);

  // Video native event listeners
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onWaiting = () => {
      if (isMountedRef.current) setState((s) => (s === "playing" ? "buffering" : s));
    };
    const onPlaying = () => {
      if (!isMountedRef.current) return;
      clearLoadTimeout();
      setState("playing");
    };
    const onPause = () => {
      if (isMountedRef.current) setState("paused");
    };
    const onTimeUpdate = () => setCurrentTime(video.currentTime);
    const onDurationChange = () => setDuration(video.duration);
    const onVolumeChange = () => {
      setMuted(video.muted);
      setVolume(video.volume);
    };
    const onError = () => {
      if (!isMountedRef.current) return;
      if (hlsRef.current) return; // HLS.js handles its own errors
      clearLoadTimeout();
      const next = currentIndexRef.current + 1;
      if (next < validUrls.length) {
        setTimeout(() => loadStream(next), 300);
      } else {
        setState("error");
        setErrorMsg("Stream error. All sources failed.");
      }
    };

    video.addEventListener("waiting", onWaiting);
    video.addEventListener("playing", onPlaying);
    video.addEventListener("pause", onPause);
    video.addEventListener("timeupdate", onTimeUpdate);
    video.addEventListener("durationchange", onDurationChange);
    video.addEventListener("volumechange", onVolumeChange);
    video.addEventListener("error", onError);

    return () => {
      video.removeEventListener("waiting", onWaiting);
      video.removeEventListener("playing", onPlaying);
      video.removeEventListener("pause", onPause);
      video.removeEventListener("timeupdate", onTimeUpdate);
      video.removeEventListener("durationchange", onDurationChange);
      video.removeEventListener("volumechange", onVolumeChange);
      video.removeEventListener("error", onError);
    };
  }, [loadStream, validUrls.length]);

  // Fullscreen listener
  useEffect(() => {
    const onFsChange = () => setFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onFsChange);
    return () => document.removeEventListener("fullscreenchange", onFsChange);
  }, []);

  // Auto-hide controls
  function resetControlsTimer() {
    setShowControls(true);
    if (hideControlsTimer.current) clearTimeout(hideControlsTimer.current);
    hideControlsTimer.current = setTimeout(() => {
      if (isMountedRef.current) setShowControls(false);
    }, 3000);
  }

  function togglePlay() {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play().catch(() => {/* already handled */});
    } else {
      v.pause();
    }
  }

  function toggleMute() {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
  }

  function handleVolume(e: React.ChangeEvent<HTMLInputElement>) {
    const v = videoRef.current;
    if (!v) return;
    const val = parseFloat(e.target.value);
    v.volume = val;
    v.muted = val === 0;
  }

  function toggleFullscreen() {
    const el = containerRef.current;
    if (!el) return;
    if (!document.fullscreenElement) el.requestFullscreen();
    else document.exitFullscreen();
  }

  function retry() {
    setState("loading");
    currentIndexRef.current = 0;
    loadStream(0);
  }

  function formatTime(s: number) {
    if (!isFinite(s) || s === 0) return null;
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
  }

  const isLive = !isFinite(duration) || duration === 0;
  const formattedTime = formatTime(currentTime);
  const formattedDuration = formatTime(duration);

  return (
    <div
      ref={containerRef}
      className="relative w-full bg-black rounded-xl overflow-hidden select-none"
      style={{ aspectRatio: "16/9" }}
      onMouseMove={resetControlsTimer}
      onTouchStart={resetControlsTimer}
      onClick={(e) => {
        if ((e.target as HTMLElement).closest("button,input,select,.no-toggle")) return;
        togglePlay();
      }}
    >
      {/* ── Video element — NO crossOrigin to avoid CORS issues ── */}
      <video
        ref={videoRef}
        className="w-full h-full object-contain"
        playsInline
        autoPlay
        muted
        preload="none"
      />

      {/* ── Loading overlay ── */}
      {state === "loading" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 z-10 pointer-events-none fade-in">
          <div className="relative w-16 h-16 mb-5">
            <div className="absolute inset-0 border-4 border-[#e50914]/20 rounded-full" />
            <div className="absolute inset-0 border-4 border-transparent border-t-[#e50914] rounded-full spinner" />
          </div>
          <p className="text-white text-sm font-semibold">Loading stream…</p>
          {validUrls.length > 1 && (
            <p className="text-gray-500 text-xs mt-1.5">
              Trying source {urlIndex + 1} of {validUrls.length}
            </p>
          )}
        </div>
      )}

      {/* ── Buffering overlay ── */}
      {state === "buffering" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 z-10 pointer-events-none fade-in">
          <div className="w-10 h-10 border-3 border-white/20 border-t-white rounded-full spinner mb-2" />
          <p className="text-white/80 text-xs font-medium">Buffering…</p>
        </div>
      )}

      {/* ── Error overlay ── */}
      {state === "error" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/95 z-10 fade-in px-6 text-center">
          <AlertCircle size={44} className="text-[#e50914] mb-4" />
          <p className="text-white font-bold text-lg mb-2">Stream Unavailable</p>
          <p className="text-gray-400 text-sm mb-6 max-w-xs leading-relaxed">
            {errorMsg || "Unable to load this channel. Check your internet connection and try again."}
          </p>
          <button
            onClick={(e) => { e.stopPropagation(); retry(); }}
            className="flex items-center gap-2 bg-[#e50914] hover:bg-[#b81d24] text-white px-6 py-2.5 rounded-xl font-semibold transition-colors shadow-lg shadow-red-900/30"
          >
            <RefreshCw size={16} />
            Try Again
          </button>
        </div>
      )}

      {/* ── Channel Logo ── */}
      {logoUrl && (state === "playing" || state === "paused" || state === "buffering") && (
        <div className="absolute top-3 right-3 pointer-events-none z-10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={logoUrl}
            alt=""
            className="h-9 w-auto max-w-[72px] object-contain opacity-75 drop-shadow-lg"
            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
          />
        </div>
      )}

      {/* ── Muted badge — tap to unmute ── */}
      {muted && state === "playing" && (
        <button
          onClick={(e) => { e.stopPropagation(); toggleMute(); }}
          className="no-toggle absolute top-3 left-3 z-10 flex items-center gap-1.5 bg-black/70 hover:bg-black/90 border border-white/20 text-white text-xs font-semibold px-3 py-1.5 rounded-full transition-all backdrop-blur-sm"
        >
          <VolumeX size={13} />
          Tap to Unmute
        </button>
      )}

      {/* ── Controls ── */}
      <div
        className={`absolute bottom-0 left-0 right-0 transition-opacity duration-300 z-20 ${
          showControls || state !== "playing" ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent pointer-events-none rounded-b-xl" />

        <div className="relative px-4 pb-4 pt-10">
          {/* Title + Live badge */}
          <div className="flex items-center gap-2 mb-3">
            {isLive ? (
              <span className="flex items-center gap-1 bg-[#e50914] text-white text-[10px] font-bold px-2 py-0.5 rounded-full live-badge">
                <Wifi size={8} /> LIVE
              </span>
            ) : formattedTime ? (
              <span className="text-gray-300 text-xs font-mono">{formattedTime}</span>
            ) : null}
            <span className="text-white text-sm font-medium truncate flex-1">{title}</span>
          </div>

          {/* VOD seek bar */}
          {!isLive && duration > 0 && (
            <div className="mb-3">
              <input
                type="range" min={0} max={duration} value={currentTime}
                onChange={(e) => { const v = videoRef.current; if (v) v.currentTime = parseFloat(e.target.value); }}
                className="w-full h-1 accent-[#e50914] cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>{formattedTime ?? "0:00"}</span>
                <span>{formattedDuration ?? "0:00"}</span>
              </div>
            </div>
          )}

          {/* Button row */}
          <div className="flex items-center gap-3">
            {/* Play/Pause */}
            <button onClick={togglePlay} className="text-white hover:text-[#e50914] transition-colors">
              {state === "paused"
                ? <Play size={22} fill="currentColor" />
                : <Pause size={22} />}
            </button>

            {/* Volume */}
            <div className="flex items-center gap-2">
              <button onClick={toggleMute} className="text-white hover:text-[#e50914] transition-colors">
                {muted || volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
              </button>
              <input
                type="range" min={0} max={1} step={0.05}
                value={muted ? 0 : volume}
                onChange={handleVolume}
                className="w-20 h-1 accent-[#e50914] cursor-pointer hidden sm:block"
              />
            </div>

            <div className="flex-1" />

            {/* Stream selector */}
            {validUrls.length > 1 && (
              <div className="relative no-toggle">
                <button
                  onClick={() => setShowUrlSelector((v) => !v)}
                  className="flex items-center gap-1 text-xs text-gray-300 hover:text-white bg-white/10 hover:bg-white/20 px-2.5 py-1 rounded-lg transition-colors"
                >
                  Source {urlIndex + 1}/{validUrls.length}
                  <ChevronDown size={12} />
                </button>
                {showUrlSelector && (
                  <div className="absolute bottom-9 right-0 bg-[#1a1a1f] border border-[#2a2a35] rounded-xl overflow-hidden shadow-2xl z-30 min-w-[130px]">
                    {validUrls.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => { setShowUrlSelector(false); loadStream(i); }}
                        className={`block w-full text-left px-4 py-2.5 text-sm transition-colors ${
                          i === urlIndex
                            ? "bg-[#e50914] text-white font-semibold"
                            : "text-gray-300 hover:bg-white/10 hover:text-white"
                        }`}
                      >
                        Stream {i + 1}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Retry */}
            <button
              onClick={retry}
              title="Reload"
              className="text-gray-300 hover:text-white transition-colors"
            >
              <RefreshCw size={16} />
            </button>

            {/* Fullscreen */}
            <button onClick={toggleFullscreen} className="text-white hover:text-[#e50914] transition-colors">
              {fullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
