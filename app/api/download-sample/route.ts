import { NextRequest, NextResponse } from "next/server";
import { stations } from "@/lib/data";

export async function POST(request: NextRequest) {
  try {
    const { stationId } = await request.json();

    if (!stationId) {
      return NextResponse.json(
        { error: "Station ID is required" },
        { status: 400 }
      );
    }

    const station = stations.find((s) => s.id === stationId);
    if (!station) {
      return NextResponse.json(
        { error: "Station not found" },
        { status: 404 }
      );
    }

    // Get the chunklist URL
    const chunklistUrl =
      station.streams.find((s) => s.role === "variant")?.url ||
      station.streams.find((s) => s.type === "HLS")?.url;

    if (!chunklistUrl) {
      return NextResponse.json(
        { error: "Chunklist URL not found" },
        { status: 404 }
      );
    }

    // Fetch the chunklist to get available segments
    const chunklistResponse = await fetch(chunklistUrl);
    const chunklistText = await chunklistResponse.text();

    // Extract all media segments
    const lines = chunklistText.split("\n");
    const mediaSegments = lines
      .filter((line) => /^media_\d+\.aac$/.test(line.trim()))
      .map((line) => line.trim());

    if (mediaSegments.length === 0) {
      return NextResponse.json(
        { error: "No media segments found" },
        { status: 404 }
      );
    }

    const baseUrl = chunklistUrl.substring(0, chunklistUrl.lastIndexOf("/"));
    const MIN_SEGMENT_SIZE = 10000;
    
    // Get just one segment (5-10 seconds)
    let audioBuffer: ArrayBuffer | null = null;
    const segmentName = mediaSegments[0]; // Use the first (most recent) segment
    const segmentUrl = `${baseUrl}/${segmentName}`;

    try {
      const segmentResponse = await fetch(segmentUrl);
      if (!segmentResponse.ok) {
        return NextResponse.json(
          { error: "Failed to fetch segment" },
          { status: 500 }
        );
      }

      audioBuffer = await segmentResponse.arrayBuffer();
      
      if (audioBuffer.byteLength < MIN_SEGMENT_SIZE) {
        return NextResponse.json(
          { error: "Segment too small" },
          { status: 500 }
        );
      }
    } catch (error) {
      console.error(`Failed to fetch segment ${segmentName}:`, error);
      return NextResponse.json(
        { error: "Failed to fetch segment" },
        { status: 500 }
      );
    }

    // Return the audio file
    return new NextResponse(audioBuffer, {
      headers: {
        "Content-Type": "audio/aac",
        "Content-Disposition": `attachment; filename="radio-sample-${stationId}-${Date.now()}.aac"`,
        "Content-Length": audioBuffer.byteLength.toString(),
      },
    });
  } catch (error) {
    console.error("Download error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: String(error) },
      { status: 500 }
    );
  }
}

