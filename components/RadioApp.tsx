"use client";

import { useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import { stations, Station } from "@/lib/data";

export default function RadioApp() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const [nowPlaying, setNowPlaying] = useState("Select a station");
  const [activeId, setActiveId] = useState<string | null>(null);

  const play = (url: string, name: string, id: string) => {
    setNowPlaying("Playing: " + name);
    setActiveId(id);

    const audio = audioRef.current;
    if (!audio) return;

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

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
      }
    };
  }, []);

  return (
    <div className="max-w-[600px] mx-auto p-5 font-sans">
      <div className="sticky top-0 bg-white py-2.5 border-b border-gray-200 mb-5 z-10">
        <div className="mb-[5px] text-[0.9em]">{nowPlaying}</div>
        <audio ref={audioRef} controls className="w-full" />
      </div>

      <div id="stations-list">
        {stations.map((st) => (
          <div key={st.id} className="mb-[30px]">
            <button
              className={`
                w-full p-[30px] text-[1.5rem] font-bold border-2 border-[#333] text-left cursor-pointer transition-colors
                ${
                  activeId === `main-${st.id}`
                    ? "bg-[#333] text-white"
                    : "bg-[#f4f4f4] hover:bg-[#e0e0e0] text-black"
                }
              `}
              onClick={() => play(st.streams[0].url, st.name, `main-${st.id}`)}
            >
              {st.name}
            </button>

            <div className="border-l-2 border-r-2 border-b-2 border-[#333] p-[10px]">
              {st.streams.map((s, idx) => {
                const uniqueId = `variant-${st.id}-${idx}`;
                return (
                  <div
                    key={idx}
                    className={`
                      flex justify-between p-2 cursor-pointer border-b border-[#eee] last:border-b-0
                      ${
                        activeId === uniqueId
                          ? "bg-[#333] text-white"
                          : "hover:bg-[#f9f9f9]"
                      }
                    `}
                    onClick={(e) => {
                      e.stopPropagation();
                      play(
                        s.url,
                        `${st.name} (${s.role})`,
                        uniqueId
                      );
                    }}
                  >
                    <span>{s.role}</span>
                    <span
                      className={`text-[0.8em] ${
                        activeId === uniqueId ? "text-gray-300" : "text-[#888]"
                      }`}
                    >
                      HLS
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

