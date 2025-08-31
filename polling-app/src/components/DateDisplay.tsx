"use client";

import { useState, useEffect } from "react";

interface DateDisplayProps {
  dateString: string;
}

export function DateDisplay({ dateString }: DateDisplayProps) {
  const [formattedDate, setFormattedDate] = useState<string>("");

  useEffect(() => {
    const date = new Date(dateString);
    setFormattedDate(date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }));
  }, [dateString]);

  return <span>{formattedDate || "Loading..."}</span>;
}
