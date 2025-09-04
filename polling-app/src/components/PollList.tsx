"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

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

export default function PollList() {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchPolls = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/polls", { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to fetch polls");
      const data = await res.json();
      setPolls(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPolls();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this poll? This action cannot be undone.")) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/polls/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to delete poll");
      }
      setPolls((prev) => prev.filter((p) => p.id !== id));
    } catch (e) {
      alert(e instanceof Error ? e.message : "Failed to delete poll");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) return <div className="text-gray-600">Loading polls…</div>;
  if (error) return <div className="text-red-600">{error}</div>;
  if (polls.length === 0) return <div className="text-gray-600">No polls yet. Create your first one!</div>;

  return (
    <div className="grid grid-cols-1 gap-4 w-full">
      {polls.map((poll) => (
        <Card key={poll.id}>
          <CardHeader>
            <CardTitle className="text-lg">{poll.title}</CardTitle>
            {poll.description && (
              <CardDescription className="line-clamp-2">{poll.description}</CardDescription>
            )}
          </CardHeader>
          <CardContent className="flex justify-between items-center gap-3">
            <div className="text-sm text-gray-600">{poll.totalVotes} total votes</div>
            <div className="flex gap-2">
              <Link href={`/polls/${poll.id}`}>
                <Button variant="outline">View</Button>
              </Link>
              <Button
                variant="outline"
                onClick={() => handleDelete(poll.id)}
                disabled={deletingId === poll.id}
              >
                {deletingId === poll.id ? "Removing…" : "Remove"}
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}


