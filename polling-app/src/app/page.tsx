import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, BarChart3, Users } from "lucide-react";

export default function Home() {
  return (
    <div className="font-sans min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] items-center sm:items-start max-w-4xl mx-auto">
        <div className="text-center sm:text-left">
          <h1 className="text-4xl font-bold mb-4">SnapAPI Polling App</h1>
          <p className="text-xl text-gray-600 mb-8">
            Create and participate in polls with real-time results
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Create Poll
              </CardTitle>
              <CardDescription>
                Start a new poll and share it with others
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/polls/new">
                <Button className="w-full">
                  Create New Poll
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                View Results
              </CardTitle>
              <CardDescription>
                See real-time results and analytics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full" disabled>
                Coming Soon
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Participate
              </CardTitle>
              <CardDescription>
                Vote on existing polls
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full" disabled>
                Coming Soon
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 text-center sm:text-left">
          <h2 className="text-2xl font-semibold mb-4">Getting Started</h2>
          <ol className="font-mono list-inside list-decimal text-sm/6 space-y-2">
            <li className="tracking-[-.01em]">
              Click <strong>Create New Poll</strong> to start your first poll
            </li>
            <li className="tracking-[-.01em]">
              Add a title, description, and multiple options
            </li>
            <li className="tracking-[-.01em]">
              Share the poll link with others to collect votes
            </li>
          </ol>
        </div>
      </main>
    </div>
  );
}
