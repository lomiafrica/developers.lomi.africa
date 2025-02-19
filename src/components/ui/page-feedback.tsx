"use client"

import * as React from "react"
import { ThumbsUp, ThumbsDown } from "lucide-react"
import { cn } from "@/lib/utils"

export default function PageFeedback() {
    const [feedback, setFeedback] = React.useState<'yes' | 'no' | null>(null)

    return (
        <div className="flex items-center gap-6 mt-8 ml-4 text-gray-400">
            <span className="text-sm">Was this page helpful?</span>
            <div className="flex gap-2">
                <button
                    onClick={() => setFeedback('yes')}
                    className={cn(
                        "flex items-center gap-2 px-4 py-2 text-sm rounded-md border border-gray-700",
                        "hover:bg-gray-800 transition-colors",
                        feedback === 'yes' ? "bg-gray-800 text-green-400 border-green-400/30" : "text-gray-400"
                    )}
                >
                    <ThumbsUp className="h-4 w-4" />
                    Yes
                </button>
                <button
                    onClick={() => setFeedback('no')}
                    className={cn(
                        "flex items-center gap-2 px-4 py-2 text-sm rounded-md border border-gray-700",
                        "hover:bg-gray-800 transition-colors",
                        feedback === 'no' ? "bg-gray-800 text-red-400 border-red-400/30" : "text-gray-400"
                    )}
                >
                    <ThumbsDown className="h-4 w-4" />
                    No
                </button>
            </div>
        </div>
    )
} 