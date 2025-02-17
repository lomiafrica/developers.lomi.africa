import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ChevronRight, FileText } from "lucide-react";
import { Typography } from "@/components/ui/typography";
import { HistoryType } from "@/lib/types/history";

const HistoryItem = ({
  className,
  name,
  path,
}: {
  className?: string;
  name: string;
  path: string;
}) => {
  return (
    <Button
      asChild
      variant="secondary"
      className={cn(
        "overflow-hidden flex items-center justify-start w-full p-2 my-1 rounded-lg bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-900 dark:hover:bg-zinc-800 group",
        className,
      )}
    >
      <Link href={`/${path}`}>
        <div className="flex items-center w-full">
          <div className="flex items-center p-1 rounded-lg border bg-white dark:bg-zinc-900">
            <FileText height={20} width={20} strokeWidth={1} />
          </div>
          <div className="flex flex-col mx-4 items-start justify-center overflow-hidden grow">
            <Typography variant="small">{name}</Typography>
          </div>
          <ChevronRight height={20} width={20} strokeWidth={2} />
        </div>
      </Link>
    </Button>
  );
};

export const History = ({
  history,
  setOpen,
  className,
  expanded,
}: {
  history: HistoryType;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  className?: string;
  expanded?: boolean;
}) => {
  return (
    <div className={cn("flex flex-col w-full mt-2", className)}>
      {Object.entries(history || {}).map(([key, item]) => (
        <HistoryItem
          name={item.title?.replace("_", " ")}
          path={item.path}
          key={`history_item_${key}`}
          className={cn(expanded && "mt-2 py-3 h-auto")}
        />
      ))}
    </div>
  );
};
