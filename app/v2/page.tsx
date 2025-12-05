"use client";

import React, { useEffect, useRef, useState } from "react";
import { Play } from "lucide-react";
import Hls from "hls.js";
import { stations } from "@/lib/data";

const FeatureSection = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Map stations to display format with logo paths
  const radioStations = stations.map((station, index) => {
    // Map station IDs to their logo files
    const logoMap: Record<string, string> = {
      "ming-pen-am1296": "/stations/mingpen1296.png",
      "ming-pen-am855": "/stations/mingpen855.png",
    };

    return {
      id: station.id,
      title: station.name.toUpperCase(),
      description: `STATION ${index + 1} - ${station.genres
        .join(", ")
        .toUpperCase()}. BROADCASTING FROM ${station.country.toUpperCase()} IN ${station.language.toUpperCase()}.`,
      image: logoMap[station.id] || `/logo-${station.id}.png`,
      streamUrl:
        station.streams.find((s) => s.role === "master")?.url ||
        station.streams[0].url,
    };
  });

  const togglePlay = (url: string, id: string) => {
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
    <div className="min-h-screen bg-[#F4F4F4] text-black font-mono flex flex-col items-center py-16 px-4 md:px-8">
      {/* Hidden Audio Element */}
      <audio ref={audioRef} className="hidden" />

      {/* Main Header */}
      <div className="bg-black text-white px-8 py-2 text-3xl md:text-4xl tracking-wide mb-12">
        ACROSS THE AIRWAVES
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full">
        {radioStations.map((station, index) => {
          const isActive = activeId === station.id;
          const isStationPlaying = isActive && isPlaying;

          return (
            <div key={station.id} className="flex flex-col">
              {/* Card Container */}
              <div
                className={`bg-white rounded-lg overflow-hidden shadow-sm border-2 transition-all duration-300 ${
                  isStationPlaying
                    ? "border-[#FF4400] shadow-lg shadow-[#FF4400]/20"
                    : isActive
                    ? "border-black"
                    : "border-gray-200"
                }`}
              >
                {/* Card Header */}
                <div
                  className={`p-3 flex justify-between items-center transition-colors ${
                    isStationPlaying
                      ? "bg-[#FF4400] text-white"
                      : isActive
                      ? "bg-black text-white"
                      : "bg-black text-white"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {/* Number Circle Icon */}
                    <div
                      className={`w-6 h-6 rounded-full border flex items-center justify-center text-xs transition-colors ${
                        isStationPlaying
                          ? "border-white bg-white text-[#FF4400]"
                          : "border-white"
                      }`}
                    >
                      {index + 1}
                    </div>
                    <span className="tracking-widest text-sm font-medium">
                      {station.title}
                    </span>
                  </div>
                  <button
                    onClick={() => togglePlay(station.streamUrl, station.id)}
                    className="hover:opacity-70 transition-opacity"
                  >
                    {isStationPlaying ? (
                      <div className="flex gap-1 h-4 items-end">
                        <span className="w-1 bg-white h-3 animate-[music-bar_1s_ease-in-out_infinite]" />
                        <span className="w-1 bg-white h-4 animate-[music-bar_1s_ease-in-out_infinite_0.2s]" />
                        <span className="w-1 bg-white h-3 animate-[music-bar_1s_ease-in-out_infinite_0.4s]" />
                      </div>
                    ) : (
                      <Play fill="white" size={16} />
                    )}
                  </button>
                </div>

                {/* Image Area */}
                <div
                  className="aspect-[4/3] bg-gray-100 relative overflow-hidden group cursor-pointer"
                  onClick={() => togglePlay(station.streamUrl, station.id)}
                >
                  <img
                    src={station.image}
                    alt={station.title}
                    className={`w-full h-full object-cover contrast-125 transition-all duration-500 ${
                      isStationPlaying
                        ? "grayscale-0 brightness-110"
                        : "grayscale hover:grayscale-0"
                    }`}
                    onError={(e) => {
                      // Fallback if logo doesn't exist yet
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                  {/* Overlay gradient to simulate the sleek look */}
                  <div
                    className={`absolute inset-0 mix-blend-multiply pointer-events-none transition-all duration-300 ${
                      isStationPlaying ? "bg-[#FF4400]/10" : "bg-black/5"
                    }`}
                  ></div>
                  {/* Playing indicator overlay */}
                  {isStationPlaying && (
                    <div className="absolute top-2 right-2 bg-[#FF4400] text-white px-2 py-1 text-[10px] font-bold tracking-wider uppercase">
                      LIVE
                    </div>
                  )}
                  {!station.image && (
                    <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-xs">
                      LOGO COMING SOON
                    </div>
                  )}
                </div>
              </div>

              {/* Caption Text */}
              <div className="mt-4 text-[10px] md:text-[11px] leading-tight text-gray-800 uppercase tracking-wide">
                {station.description}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FeatureSection;
