import fs from "fs";
import { NextResponse } from "next/server";
import path from "path";

export async function GET() {
  const dirPath = path.join(process.cwd(), "public/assets/images/characters/arts");

  try {
    const files = fs.readdirSync(dirPath);

    const images = files
      .filter((file) => /\.(png|jpg|jpeg|webp|gif)$/i.test(file))
      .map((file) => `/assets/images/characters/arts/${file}`);

    return NextResponse.json(images);
  } catch (error) {
    return NextResponse.json({ error: "Failed to read image files" }, { status: 500 });
  }
}
