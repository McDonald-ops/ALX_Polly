"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PollForm } from "@/components/PollForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface PollFormData {
  title: string;
  description?: string;
  options: string[];
}

export default function NewPollPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (data: PollFormData) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/polls", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create poll");
      }

      const result = await response.json();
      
      // Redirect to the poll page or show success message
      router.push(`/polls/${result.id}`);
    } catch (error) {
      console.error("Error creating poll:", error);
      let errorMessage = "Failed to create poll. Please try again.";
      
      if (error instanceof Error) {
        if (error.message.includes("Database tables not found")) {
          errorMessage = "Database not set up. Please run the database setup first. See DATABASE_SETUP.md for instructions.";
        } else {
          errorMessage = error.message;
        }
      }
      
      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };



  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </div>
        
        <PollForm onSubmit={handleSubmit} isLoading={isLoading} />
      </div>
    </div>
  );
}
