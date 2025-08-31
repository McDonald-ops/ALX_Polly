import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { supabase } from "@/lib/supabase";

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
    
    // Create the poll in Supabase
    const { data: poll, error: pollError } = await supabase
      .from('polls')
      .insert({
        title: validatedData.title,
        description: validatedData.description || null,
      })
      .select()
      .single();

    if (pollError) {
      console.error("Error creating poll:", pollError);
      
      // If it's a table not found error, provide helpful guidance
      if (pollError.code === 'PGRST205') {
        return NextResponse.json(
          { 
            error: "Database tables not found. Please run the database setup first.",
            details: "See DATABASE_SETUP.md for instructions on creating the required tables.",
            code: "DATABASE_NOT_SETUP"
          },
          { status: 500 }
        );
      }
      
      return NextResponse.json(
        { error: "Failed to create poll", details: pollError.message },
        { status: 500 }
      );
    }

    // Create poll options
    const optionsData = validatedData.options.map(text => ({
      poll_id: poll.id,
      text: text,
    }));

    const { data: options, error: optionsError } = await supabase
      .from('poll_options')
      .insert(optionsData)
      .select();

    if (optionsError) {
      console.error("Error creating poll options:", optionsError);
      // Clean up the poll if options creation fails
      await supabase.from('polls').delete().eq('id', poll.id);
      return NextResponse.json(
        { error: "Failed to create poll options", details: optionsError.message },
        { status: 500 }
      );
    }

    // Return the created poll with options
    const responsePoll = {
      id: poll.id,
      title: poll.title,
      description: poll.description || "",
      options: options.map(option => ({
        id: option.id,
        text: option.text,
        votes: 0,
      })),
      createdAt: poll.created_at,
      totalVotes: 0,
    };

    return NextResponse.json(responsePoll, { status: 201 });
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
    const { data: polls, error } = await supabase
      .from('polls')
      .select(`
        *,
        poll_options (
          id,
          text,
          votes
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Error fetching polls:", error);
      return NextResponse.json(
        { error: "Failed to fetch polls" },
        { status: 500 }
      );
    }

    // Transform the data to match the expected format
    const transformedPolls = polls.map(poll => ({
      id: poll.id,
      title: poll.title,
      description: poll.description || "",
      options: poll.poll_options.map((option: any) => ({
        id: option.id,
        text: option.text,
        votes: option.votes,
      })),
      createdAt: poll.created_at,
      totalVotes: poll.poll_options.reduce((sum: number, option: any) => sum + option.votes, 0),
    }));

    return NextResponse.json(transformedPolls);
  } catch (error) {
    console.error("Error fetching polls:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
