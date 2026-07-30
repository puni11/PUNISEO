import { NextRequest, NextResponse } from "next/server";
import { runLinkAudit } from "@/lib/seo/linkinator";

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();

    if (!url) {
      return NextResponse.json(
        { error: "URL is required" },
        { status: 400 }
      );
    }

    const result = await runLinkAudit(url);

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json(
      {
        error: error.message,
      },
      {
        status: 500,
      }
    );
  }
}