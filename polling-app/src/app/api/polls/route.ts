import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { supabase } from "@/lib/supabase";

/**
 * Zod schema for poll validation.
 * 
 * Defines the structure and validation rules for poll creation:
 * - Title: Required, 1-100 characters
 * - Description: Optional, max 500 characters
 * - Options: Array of 2-10 non-empty strings
 * 
 * This schema is used for both client-side and server-side validation
 * to ensure data integrity and provide consistent error messages.
 */
const pollSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title must be less than 100 characters"),
  description: z.string().max(500, "Description must be less than 500 characters").optional(),
  options: z.array(z.string().min(1, "Option cannot be empty")).min(2, "At least 2 options are required").max(10, "Maximum 10 options allowed"),
});

/**
 * Creates a new poll with options in the database.
 * 
 * This endpoint handles poll creation with the following workflow:
 * 1. Validates the request body using Zod schema
 * 2. Creates the poll record in the 'polls' table
 * 3. Creates associated poll options in the 'poll_options' table
 * 4. Returns the complete poll data with options
 * 
 * The operation is atomic - if poll options fail to create, the poll
 * is automatically deleted to maintain data consistency.
 * 
 * @param {NextRequest} request - The incoming HTTP request
 * @returns {Promise<NextResponse>} JSON response with created poll or error
 * 
 * @example
 * POST /api/polls
 * {
 *   "title": "Favorite Programming Language",
 *   "description": "What's your go-to language?",
 *   "options": ["JavaScript", "Python", "TypeScript"]
 * }
 */
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

/**
 * Retrieves all polls with their options and vote counts.
 * 
 * This endpoint fetches all polls from the database, including their
 * associated options and current vote counts. The data is transformed
 * to match the frontend's expected format and sorted by creation date
 * (newest first).
 * 
 * The response includes:
 * - Poll metadata (id, title, description, timestamps)
 * - All poll options with current vote counts
 * - Calculated total votes across all options
 * 
 * @returns {Promise<NextResponse>} JSON response with polls array or error
 * 
 * @example
 * GET /api/polls
 * Response: [
 *   {
 *     "id": "uuid",
 *     "title": "Favorite Language",
 *     "description": "What's your go-to?",
 *     "options": [
 *       { "id": "opt1", "text": "JavaScript", "votes": 15 },
 *       { "id": "opt2", "text": "Python", "votes": 12 }
 *     ],
 *     "createdAt": "2024-01-01T00:00:00Z",
 *     "totalVotes": 27
 *   }
 * ]
 */
export async function GET() {
  try {
    // Fetch polls with their options using Supabase's relational query
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

    // Transform the data to match the expected frontend format
    // This ensures consistency between database schema and UI expectations
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
      // Calculate total votes by summing all option votes
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
