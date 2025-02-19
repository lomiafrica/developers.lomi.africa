"use client"

import * as React from "react"
import { Info } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"

interface InfoBoxProps {
    children: React.ReactNode
    className?: string
    title?: string
    mini?: boolean
    link?: string
    variant?: 'blue' | 'green' | 'red'
}

export default function InfoBox({
    children,
    className,
    title = "Important",
    mini,
    link,
    variant = 'blue'
}: InfoBoxProps) {
    const variantStyles = {
        blue: {
            box: "border-blue-200/30 bg-blue-950/30",
            icon: "text-blue-400",
            text: "text-blue-300",
        },
        green: {
            box: "border-green-200/30 bg-green-950/30",
            icon: "text-green-400",
            text: "text-green-300",
        },
        red: {
            box: "border-red-200/30 bg-red-950/30",
            icon: "text-red-400",
            text: "text-red-300",
        },
        yellow: {
            box: "border-yellow-200/30 bg-yellow-950/30",
            icon: "text-yellow-400",
            text: "text-yellow-300",
        }
    }

    const content = (
        <div
            className={cn(
                "flex rounded-sm border",
                variantStyles[variant].box,
                mini ? "items-center gap-3 p-3 mb-4" : "gap-3 p-4 my-4",
                className
            )}
        >
            {!mini ? (
                <>
                    <Info className={cn("h-5 w-5 flex-shrink-0 mt-1", variantStyles[variant].icon)} />
                    <div className="flex-1">
                        <h4 className={cn("font-semibold mb-2", variantStyles[variant].icon)}>
                            {title}
                        </h4>
                        <div className={cn("text-[15px] leading-relaxed", variantStyles[variant].text)}>
                            {children}
                        </div>
                    </div>
                </>
            ) : (
                <>
                    <Info className={cn("h-5 w-5 flex-shrink-0", variantStyles[variant].icon)} />
                    <div className={cn("text-[15px]", variantStyles[variant].text)}>
                        {children}
                        {link && (
                            <span className="border-b border-white/20 hover:border-white/40 ml-1">
                                {link}
                            </span>
                        )}
                    </div>
                </>
            )}
        </div>
    );

    if (link) {
        return (
            <Link href={link}>
                {content}
            </Link>
        );
    }

    return content;
} 