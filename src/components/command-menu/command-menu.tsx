"use client";

import React, { useEffect, useState } from "react";
import { CommandList } from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { Expand, Search, Shrink, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { FileCache, FileData } from "@/lib/types/fileCache";
import { Input } from "@/components/ui/input";
import { Typography } from "@/components/ui/typography";
import { ResultGroup } from "@/components/command-menu/results/result-group";
import { History } from "@/components/command-menu/history/history";
import { HistoryType } from "@/lib/types/history";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Command } from "@/components/ui/command";
import { DialogProps } from "@radix-ui/react-dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

interface CommandDialogProps extends DialogProps {
  expanded?: boolean;
}

const defaultSuggestions = [
  {
    title: "Popular topics",
    items: [
      {
        name: "Authentication",
        path: "https://developers.lomi.africa/reference/core/authentication",
        description: "Learn how to authenticate with the lomi. API",
      },
      {
        name: "Webhooks",
        path: "https://developers.lomi.africa/reference/core/webhooks",
        description: "Set up and manage webhooks for real-time updates",
      },
      {
        name: "Error Handling",
        path: "https://developers.lomi.africa/reference/core/errors",
        description: "Common errors and how to handle them",
      },
    ],
  },
  {
    title: "Getting started",
    items: [
      {
        name: "Introduction",
        path: "https://developers.lomi.africa/docs/introduction/what-is-lomi",
        description: "Get started with lomi.'s payment platform",
      },
      {
        name: "API Overview",
        path: "https://developers.lomi.africa/reference/core/overview",
        description: "High-level overview of the lomi. API",
      },
      {
        name: "Data Models",
        path: "https://developers.lomi.africa/reference/core/data-models",
        description: "Understanding lomi.'s data structures",
      },
    ],
  },
  {
    title: "Dev' tools",
    items: [
      {
        name: "lomi. CLI",
        path: "https://developers.lomi.africa/docs/lomi-cli/overview",
        description: "Command-line tools for lomi. developers",
      },
      {
        name: "License Management",
        path: "https://developers.lomi.africa/docs/freedom/open-source",
        description: "Manage your lomi. licenses",
      },
    ],
  },
];

const CommandDialog = ({
  children,
  expanded = false,
  ...props
}: CommandDialogProps) => {
  return (
    <Dialog {...props}>
      <DialogContent
        className={cn(
          "overflow-hidden p-0 shadow-lg rounded-sm border",
          expanded ? "max-w-4xl" : "max-w-2xl",
        )}
      >
        <DialogTitle asChild>
          <VisuallyHidden>Search Documentation</VisuallyHidden>
        </DialogTitle>
        <DialogDescription asChild>
          <VisuallyHidden>
            Search through documentation pages and suggested topics.
          </VisuallyHidden>
        </DialogDescription>
        <Command
          className={cn(
            "bg-popover [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-group]]:px-2 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5",
          )}
        >
          {children}
        </Command>
      </DialogContent>
    </Dialog>
  );
};

export const CommandMenu = ({
  open,
  setOpen,
  fileCache,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  fileCache: FileCache;
}) => {
  const [searchValue, setSearchValue] = useState("");
  const [results, setResults] = useState<Record<string, FileData[]>>({});
  const [history, setHistory] = useState<HistoryType>({});
  const [expanded, setExpanded] = useState(false);

  // Clear search value when dialog closes
  useEffect(() => {
    if (!open) {
      setSearchValue("");
    }
  }, [open]);

  // Update history when dialog opens or storage changes
  useEffect(() => {
    const updateHistory = () => {
      const localHistory = JSON.parse(localStorage.getItem("history") || "{}");
      setHistory(localHistory);
    };

    if (open) {
      updateHistory();
    }

    // Listen for storage changes
    window.addEventListener("storage", updateHistory);
    return () => window.removeEventListener("storage", updateHistory);
  }, [open]);

  useEffect(() => {
    // Filter fileCache based on the searchValue
    const filteredFiles = Object.values(fileCache).filter((file) => {
      // Exclude _meta files and ensure there's a match
      const isNotMetaFile = !file.path?.includes("_meta");
      const hasMatch =
        file.name.toLowerCase().includes(searchValue.toLowerCase()) ||
        file.content.toLowerCase().includes(searchValue.toLowerCase());

      return isNotMetaFile && hasMatch;
    });

    const groupedFiles = filteredFiles.reduce(
      (acc, file) => {
        const { parentName, ...rest } = file;
        const section = parentName || "Other";

        if (!acc[section]) {
          acc[section] = [{ ...rest, parentName }];
        } else {
          acc[section].push({ ...rest, parentName });
        }
        return acc;
      },
      {} as Record<string, FileData[]>,
    );
    setResults(groupedFiles);
  }, [searchValue, fileCache]);

  const handleSuggestionClick = (suggestion: {
    name: string;
    path: string;
  }) => {
    // Add to history
    const newHistory = {
      ...history,
      [suggestion.name]: {
        title: suggestion.name,
        path: suggestion.path,
        timestamp: new Date().toISOString(),
      },
    };
    localStorage.setItem("history", JSON.stringify(newHistory));
    setHistory(newHistory);

    // Navigate based on URL type
    const { path } = suggestion;
    if (path.startsWith("http://") || path.startsWith("https://")) {
      // Absolute URL: navigate directly
      window.location.href = path;
    } else {
      // Relative URL: ensure it starts with '/' and navigate
      const relativePath = path.startsWith("/") ? path : `/${path}`;
      window.location.href = relativePath; // Using window.location.href for simplicity
    }
    setOpen(false);
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen} expanded={expanded}>
      <div className="flex items-center border-b-2 pl-3">
        <Search height={16} width={16} />
        <Input
          placeholder="Search in the documentation..."
          className="ml-1 py-6 border-0 rounded-sm !shadow-none focus-visible:!shadow-none !ring-offset-0 !ring-0"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
        <Button
          variant="ghost"
          className="px-2"
          size="icon"
          onClick={() => setExpanded((expanded) => !expanded)}
        >
          {expanded ? (
            <Shrink height={16} width={16} />
          ) : (
            <Expand height={16} width={16} />
          )}
        </Button>
      </div>

      <CommandList
        className={cn(
          "overflow-y-auto transition-all duration-200",
          expanded
            ? "min-h-[85vh] h-[85vh] w-full max-w-[1400px] p-6"
            : "min-h-[65vh] h-[65vh] w-full max-w-2xl p-4",
        )}
      >
        {searchValue.length === 0 ? (
          Object.keys(history || {}).length > 0 ? (
            <div
              className={cn(
                "flex flex-col w-full px-2 sm:px-3",
                expanded && "px-2 sm:px-10",
              )}
            >
              <div className="space-y-1">
                <div className="flex items-center justify-between px-2">
                  <h2 className="text-sm font-medium text-muted-foreground">
                    Recent searches
                  </h2>
                  <Badge
                    variant="secondary"
                    className="flex items-center justify-between px-2 py-1 text-sm bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/30 dark:hover:bg-blue-800/40 text-blue-700 dark:text-blue-300 cursor-pointer rounded-sm"
                    onClick={() => {
                      localStorage.removeItem("history");
                      setHistory({});
                    }}
                  >
                    <Trash2 className="h-3 w-3 mr-1" />
                    Clear
                  </Badge>
                </div>
                <History
                  history={history}
                  setOpen={setOpen}
                  expanded={expanded}
                />
              </div>
              <div className="border-t pt-4 mt-4">
                <h2 className="px-2 mb-2 text-sm font-medium text-muted-foreground">
                  Suggested
                </h2>
                {defaultSuggestions.map((section) => (
                  <div key={section.title} className="mb-4">
                    <h3 className="px-2 mb-1 text-xs font-medium text-muted-foreground/70">
                      {section.title}
                    </h3>
                    <div className="space-y-1">
                      {section.items.map((item) => (
                        <button
                          key={item.path}
                          className="w-full text-left px-2 py-1.5 text-sm rounded-sm transition-colors hover:bg-blue-200 dark:hover:bg-blue-800/40 hover:text-accent-foreground"
                          onClick={() => handleSuggestionClick(item)}
                        >
                          <div className="font-medium">{item.name}</div>
                          <div className="text-xs text-muted-foreground line-clamp-1">
                            {item.description}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {defaultSuggestions.map((section) => (
                <div key={section.title} className="px-2">
                  <h2 className="mb-2 text-sm font-medium text-muted-foreground">
                    {section.title}
                  </h2>
                  <div className="space-y-1">
                    {section.items.map((item) => (
                      <button
                        key={item.path}
                        className="flex flex-col w-full text-left px-2 py-1.5 text-sm rounded-sm transition-colors hover:bg-blue-200 dark:hover:bg-blue-800/40 hover:text-accent-foreground"
                        onClick={() => handleSuggestionClick(item)}
                      >
                        <span className="font-medium">{item.name}</span>
                        <span className="text-xs text-muted-foreground line-clamp-1">
                          {item.description}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )
        ) : Object.keys(results || {}).length === 0 ? (
          <div className="flex items-center justify-center w-full h-20">
            <Typography variant="muted">
              No results for &quot;<strong>{searchValue}</strong>&quot;
            </Typography>
          </div>
        ) : (
          Object.entries(results || {}).map(([key, fileGroup]) => (
            <ResultGroup
              results={fileGroup}
              key={`result_group_${key}_${searchValue}`}
              className={cn("mt-2 sm:mt-4", expanded && "px-2 sm:px-10")}
              keyword={searchValue}
              setOpen={setOpen}
            />
          ))
        )}
      </CommandList>
    </CommandDialog>
  );
};
