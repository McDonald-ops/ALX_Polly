import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { mockPolls } from "@/lib/mockData";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if it's a mock poll
    const mockPoll = mockPolls.find(poll => poll.id === params.id);
    if (mockPoll) {
      return NextResponse.json(mockPoll);
    }

    const { data: poll, error: pollError } = await supabase
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

    if (pollError) {
      if (pollError.code === 'PGRST116') {
        return NextResponse.json(
          { error: "Poll not found" },
          { status: 404 }
        );
      }
      console.error("Error fetching poll:", pollError);
      return NextResponse.json(
        { error: "Failed to fetch poll" },
        { status: 500 }
      );
    }

    // Transform the data to match the expected format
    const transformedPoll = {
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
    };

    return NextResponse.json(transformedPoll);
  } catch (error) {
    console.error("Error fetching poll:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
