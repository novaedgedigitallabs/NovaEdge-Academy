"use client";

import { useState } from "react";
import { ThumbsUp, ThumbsDown, CheckCircle2 } from "lucide-react";

export default function FeedbackWidget() {
  const [submitted, setSubmitted] = useState(false);

  const handleFeedback = () => {
    setSubmitted(true);
  };

  return (
    <div className="my-10 p-4 rounded-2xl bg-secondary/20 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
      {submitted ? (
        <div className="flex items-center gap-2 text-emerald-400 font-semibold mx-auto sm:mx-0">
          <CheckCircle2 className="w-4 h-4" />
          <span>Thank you for your feedback!</span>
        </div>
      ) : (
        <>
          <span className="text-muted-foreground font-medium">Was this page helpful?</span>
          <div className="flex items-center gap-2">
            <button
              onClick={handleFeedback}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary/50 hover:bg-primary/20 hover:text-primary border border-white/10 text-muted-foreground transition-all cursor-pointer font-semibold"
            >
              <ThumbsUp className="w-3.5 h-3.5" />
              <span>Yes</span>
            </button>
            <button
              onClick={handleFeedback}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary/50 hover:bg-destructive/20 hover:text-destructive border border-white/10 text-muted-foreground transition-all cursor-pointer font-semibold"
            >
              <ThumbsDown className="w-3.5 h-3.5" />
              <span>No</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
}
