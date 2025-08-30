import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const pollSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title must be less than 100 characters"),
  description: z.string().max(500, "Description must be less than 500 characters").optional(),
  options: z.array(z.string().min(1, "Option cannot be empty")).min(2, "At least 2 options are required").max(10, "Maximum 10 options allowed"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate the request body
    const validatedData = pollSchema.parse(body);
    
    // TODO: Add Supabase integration here
    // For now, we'll simulate a successful response
    const mockPoll = {
      id: `poll_${crypto.randomUUID()}`,
      title: validatedData.title,
      description: validatedData.description || "",
      options: validatedData.options.map((option, index) => ({
        id: `option_${index}`,
        text: option,
        votes: 0,
      })),
      createdAt: new Date().toISOString(),
      totalVotes: 0,
    };

    return NextResponse.json(mockPoll, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }
    
    console.error("Error creating poll:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // TODO: Add Supabase integration here
    // For now, return empty array
    return NextResponse.json([]);
  } catch (error) {
    console.error("Error fetching polls:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
