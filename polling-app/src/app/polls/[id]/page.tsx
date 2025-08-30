"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, CheckCircle } from "lucide-react";

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
  const [hasVoted, setHasVoted] = useState(false);

  useEffect(() => {
    // For now, we'll create a mock poll since we don't have a real database
    // In a real app, you'd fetch this from your API
    const mockPoll: Poll = {
      id: params.id as string,
      title: "Sample Poll",
      description: "This is a sample poll created for demonstration purposes.",
      options: [
        { id: "option_0", text: "Option 1", votes: 5 },
        { id: "option_1", text: "Option 2", votes: 3 },
        { id: "option_2", text: "Option 3", votes: 7 },
      ],
      createdAt: new Date().toISOString(),
      totalVotes: 15,
    };

    setPoll(mockPoll);
    setIsLoading(false);
  }, [params.id]);

  const handleVote = (optionId: string) => {
    if (!poll || hasVoted) return;

    setPoll(prev => {
      if (!prev) return prev;
      
      const updatedOptions = prev.options.map(option => 
        option.id === optionId 
          ? { ...option, votes: option.votes + 1 }
          : option
      );

      return {
        ...prev,
        options: updatedOptions,
        totalVotes: prev.totalVotes + 1,
      };
    });

    setHasVoted(true);
  };

  const getPercentage = (votes: number) => {
    if (!poll || poll.totalVotes === 0) return 0;
    return Math.round((votes / poll.totalVotes) * 100);
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

        <Card className="w-full max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl">{poll.title}</CardTitle>
            {poll.description && (
              <CardDescription className="text-base">
                {poll.description}
              </CardDescription>
            )}
            <div className="text-sm text-gray-500">
              Created on {new Date(poll.createdAt).toLocaleDateString()}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm text-gray-600">
              Total votes: {poll.totalVotes}
            </div>
            
            <div className="space-y-3">
              {poll.options.map((option) => (
                <div key={option.id} className="relative">
                  <Button
                    variant="outline"
                    className={`w-full justify-between h-auto p-4 ${
                      hasVoted ? "cursor-default" : "hover:bg-gray-50"
                    }`}
                    onClick={() => handleVote(option.id)}
                    disabled={hasVoted}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-left">{option.text}</span>
                      {hasVoted && (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      )}
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{option.votes} votes</div>
                      <div className="text-sm text-gray-500">
                        {getPercentage(option.votes)}%
                      </div>
                    </div>
                  </Button>
                  
                  {hasVoted && (
                    <div 
                      className="absolute top-0 left-0 h-full bg-blue-100 rounded-md transition-all duration-500"
                      style={{ width: `${getPercentage(option.votes)}%` }}
                    />
                  )}
                </div>
              ))}
            </div>

            {hasVoted && (
              <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-md">
                <p className="text-green-800 text-center">
                  Thank you for voting! Your vote has been recorded.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
