"use client";

import React, { useEffect, useState } from "react";
import { CommandDialog, CommandList } from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { Expand, Search, Shrink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import jsonFileCache from "@/lib/cache/fileCache.json";
import { FileCache, FileData } from "@/lib/types/fileCache";
import { Input } from "@/components/ui/input";
import { Typography } from "@/components/ui/typography";
import { ResultGroup } from "@/components/command-menu/results/result-group";
import { History } from "@/components/command-menu/history/history";
import { HistoryType } from "@/lib/types/history";

const defaultSuggestions = [
  {
    title: "Popular Topics",
    items: [
      { name: "Authentication", path: "/api-reference/authentication", description: "Learn how to authenticate with the Lomi API" },
      { name: "Webhooks", path: "/api-reference/webhooks", description: "Set up and manage webhooks for real-time updates" },
      { name: "Error Handling", path: "/api-reference/errors", description: "Common errors and how to handle them" },
    ]
  },
  {
    title: "Quick Start",
    items: [
      { name: "Introduction", path: "/introduction", description: "Get started with Lomi's payment platform" },
      { name: "API Overview", path: "/api-reference/overview", description: "High-level overview of the Lomi API" },
      { name: "Data Models", path: "/api-reference/data-models", description: "Understanding Lomi's data structures" },
    ]
  },
  {
    title: "Developer Tools",
    items: [
      { name: "Git Integration", path: "/git-integration", description: "Connect your repository with Lomi" },
      { name: "Lomi CLI", path: "/lomi-cli", description: "Command-line tools for Lomi developers" },
      { name: "License Management", path: "/license-management", description: "Manage your Lomi licenses" },
    ]
  }
];

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

  useEffect(() => {
    // Filter fileCache based on the searchValue
    const filteredFiles = Object.values(fileCache).filter(
      (file) =>
        file.name.toLowerCase().includes(searchValue.toLowerCase()) ||
        file.content.toLowerCase().includes(searchValue.toLowerCase()),
    );

    const groupedFiles = filteredFiles.reduce(
      (acc, file) => {
        const { parentName, ...rest } = file;
        if (!acc[parentName ?? ""]) {
          acc[parentName ?? ""] = [{ ...rest, parentName }];
        } else {
          acc[parentName ?? ""].push({ ...rest, parentName });
        }
        return acc;
      },
      {} as Record<string, FileData[]>,
    );
    setResults(groupedFiles);
  }, [searchValue, fileCache]);

  useEffect(() => {
    const localHistory = JSON.parse(localStorage.getItem("history") || "{}");
    setHistory(localHistory);
  }, []);

  const handleSuggestionClick = (suggestion: { name: string; path: string }) => {
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

    // Navigate to the path
    window.location.href = suggestion.path;
    setOpen(false);
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen} expanded={expanded}>
      <div className="flex items-center border-b-2 pl-3">
        <Search height={16} width={16} />
        <Input
          placeholder="Search in the documentation..."
          className="ml-1 py-6 border-0 rounded-none !shadow-none focus-visible:!shadow-none !ring-offset-0 !ring-0"
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
            : "min-h-[65vh] h-[65vh] w-full max-w-2xl p-4"
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
                <h2 className="px-2 text-sm font-medium text-muted-foreground">Recent Searches</h2>
                <History
                  history={history}
                  setOpen={setOpen}
                  expanded={expanded}
                />
              </div>
              <div className="border-t pt-4 mt-4">
                <h2 className="px-2 mb-2 text-sm font-medium text-muted-foreground">Suggested</h2>
                {defaultSuggestions.map((section) => (
                  <div key={section.title} className="mb-4">
                    <h3 className="px-2 mb-1 text-xs font-medium text-muted-foreground/70">{section.title}</h3>
                    <div className="space-y-1">
                      {section.items.map((item) => (
                        <button
                          key={item.path}
                          className="w-full text-left px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground"
                          onClick={() => handleSuggestionClick(item)}
                        >
                          <div className="font-medium">{item.name}</div>
                          <div className="text-xs text-muted-foreground line-clamp-1">{item.description}</div>
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
                  <h2 className="mb-2 text-sm font-medium text-muted-foreground">{section.title}</h2>
                  <div className="space-y-1">
                    {section.items.map((item) => (
                      <button
                        key={item.path}
                        className="flex flex-col w-full text-left px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground"
                        onClick={() => handleSuggestionClick(item)}
                      >
                        <span className="font-medium">{item.name}</span>
                        <span className="text-xs text-muted-foreground line-clamp-1">{item.description}</span>
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

export const CommandMenuTrigger = ({
  className = "",
}: {
  className?: string;
}) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <>
      <CommandMenu
        open={open}
        setOpen={setOpen}
        fileCache={jsonFileCache as FileCache}
        key="command_menu"
      />
      <Button
        className={cn(
          "flex items-center gap-2 h-9 px-3 rounded-none border border-input bg-transparent",
          className
        )}
        variant="outline"
        onClick={() => setOpen((open) => !open)}
      >
        <Search className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm text-muted-foreground hidden sm:inline-flex">Search docs</span>
        <Badge variant="secondary" className="ml-auto rounded-sm px-1">
          <span className="text-xs">⌘K</span>
        </Badge>
      </Button>
    </>
  );
};
