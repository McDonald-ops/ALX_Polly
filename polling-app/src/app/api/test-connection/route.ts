import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  try {
    // Test basic connection
    const { data, error } = await supabase
      .from('polls')
      .select('count')
      .limit(1);

    if (error) {
      console.error("Supabase connection error:", error);
      return NextResponse.json(
        { 
          status: "error", 
          message: "Database connection failed", 
          details: error.message 
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { 
        status: "success", 
        message: "Database connection successful",
        data: data
      }
    );
  } catch (error) {
    console.error("Test connection error:", error);
    return NextResponse.json(
      { 
        status: "error", 
        message: "Unexpected error", 
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}
