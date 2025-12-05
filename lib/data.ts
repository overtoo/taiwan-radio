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
  },
  {
    id: "bcc-i-radio",
    name: "BCC I Radio Broadcasting Corporation of China",
    country: "Taiwan",
    language: "Chinese",
    genres: ["Adult Contemporary", "Chinese", "Oldies", "Pop"],
    sourcePages: [
      "https://dimaradio.com/asia/taiwan/bcc-i-radio-broadcasting-corporation-of-china-online"
    ],
    streams: [
      {
        type: "MP3",
        role: "master",
        url: "https://stream.rcs.revma.com/ndk05tyy2tzuv"
      }
    ]
  },
  {
    id: "hakka-radio",
    name: "Hakka Radio",
    country: "Taiwan",
    language: "Chinese",
    genres: ["Adult Contemporary", "Chinese", "Oldies", "Pop"],
    sourcePages: [
      "https://dimaradio.com/asia/taiwan/hakka-radio-online"
    ],
    streams: [
      {
        type: "HLS",
        role: "master",
        url: "https://n19a-eu.rcs.revma.com/akqrbx94gbkvv/25_8uocrxlx6fd202/playlist.m3u8"
      }
    ]
  },
  {
    id: "bcc-country",
    name: "BCC Country Broadcasting Corporation of China",
    country: "Taiwan",
    language: "Chinese",
    genres: ["Adult Contemporary", "Chinese", "Oldies", "Pop"],
    sourcePages: [
      "https://dimaradio.com/asia/taiwan/bcc-country-broadcasting-corporation-of-china-online"
    ],
    streams: [
      {
        type: "MP3",
        role: "master",
        url: "https://stream.rcs.revma.com/p2e3rfg3qtzuv"
      }
    ]
  },
  {
    id: "shrs-fm",
    name: "SHRS FM",
    country: "Taiwan",
    language: "Chinese",
    genres: ["College", "Chinese", "Top 40"],
    sourcePages: [
      "https://dimaradio.com/asia/taiwan/shrs-fm-online"
    ],
    streams: [
      {
        type: "HLS",
        role: "master",
        url: "https://stream.ginnet.cloud/live0115lo-89xv/_definst_/fm881/playlist.m3u8"
      }
    ]
  },
  {
    id: "chengsheng-broadcasting-music",
    name: "Chengsheng Broadcasting Music Web Radio",
    country: "Taiwan",
    language: "Chinese",
    genres: ["Chinese", "Hits"],
    sourcePages: [
      "https://dimaradio.com/asia/taiwan/chengsheng-broadcasting-music-web-radio-online"
    ],
    streams: [
      {
        type: "HLS",
        role: "master",
        url: "https://flv.ccdntech.com/live/_definst_/mp4:vod117_Live/live2/playlist.m3u8"
      }
    ]
  },
  {
    id: "jia-yin-classic-radio",
    name: "Jia Yin Classic Radio",
    country: "Taiwan",
    language: "Chinese",
    genres: ["Chinese", "Classical", "Instrumental", "Lite Pop"],
    sourcePages: [
      "https://dimaradio.com/asia/taiwan/jia-yin-classic-radio-online"
    ],
    streams: [
      {
        type: "HLS",
        role: "master",
        url: "https://stream.ginnet.cloud/live0119lo-p4rb/_definst_/classic/playlist.m3u8"
      }
    ]
  },
  {
    id: "gogoradio",
    name: "GogoRadio",
    country: "Taiwan",
    language: "Chinese",
    genres: ["Adult Contemporary", "Chinese", "Lite Pop", "Pop"],
    sourcePages: [
      "https://dimaradio.com/asia/taiwan/gogoradio-online"
    ],
    streams: [
      {
        type: "HLS",
        role: "master",
        url: "https://stream.ginnet.cloud/live0119lo-p4rb/_definst_/fm1043/playlist.m3u8"
      }
    ]
  },
  {
    id: "tbs-am",
    name: "TBS AM",
    country: "Taiwan",
    language: "Chinese",
    genres: ["Culture", "News"],
    sourcePages: [
      "https://dimaradio.com/asia/taiwan/tbs-am-online"
    ],
    streams: [
      {
        type: "HLS",
        role: "master",
        url: "https://stream.ginnet.cloud/live0130lo-yfyo/_definst_/am/playlist.m3u8"
      }
    ]
  },
  {
    id: "tbs-2",
    name: "TBS 2",
    country: "Taiwan",
    language: "Chinese",
    genres: ["Culture", "News"],
    sourcePages: [
      "https://dimaradio.com/asia/taiwan/tbs-2-online"
    ],
    streams: [
      {
        type: "HLS",
        role: "master",
        url: "https://stream.ginnet.cloud/live0130lo-yfyo/_definst_/fm/playlist.m3u8"
      }
    ]
  },
  {
    id: "pbs-taipei",
    name: "Police Broadcasting Service PBS Taipei Sub Station",
    country: "Taiwan",
    language: "Chinese",
    genres: ["Chinese", "News", "Politics", "Weather"],
    sourcePages: [
      "https://dimaradio.com/asia/taiwan/police-broadcasting-service-pbs-taipei-sub-stati-online"
    ],
    streams: [
      {
        type: "HLS",
        role: "master",
        url: "https://stream.pbs.gov.tw/live/TPS/playlist.m3u8"
      }
    ]
  },
  {
    id: "pbs-national-transpo",
    name: "Police Broadcasting Service PBS National Transpo",
    country: "Taiwan",
    language: "Chinese",
    genres: ["Chinese", "News", "Politics", "Pop"],
    sourcePages: [
      "https://dimaradio.com/asia/taiwan/police-broadcasting-service-pbs-national-transpo-online"
    ],
    streams: [
      {
        type: "HLS",
        role: "master",
        url: "https://stream.pbs.gov.tw/live/mp3:PBS/playlist.m3u8"
      }
    ]
  },
  {
    id: "pbs-kaohsiung",
    name: "Police Broadcasting Service PBS Kaohsiung Sub Station",
    country: "Taiwan",
    language: "Chinese",
    genres: ["Chinese", "News", "Politics", "Pop"],
    sourcePages: [
      "https://dimaradio.com/asia/taiwan/police-broadcasting-service-pbs-kaohsiung-sub-st-online"
    ],
    streams: [
      {
        type: "HLS",
        role: "master",
        url: "https://stream.pbs.gov.tw/live/KSS/playlist.m3u8"
      }
    ]
  },
  {
    id: "pbs-hualien",
    name: "Police Broadcast Service PBS Hualien Sub Station",
    country: "Taiwan",
    language: "Chinese",
    genres: ["Chinese", "News", "Politics", "Weather"],
    sourcePages: [
      "https://dimaradio.com/asia/taiwan/police-broadcast-service-pbs-hualien-sub-station-online"
    ],
    streams: [
      {
        type: "HLS",
        role: "master",
        url: "https://stream.pbs.gov.tw/live/HLS/playlist.m3u8"
      }
    ]
  },
  {
    id: "pbs-yilan",
    name: "Police Broadcasting Service PBS Yilan Sub Station",
    country: "Taiwan",
    language: "Chinese",
    genres: ["Chinese", "News", "Politics", "Pop"],
    sourcePages: [
      "https://dimaradio.com/asia/taiwan/police-broadcasting-service-pbs-yilan-sub-statio-online"
    ],
    streams: [
      {
        type: "HLS",
        role: "master",
        url: "https://stream.pbs.gov.tw/live/ELS/playlist.m3u8"
      }
    ]
  }
];

