"use client";

import { FileData } from "@/lib/types/fileCache";
import React from "react";
import { cn, displaySentenceWithKeyword } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ChevronRight, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Typography } from "@/components/ui/typography";
import { HistoryItem } from "@/lib/types/history";

const FormattedSentence = ({
  sentence,
  keyword,
  className,
}: {
  sentence: string;
  keyword: string;
  className?: string;
}) => {
  const regex = new RegExp(keyword, "gi");
  const splitted = sentence.split(regex);
  const transformed =
    splitted[1]?.length > 10
      ? splitted[0].length > 10
        ? "..." + splitted[0].slice(-10)
        : splitted[0]
      : splitted[0].length > 20
        ? "..." + splitted[0].slice(-20)
        : splitted[0];
  return splitted ? (
    <Typography
      variant="muted"
      className={cn(
        "max-sm:text-xs mt-1 sm:mt-2 line-clamp-1 truncate",
        className,
      )}
    >
      {transformed}
      <strong className="text-amber-500">{keyword}</strong>
      {splitted[1]}
    </Typography>
  ) : (
    <Typography
      variant="muted"
      className={cn(
        "max-sm:text-xs mt-1 sm:mt-2 line-clamp-1 truncate",
        className,
      )}
    >
      {sentence}
    </Typography>
  );
};

export const ResultItem = ({
  className,
  keyword,
  result,
  setOpen,
}: {
  className?: string;
  keyword: string;
  result: FileData;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const sentence = displaySentenceWithKeyword({
    text: result.content,
    keyword,
  });
  const computedHeight = sentence ? "h-16 sm:h-20" : "h-10 sm:h-12";
  const namePath = result.path?.split("/").slice(1).join(" > ");
  const handleHistory = () => {
    const history = JSON.parse(localStorage.getItem("history") || "{}");
    history[result.path] = {
      title: result.name,
      path: result.path,
      timestamp: new Date().toISOString(),
    } as HistoryItem;
    localStorage.setItem("history", JSON.stringify(history));
    setOpen(false);
  };
  return (
    <div className={cn(computedHeight, "flex items-center w-full")}>
      <div
        className={cn(
          computedHeight,
          "min-w-[2px] bg-zinc-100 dark:bg-zinc-600 mr-2 sm:mr-4 max-sm:hidden",
        )}
      />
      <Button
        asChild
        variant="secondary"
        className={cn(
          sentence ? "h-14 sm:h-18" : "h-8 sm:h-10",
          "overflow-hidden flex items-center justify-start w-full px-3 my-1 rounded-lg bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-900 dark:hover:bg-zinc-800 group",
          className,
        )}
        onClick={handleHistory}
      >
        <Link href={`/${result.path}`}>
          <div className="flex items-center p-1 rounded-lg border bg-white dark:bg-zinc-900 shadow-lg">
            <FileText height={20} width={20} strokeWidth={1} />
          </div>
          <div className="flex flex-col mx-4 items-start justify-center overflow-hidden grow">
            <Badge
              variant="secondary"
              className="bg-zinc-200 dark:bg-zinc-700 capitalize"
            >
              {namePath}
            </Badge>
            {sentence && (
              <FormattedSentence sentence={sentence} keyword={keyword} />
            )}
          </div>
          <ChevronRight height={20} width={20} strokeWidth={2} />
        </Link>
      </Button>
    </div>
  );
};
