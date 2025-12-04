export interface Stream {
  type: string;
  role: string;
  url: string;
}

export interface Station {
  id: string;
  name: string;
  country: string;
  language: string;
  genres: string[];
  sourcePages: string[];
  streams: Stream[];
}

export const stations: Station[] = [
  {
    id: "ming-pen-am1296",
    name: "Ming Pen Station One AM1296",
    country: "Taiwan",
    language: "Chinese",
    genres: ["Adult Contemporary", "Oldies", "Pop"],
    sourcePages: [
      "https://dimaradio.com/asia/taiwan/ming-pen-station-one-am1296-online"
    ],
    streams: [
      {
        type: "HLS",
        role: "master",
        url: "https://streamak0134.akamaized.net/live0134lh-5gst/_definst_/am1296/playlist.m3u8"
      },
      {
        type: "HLS",
        role: "variant",
        url: "https://streamak0134.akamaized.net/live0134lh-5gst/_definst_/am1296/chunklist.m3u8"
      }
    ]
  },
  {
    id: "ming-pen-am855",
    name: "Ming Pen Station Two AM855",
    country: "Taiwan",
    language: "Chinese",
    genres: ["Adult Contemporary", "Oldies", "Pop"],
    sourcePages: [
      "https://dimaradio.com/asia/taiwan/ming-pen-station-two-am855-online",
      "https://mingpen.com.tw/page/6"
    ],
    streams: [
      {
        type: "HLS",
        role: "master",
        url: "https://streamak0134.akamaized.net/live0134lh-5gst/_definst_/am855/playlist.m3u8"
      },
      {
        type: "HLS",
        role: "variant",
        url: "https://streamak0134.akamaized.net/live0134lh-5gst/_definst_/am855/chunklist.m3u8"
      }
    ]
  }
];

