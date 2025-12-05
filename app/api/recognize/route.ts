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

    // Wait 5 seconds to ensure we get a fresh segment with content
    await new Promise((resolve) => setTimeout(resolve, 5000));

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
    
    // Try to combine multiple segments for a longer sample (increases chance of finding music)
    const MIN_SEGMENT_SIZE = 10000; // At least 10KB per segment
    const segmentsToTry = Math.min(mediaSegments.length, 5); // Try up to 5 segments
    const segmentsToCombine = Math.min(3, segmentsToTry); // Combine up to 3 segments
    
    // Try different combinations: start from beginning, middle, and end
    const tryIndices = [
      // Try first few segments
      Array.from({ length: segmentsToCombine }, (_, i) => i),
      // Try middle segments
      Array.from({ length: segmentsToCombine }, (_, i) => 
        Math.floor(segmentsToTry / 2) + i - Math.floor(segmentsToCombine / 2)
      ).filter(idx => idx >= 0 && idx < segmentsToTry),
      // Try last few segments
      Array.from({ length: segmentsToCombine }, (_, i) => 
        segmentsToTry - segmentsToCombine + i
      ).filter(idx => idx >= 0),
    ];

    let bestResult: any = null;
    let audioBuffer: ArrayBuffer | null = null;

    // Try each combination of segments
    for (const indices of tryIndices) {
      if (indices.length === 0) continue;

      const segmentBuffers: ArrayBuffer[] = [];
      
      // Fetch and validate segments
      for (const idx of indices) {
        if (idx >= mediaSegments.length) continue;
        
        const segmentName = mediaSegments[idx];
        const segmentUrl = `${baseUrl}/${segmentName}`;

        try {
          const segmentResponse = await fetch(segmentUrl);
          if (!segmentResponse.ok) {
            continue;
          }

          const buffer = await segmentResponse.arrayBuffer();
          
          // Validate the segment has meaningful content
          if (buffer.byteLength >= MIN_SEGMENT_SIZE) {
            segmentBuffers.push(buffer);
          }
        } catch (error) {
          console.error(`Failed to fetch segment ${segmentName}:`, error);
          continue;
        }
      }

      if (segmentBuffers.length === 0) continue;

      // Combine segments into one buffer
      const totalLength = segmentBuffers.reduce((sum, buf) => sum + buf.byteLength, 0);
      const combinedBuffer = new Uint8Array(totalLength);
      let offset = 0;
      for (const buf of segmentBuffers) {
        combinedBuffer.set(new Uint8Array(buf), offset);
        offset += buf.byteLength;
      }

      audioBuffer = combinedBuffer.buffer;

      // Try recognition with this combined segment
      const formData = new FormData();
      const blob = new Blob([audioBuffer], { type: "audio/aac" });
      formData.append("file", blob, "segment.aac");
      formData.append("api_token", process.env.AUDD_API_KEY || "");
      formData.append("return", "apple_music,spotify");

      try {
        const auddResponse = await fetch("https://api.audd.io/", {
          method: "POST",
          body: formData,
        });

        const result = await auddResponse.json();
        
        // If we got a match, return it immediately
        if (result.status === "success" && result.result) {
          return NextResponse.json(result);
        }
        
        // Keep track of the best result so far
        if (!bestResult) {
          bestResult = result;
        }
      } catch (error) {
        console.error(`Recognition attempt failed:`, error);
        continue;
      }
    }

    // If we tried multiple combinations but got no match, return the last result
    if (bestResult) {
      return NextResponse.json(bestResult);
    }

    // If no valid segments were found
    if (!audioBuffer || audioBuffer.byteLength < MIN_SEGMENT_SIZE) {
      return NextResponse.json(
        { 
          status: "success",
          result: null,
          error: { error_message: "No valid audio segments found with sufficient content" }
        },
        { status: 200 }
      );
    }

    // This should not be reached if we found a match above, but handle it just in case
    return NextResponse.json({
      status: "success",
      result: null,
    });
  } catch (error) {
    console.error("Recognition error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: String(error) },
      { status: 500 }
    );
  }
}

