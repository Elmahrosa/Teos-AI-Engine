import { NextResponse } from "next/server";
import { getSessionEmail } from "@/lib/session";
import { isAdminEmail } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();
    
    // Security Check: Only allow logged-in users
    const email = await getSessionEmail();
    if (!email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // AI Generation Logic (Using Pollinations for high-speed launch)
    const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=1024&height=1024&nologo=true&seed=${Math.floor(Math.random() * 1000000)}`;
    
    return NextResponse.json({ 
      success: true, 
      url: imageUrl 
    });
    
  } catch (error) {
    console.error("[image-gen] error:", error);
    return NextResponse.json({ error: "Image generation failed" }, { status: 500 });
  }
}