"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { DateDisplay } from "@/components/DateDisplay";
import { PollVotingForm } from "@/components/PollVotingForm";

interface PollOption {
  id: string;
  text: string;
  votes: number;
}

interface Poll {
  id: string;
  title: string;
  description: string;
  options: PollOption[];
  createdAt: string;
  totalVotes: number;
}

export default function PollPage() {
  const params = useParams();
  const router = useRouter();
  const [poll, setPoll] = useState<Poll | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPoll = async () => {
      try {
        const response = await fetch(`/api/polls/${params.id}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            setPoll(null);
          } else {
            throw new Error('Failed to fetch poll');
          }
        } else {
          const pollData = await response.json();
          setPoll(pollData);
        }
      } catch (error) {
        console.error('Error fetching poll:', error);
        setPoll(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPoll();
  }, [params.id]);

  const handleVoteSubmitted = (updatedPoll: Poll) => {
    setPoll(updatedPoll);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <div className="h-10 w-20 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="w-full max-w-2xl mx-auto">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="space-y-6">
                <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="space-y-3">
                  <div className="h-12 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-12 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-12 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }



  if (!poll) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Poll Not Found</h1>
            <p className="text-gray-600 mb-4">The poll you're looking for doesn't exist.</p>
            <Button onClick={() => router.push("/")}>
              Go Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => router.push("/")}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Button>
        </div>

        <div className="space-y-4">
          <div className="text-sm text-gray-500 text-center">
            Created on <DateDisplay dateString={poll.createdAt} />
          </div>
          
          <PollVotingForm 
            poll={poll} 
            onVoteSubmitted={handleVoteSubmitted} 
          />
        </div>
      </div>
    </div>
  );
}
