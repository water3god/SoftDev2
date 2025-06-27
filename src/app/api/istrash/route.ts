import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { imageUrl } = body;

  if (!imageUrl || typeof imageUrl !== "string") {
    return NextResponse.json({ error: "No valid imageUrl provided" }, { status: 400 });
  }

  const apiKey = process.env.GOOGLE_VISION_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "No API key configured" }, { status: 500 });
  }

  try {
    const visionRes = await fetch(
      `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requests: [
            {
              image: { source: { imageUri: imageUrl } },
              features: [{ type: "LABEL_DETECTION", maxResults: 5 }],
            },
          ],
        }),
      }
    );

    const visionData = await visionRes.json();
    console.log(visionData)
    console.log(visionData.statusText == "Forbidden", visionData.statusText)
    if (visionData.error) {
      return NextResponse.json({ error: visionData.error .message}, { status: 500 });
    }
    const labels =
      visionData.responses?.[0]?.labelAnnotations?.map((label: any) => ({
        description: label.description ?? "",
        score: label.score ?? 0,
      })) ?? [];
    return NextResponse.json({ labels });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Vision API error" }, { status: 500 });
  }
}