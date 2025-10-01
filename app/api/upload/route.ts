// app/api/upload/route.ts
import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const files = formData.getAll("files");

    if (!files || files.length === 0) {
      return NextResponse.json({ success: false, message: "No files uploaded." }, { status: 400 });
    }

    const uploadedUrls: string[] = [];

    for (const file of files) {
      if (file instanceof File) {
        const buffer = await file.arrayBuffer();
        const array = new Uint8Array(buffer);

        const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
        const filePath = path.join(process.cwd(), 'public', 'images', filename);

        await writeFile(filePath, Buffer.from(array));
        uploadedUrls.push(`/images/${filename}`);
      }
    }

    return NextResponse.json({ success: true, urls: uploadedUrls });

  } catch (error) {
    console.error('Error during file upload:', error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}
