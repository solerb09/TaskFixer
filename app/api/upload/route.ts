import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const files = formData.getAll("files") as File[];

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: "No files provided" },
        { status: 400 }
      );
    }

    // Upload files to OpenAI
    const uploadedFiles = await Promise.all(
      files.map(async (file) => {
        try {
          // Convert File to Buffer for OpenAI SDK
          const buffer = await file.arrayBuffer();
          const uploadFile = new File([buffer], file.name, { type: file.type });

          // Upload to OpenAI for assistants
          const openaiFile = await openai.files.create({
            file: uploadFile,
            purpose: "assistants",
          });

          return {
            id: openaiFile.id,
            name: file.name,
          };
        } catch (error: any) {
          console.error(`Error uploading file ${file.name}:`, error);
          throw new Error(`Failed to upload ${file.name}: ${error.message}`);
        }
      })
    );

    return NextResponse.json({
      files: uploadedFiles,
    });
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to upload files" },
      { status: 500 }
    );
  }
}
