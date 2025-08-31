import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { supabase } from "@/lib/supabase";
import { mockPolls } from "@/lib/mockData";

const voteSchema = z.object({
  optionId: z.string().min(1, "Option ID is required"),
});

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    
    // Validate the request body
    const validatedData = voteSchema.parse(body);
    
    // Check if it's a mock poll
    const mockPoll = mockPolls.find(poll => poll.id === params.id);
    if (mockPoll) {
      // For mock polls, simulate voting by updating the mock data
      const updatedMockPoll = {
        ...mockPoll,
        options: mockPoll.options.map(option => 
          option.id === validatedData.optionId 
            ? { ...option, votes: option.votes + 1 }
            : option
        )
      };
      
      // Update total votes
      updatedMockPoll.totalVotes = updatedMockPoll.options.reduce((sum, option) => sum + option.votes, 0);
      
      return NextResponse.json(updatedMockPoll, { status: 200 });
    }
    
    // First, verify that the poll and option exist
    const { data: poll, error: pollError } = await supabase
      .from('polls')
      .select('id')
      .eq('id', params.id)
      .single();

    if (pollError || !poll) {
      return NextResponse.json(
        { error: "Poll not found" },
        { status: 404 }
      );
    }

    const { data: option, error: optionError } = await supabase
      .from('poll_options')
      .select('id, poll_id')
      .eq('id', validatedData.optionId)
      .eq('poll_id', params.id)
      .single();

    if (optionError || !option) {
      return NextResponse.json(
        { error: "Invalid option for this poll" },
        { status: 400 }
      );
    }

    // Create the vote
    const { data: vote, error: voteError } = await supabase
      .from('votes')
      .insert({
        poll_id: params.id,
        option_id: validatedData.optionId,
      })
      .select()
      .single();

    if (voteError) {
      console.error("Error creating vote:", voteError);
      return NextResponse.json(
        { error: "Failed to record vote" },
        { status: 500 }
      );
    }

    // Fetch updated poll data
    const { data: updatedPoll, error: fetchError } = await supabase
      .from('polls')
      .select(`
        *,
        poll_options (
          id,
          text,
          votes
        )
      `)
      .eq('id', params.id)
      .single();

    if (fetchError) {
      console.error("Error fetching updated poll:", fetchError);
      return NextResponse.json(
        { error: "Vote recorded but failed to fetch updated data" },
        { status: 500 }
      );
    }

    // Transform the data to match the expected format
    const transformedPoll = {
      id: updatedPoll.id,
      title: updatedPoll.title,
      description: updatedPoll.description || "",
      options: updatedPoll.poll_options.map((option: any) => ({
        id: option.id,
        text: option.text,
        votes: option.votes,
      })),
      createdAt: updatedPoll.created_at,
      totalVotes: updatedPoll.poll_options.reduce((sum: number, option: any) => sum + option.votes, 0),
    };

    return NextResponse.json(transformedPoll, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }
    
    console.error("Error processing vote:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
