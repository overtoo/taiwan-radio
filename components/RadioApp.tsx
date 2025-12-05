"use client";

import { useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import { stations } from "@/lib/data";

export default function RadioApp() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlay = (url: string, name: string, id: string) => {
    const audio = audioRef.current;
    if (!audio) return;

    if (activeId === id && isPlaying) {
      audio.pause();
      setIsPlaying(false);
      return;
    }

    setActiveId(id);

    if (Hls.isSupported()) {
      if (hlsRef.current) {
        hlsRef.current.destroy();
      }
      const hls = new Hls();
      hlsRef.current = hls;
      hls.loadSource(url);
      hls.attachMedia(audio);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        audio.play().catch((e) => console.error("Playback error:", e));
      });
    } else if (audio.canPlayType("application/vnd.apple.mpegurl")) {
      audio.src = url;
      audio.play().catch((e) => console.error("Playback error:", e));
    }
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("ended", handleEnded);
    };
  }, []);

  useEffect(() => {
    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
      }
    };
  }, []);

  return (
    <div className="h-[100dvh] w-full flex flex-col md:flex-row relative bg-white overflow-hidden">
      {/* Centered Logo Overlay */}
      <div className="absolute top-6 left-6 z-20 mix-blend-difference pointer-events-none">
        <div className="text-white font-bold tracking-tighter text-xl">
          MPBC
        </div>
      </div>

      {/* Hidden Audio Element */}
      <audio ref={audioRef} className="hidden" />

      {stations.map((st, index) => {
        const isActive = activeId === st.id;
        const isStationPlaying = isActive && isPlaying;
        
        return (
          <button
            key={st.id}
            onClick={() => togglePlay(st.streams[0].url, st.name, st.id)}
            className={`
              relative flex-1 w-full h-full flex flex-col items-center justify-center
              transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]
              group overflow-hidden
              ${isActive 
                ? "flex-[1.5] bg-black text-white" 
                : "flex-1 bg-white text-black hover:bg-gray-50"
              }
              ${index === 0 ? "border-b md:border-b-0 md:border-r border-gray-100" : ""}
            `}
          >
            {/* Background Number for style */}
            <div className={`
              absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none select-none
              transition-opacity duration-700
              ${isActive ? "opacity-10" : "opacity-[0.03]"}
            `}>
              <span className="text-[40vh] leading-none font-bold tracking-tighter transform translate-y-4">
                {st.id.includes('1296') ? '1' : '2'}
              </span>
            </div>

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center gap-6 transition-transform duration-500">
              <div className="space-y-2 text-center">
                <div className={`text-xs font-medium tracking-[0.3em] uppercase transition-colors duration-300 ${isActive ? "text-gray-400" : "text-gray-400"}`}>
                  {st.id.includes('1296') ? 'Station One' : 'Station Two'}
                </div>
                <div className="text-5xl md:text-7xl font-light tracking-tight font-mono">
                  {st.id.includes('1296') ? '1296' : '855'}
                </div>
                <div className={`text-sm tracking-widest uppercase opacity-60 ${isActive ? "text-gray-400" : "text-gray-500"}`}>
                  AM Radio
                </div>
              </div>

              {/* Play Button/Indicator */}
              <div className={`
                mt-8 w-16 h-16 rounded-full flex items-center justify-center border
                transition-all duration-500
                ${isActive 
                  ? "border-white bg-white text-black scale-110" 
                  : "border-black/10 text-black group-hover:border-black group-hover:scale-105"
                }
              `}>
                {isStationPlaying ? (
                  <div className="flex gap-1.5 h-5">
                    <span className="w-1.5 bg-black animate-[music-bar_1s_ease-in-out_infinite]" />
                    <span className="w-1.5 bg-black animate-[music-bar_1s_ease-in-out_infinite_0.2s]" />
                    <span className="w-1.5 bg-black animate-[music-bar_1s_ease-in-out_infinite_0.4s]" />
                  </div>
                ) : (
                   <svg className="w-6 h-6 translate-x-0.5" fill="currentColor" viewBox="0 0 24 24">
                     <path d="M8 5v14l11-7z" />
                   </svg>
                )}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}

