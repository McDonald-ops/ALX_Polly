"use client";

import React, { useState } from "react";
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
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  React.useEffect(() => {
    setIsClient(true);
  }, []);

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
        throw new Error("Failed to create poll");
      }

      const result = await response.json();
      
      // Redirect to the poll page or show success message
      router.push(`/polls/${result.id}`);
    } catch (error) {
      console.error("Error creating poll:", error);
      alert("Failed to create poll. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isClient) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <div className="h-10 w-20 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="w-full max-w-2xl mx-auto">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-20 bg-gray-200 rounded animate-pulse"></div>
                </div>
                <div className="space-y-4">
                  <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
                  <div className="space-y-3">
                    <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>
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
