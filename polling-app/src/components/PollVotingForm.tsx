"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CheckCircle, Vote } from "lucide-react";

/**
 * Zod schema for vote validation.
 * 
 * Ensures a user has selected an option before allowing vote submission.
 */
const voteSchema = z.object({
  selectedOption: z.string().min(1, "Please select an option to vote"),
});

type VoteFormData = z.infer<typeof voteSchema>;

/**
 * Represents a poll option with vote count for the voting interface.
 */
interface PollOption {
  id: string;
  text: string;
  votes: number;
}

/**
 * Represents a complete poll with options for the voting interface.
 */
interface Poll {
  id: string;
  title: string;
  description: string;
  options: PollOption[];
  createdAt: string;
  totalVotes: number;
}

interface PollVotingFormProps {
  /** The poll data to display and vote on */
  poll: Poll;
  /** Callback function called when vote is successfully submitted */
  onVoteSubmitted: (updatedPoll: Poll) => void;
}

/**
 * PollVotingForm Component
 * 
 * A comprehensive voting interface that handles:
 * - Radio button selection with React Hook Form Controller
 * - Real-time vote submission to the API
 * - Post-vote results display with visual progress bars
 * - Loading states and error handling
 * - Percentage calculations for vote visualization
 * 
 * The component uses a controlled RadioGroup to prevent the common
 * "uncontrolled to controlled" React warning and ensures proper
 * form state management.
 * 
 * @param {PollVotingFormProps} props - Component props
 * @returns {JSX.Element} The rendered voting interface
 */
export function PollVotingForm({ poll, onVoteSubmitted }: PollVotingFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);
  const [submissionMessage, setSubmissionMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    control,
  } = useForm<VoteFormData>({
    resolver: zodResolver(voteSchema),
    defaultValues: { selectedOption: "" },
  });

  const selectedOption = watch("selectedOption");

  /**
   * Handles vote submission to the API.
   * 
   * This function manages the complete voting workflow:
   * 1. Sets loading state to prevent double submissions
   * 2. Sends vote data to the API endpoint
   * 3. Updates the parent component with fresh poll data
   * 4. Shows success/error messages to the user
   * 
   * @param {VoteFormData} data - Form data containing selected option ID
   */
  const onSubmit = async (data: VoteFormData) => {
    setIsSubmitting(true);
    
    try {
      const response = await fetch(`/api/polls/${poll.id}/vote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ optionId: data.selectedOption }),
      });

      if (!response.ok) {
        throw new Error('Failed to record vote');
      }

      // Get updated poll data with new vote counts
      const updatedPoll = await response.json();
      onVoteSubmitted(updatedPoll);
      setHasVoted(true);
      setSubmissionMessage("Thank you for voting! Your vote has been recorded successfully.");
    } catch (error) {
      console.error('Error voting:', error);
      setSubmissionMessage("Failed to record your vote. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Calculates the percentage of votes for a specific option.
   * 
   * Handles edge cases where poll data might be missing or
   * total votes is zero to prevent division by zero errors.
   * 
   * @param {number} votes - Number of votes for the specific option
   * @returns {number} Percentage rounded to nearest integer (0-100)
   */
  const getPercentage = (votes: number) => {
    if (!poll || poll.totalVotes === 0) return 0;
    return Math.round((votes / poll.totalVotes) * 100);
  };

  if (hasVoted) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <CheckCircle className="h-6 w-6 text-green-500" />
            Vote Submitted
          </CardTitle>
          <CardDescription>
            {submissionMessage}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="text-sm text-gray-600 mb-4">
              Total votes: {poll.totalVotes}
            </div>
            
            <div className="space-y-3">
              {poll.options.map((option) => (
                <div key={option.id} className="relative p-4 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="font-medium">{option.text}</span>
                      {selectedOption === option.id && (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      )}
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{option.votes} votes</div>
                      <div className="text-sm text-gray-500">
                        {getPercentage(option.votes)}%
                      </div>
                    </div>
                  </div>
                  
                  <div 
                    className="absolute top-0 left-0 h-full bg-blue-100 rounded-lg transition-all duration-500"
                    style={{ width: `${getPercentage(option.votes)}%` }}
                  />
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">{poll.title}</CardTitle>
        {poll.description && (
          <CardDescription className="text-base">
            {poll.description}
          </CardDescription>
        )}
        <div className="text-sm text-gray-500">
          Total votes: {poll.totalVotes}
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <Label className="text-base font-medium">Select your vote:</Label>
            <Controller
              name="selectedOption"
              control={control}
              render={({ field }) => (
                <RadioGroup
                  name={field.name}
                  value={field.value}
                  onValueChange={field.onChange}
                  className="space-y-3"
                >
                  {poll.options.map((option) => (
                    <div key={option.id} className="flex items-center space-x-3">
                      <RadioGroupItem
                        value={option.id}
                        id={option.id}
                        aria-checked={field.value === option.id}
                      />
                      <Label
                        htmlFor={option.id}
                        className="flex-1 cursor-pointer text-base"
                      >
                        {option.text}
                      </Label>
                      <div className="text-sm text-gray-500">
                        {option.votes} votes ({getPercentage(option.votes)}%)
                      </div>
                    </div>
                  ))}
                </RadioGroup>
              )}
            />
            
            {errors.selectedOption && (
              <p className="text-red-500 text-sm">
                {errors.selectedOption.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            disabled={isSubmitting || !selectedOption}
            className="w-full"
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Submitting Vote...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Vote className="h-4 w-4" />
                Submit Vote
              </div>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
