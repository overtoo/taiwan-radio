"use client";

import React, { useEffect, useRef, useState } from "react";
import { Play, Music, Loader2, Download } from "lucide-react";
import Hls from "hls.js";
import { stations } from "@/lib/data";

interface RecognitionResult {
  status: string;
  result?: {
    artist?: string;
    title?: string;
    album?: string;
    release_date?: string;
    label?: string;
    timecode?: string;
    song_link?: string;
    spotify?: {
      external_urls: { spotify: string };
    };
    apple_music?: {
      url: string;
    };
  } | null;
  error?: {
    error_message?: string;
  };
}

const FeatureSection = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recognitionData, setRecognitionData] = useState<
    Record<string, RecognitionResult>
  >({});
  const [loadingRecognition, setLoadingRecognition] = useState<
    Record<string, boolean>
  >({});

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

  const fetchRecognition = async (stationId: string) => {
    setLoadingRecognition((prev) => ({ ...prev, [stationId]: true }));
    try {
      const response = await fetch("/api/recognize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ stationId }),
      });

      const data = await response.json();
      setRecognitionData((prev) => ({ ...prev, [stationId]: data }));
    } catch (error) {
      console.error("Recognition error:", error);
      setRecognitionData((prev) => ({
        ...prev,
        [stationId]: {
          status: "error",
          error: { error_message: "Failed to fetch recognition" },
        },
      }));
    } finally {
      setLoadingRecognition((prev) => ({ ...prev, [stationId]: false }));
    }
  };

  const downloadSample = async (stationId: string) => {
    try {
      const response = await fetch("/api/download-sample", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ stationId }),
      });

      if (!response.ok) {
        throw new Error("Failed to download sample");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `radio-sample-${stationId}-${Date.now()}.aac`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Download error:", error);
      alert("Failed to download sample");
    }
  };

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
                  className={`p-1.5 md:p-3 flex justify-between items-center transition-colors ${
                    isStationPlaying
                      ? "bg-[#FF4400] text-white"
                      : isActive
                      ? "bg-black text-white"
                      : "bg-black text-white"
                  }`}
                >
                  <div className="flex items-center gap-1 md:gap-3 min-w-0">
                    {/* Number Circle Icon */}
                    <div
                      className={`w-4 h-4 md:w-6 md:h-6 rounded-full border flex items-center justify-center text-[8px] md:text-xs transition-colors flex-shrink-0 ${
                        isStationPlaying
                          ? "border-white bg-white text-[#FF4400]"
                          : "border-white"
                      }`}
                    >
                      {index + 1}
                    </div>
                    <span className="tracking-widest text-[8px] md:text-sm font-medium truncate">
                      {station.title}
                    </span>
                  </div>
                  <button
                    onClick={() => togglePlay(station.streamUrl, station.id)}
                    className="hover:opacity-70 transition-opacity flex-shrink-0"
                  >
                    {isStationPlaying ? (
                      <div className="flex gap-0.5 md:gap-1 h-3 md:h-4 items-end">
                        <span className="w-0.5 md:w-1 bg-white h-2 md:h-3 animate-[music-bar_1s_ease-in-out_infinite]" />
                        <span className="w-0.5 md:w-1 bg-white h-3 md:h-4 animate-[music-bar_1s_ease-in-out_infinite_0.2s]" />
                        <span className="w-0.5 md:w-1 bg-white h-2 md:h-3 animate-[music-bar_1s_ease-in-out_infinite_0.4s]" />
                      </div>
                    ) : (
                      <Play
                        fill="white"
                        className="w-2.5 h-2.5 md:w-4 md:h-4"
                      />
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
                    <div className="absolute top-1 right-1 md:top-2 md:right-2 bg-[#FF4400] text-white px-1 py-0.5 md:px-2 md:py-1 text-[6px] md:text-[10px] font-bold tracking-wider uppercase">
                      LIVE
                    </div>
                  )}
                  {!station.image && (
                    <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-xs">
                      LOGO COMING SOON
                    </div>
                  )}
                </div>

                {/* Recognition Button */}
                <div className="p-2 md:p-3 border-t border-gray-200">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      fetchRecognition(station.id);
                    }}
                    disabled={loadingRecognition[station.id]}
                    className="w-full bg-black hover:bg-gray-800 text-white px-3 py-2 md:px-4 md:py-2 text-[10px] md:text-xs font-medium tracking-wide uppercase transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loadingRecognition[station.id] ? (
                      <>
                        <Loader2 className="w-3 h-3 md:w-4 md:h-4 animate-spin" />
                        <span>RECOGNIZING...</span>
                      </>
                    ) : (
                      <>
                        <Music className="w-3 h-3 md:w-4 md:h-4" />
                        <span>WHAT&apos;S PLAYING?</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Recognition Results */}
                {recognitionData[station.id] &&
                  (() => {
                    const recognition = recognitionData[station.id];
                    const result = recognition.result;

                    return (
                      <div className="p-2 md:p-3 border-t border-gray-200 bg-gray-50">
                        {recognition.status === "success" && result ? (
                          <div className="space-y-1 md:space-y-2">
                            <div className="text-[10px] md:text-xs font-bold text-[#FF4400] uppercase tracking-wide">
                              NOW PLAYING
                            </div>
                            <div className="text-xs md:text-sm font-semibold text-black">
                              {result.title}
                            </div>
                            <div className="text-[10px] md:text-xs text-gray-600">
                              {result.artist}
                            </div>
                            {result.album && (
                              <div className="text-[9px] md:text-[10px] text-gray-500">
                                {result.album}
                              </div>
                            )}
                            <div className="flex gap-2 mt-2 pt-2 border-t border-gray-200 items-center justify-between">
                              <div className="flex gap-2">
                                {result.spotify?.external_urls?.spotify && (
                                  <a
                                    href={result.spotify.external_urls.spotify}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[9px] md:text-[10px] text-[#1DB954] hover:underline"
                                  >
                                    SPOTIFY
                                  </a>
                                )}
                                {result.apple_music?.url && (
                                  <a
                                    href={result.apple_music.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[9px] md:text-[10px] text-blue-600 hover:underline"
                                  >
                                    APPLE MUSIC
                                  </a>
                                )}
                              </div>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  downloadSample(station.id);
                                }}
                                className="text-[9px] md:text-[10px] text-gray-600 hover:text-black transition-colors flex items-center gap-1"
                                title="Download audio sample"
                              >
                                <Download className="w-3 h-3" />
                                <span>DOWNLOAD</span>
                              </button>
                            </div>
                          </div>
                        ) : recognition.status === "success" && !result ? (
                          <div className="space-y-2">
                            <div className="text-[10px] md:text-xs text-gray-500">
                              No music recognized. Try again in a few seconds.
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                downloadSample(station.id);
                              }}
                              className="text-[9px] md:text-[10px] text-gray-600 hover:text-black transition-colors flex items-center gap-1"
                              title="Download audio sample"
                            >
                              <Download className="w-3 h-3" />
                              <span>DOWNLOAD SAMPLE</span>
                            </button>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <div className="text-[10px] md:text-xs text-red-600">
                              {recognition.error?.error_message ||
                                "Recognition failed"}
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                downloadSample(station.id);
                              }}
                              className="text-[9px] md:text-[10px] text-gray-600 hover:text-black transition-colors flex items-center gap-1"
                              title="Download audio sample"
                            >
                              <Download className="w-3 h-3" />
                              <span>DOWNLOAD SAMPLE</span>
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })()}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FeatureSection;
