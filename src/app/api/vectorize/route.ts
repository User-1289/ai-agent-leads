import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
const openai = new OpenAI();

export async function POST(request: NextRequest) {
  const { text } = await request.json();
  if (!text) {
    return NextResponse.json({ error: "Missing text parameter" }, { status: 400 });
  }

  try {
    const embedding = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: text,
      encoding_format: "float",
    });
    return NextResponse.json(embedding);
  } catch (error) {
    console.error("Error fetching embeddings:", error);
    return NextResponse.json({ error: "Failed to fetch embeddings" }, { status: 500 });
  }
}