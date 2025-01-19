"use client";

import React, { useEffect, useState } from "react";
import { CommandDialog, CommandList } from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { CommandIcon, Expand, Search, Shrink } from "lucide-react";
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
    title: "Get Started",
    items: [
      { name: "Introduction", path: "/introduction" },
      { name: "Get Started", path: "/get-started" },
      { name: "Git Integration", path: "/git-integration" },
    ]
  },
  {
    title: "API Reference",
    items: [
      { name: "API Overview", path: "/api-reference/overview" },
      { name: "Authentication", path: "/api-reference/authentication" },
      { name: "Data Models", path: "/api-reference/data-models" },
      { name: "Webhooks", path: "/api-reference/webhooks" },
    ]
  },
  {
    title: "Advanced Topics",
    items: [
      { name: "Advanced Guides", path: "/advanced-guides" },
      { name: "License Management", path: "/license-management" },
      { name: "Lomi CLI", path: "/lomi-cli" },
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
    const filteredFiles = Object.values(fileCache).filter((file) => {
      const searchLower = searchValue.toLowerCase();
      const isPage = file.path.startsWith('src/pages/');
      const isMarkdown = file.path.endsWith('.mdx') || file.path.endsWith('.md');

      if (!isPage || !isMarkdown) return false;

      return (
        file.name.toLowerCase().includes(searchLower) ||
        file.content.toLowerCase().includes(searchLower) ||
        file.path.toLowerCase().includes(searchLower)
      );
    });

    const groupedFiles = filteredFiles.reduce((acc, file) => {
      // Extract section from path, e.g., "api-reference" from "src/pages/api-reference/overview.mdx"
      const pathParts = file.path.split('/');
      const sectionIndex = pathParts.indexOf('pages') + 1;
      const section = pathParts[sectionIndex] || 'Other';

      // Format section name
      const formattedSection = section
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

      if (!acc[formattedSection]) {
        acc[formattedSection] = [file];
      } else {
        acc[formattedSection].push(file);
      }
      return acc;
    }, {} as Record<string, FileData[]>);

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
      <div className="flex items-center border-b px-3">
        <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
        <Input
          placeholder="Search documentation..."
          className="h-11 flex-1 border-0 bg-transparent px-3 py-3 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-0"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 shrink-0"
          onClick={() => setExpanded((expanded) => !expanded)}
        >
          {expanded ? (
            <Shrink className="h-4 w-4" />
          ) : (
            <Expand className="h-4 w-4" />
          )}
        </Button>
      </div>

      <CommandList className={cn("h-[min(400px,60vh)] overflow-y-auto p-4", expanded && "h-[80vh]")}>
        {searchValue.length === 0 ? (
          Object.keys(history || {}).length > 0 ? (
            <div className={cn("space-y-4", expanded && "px-4")}>
              <History
                history={history}
                setOpen={setOpen}
                expanded={expanded}
              />
            </div>
          ) : (
            <div className="space-y-6">
              {defaultSuggestions.map((section) => (
                <div key={section.title} className="px-2">
                  <h2 className="mb-2 text-sm font-semibold text-muted-foreground">{section.title}</h2>
                  <div className="space-y-2">
                    {section.items.map((item) => (
                      <button
                        key={item.path}
                        className="flex w-full items-center rounded-sm px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground"
                        onClick={() => handleSuggestionClick(item)}
                      >
                        {item.name}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )
        ) : Object.keys(results || {}).length === 0 ? (
          <div className="flex items-center justify-center py-16">
            <Typography variant="muted">
              No results for &quot;<strong>{searchValue}</strong>&quot;
            </Typography>
          </div>
        ) : (
          <div className="space-y-4">
            {Object.entries(results || {}).map(([key, fileGroup]) => (
              <ResultGroup
                results={fileGroup}
                key={`result_group_${key}_${searchValue}`}
                className={cn(expanded && "px-4")}
                keyword={searchValue}
                setOpen={setOpen}
              />
            ))}
          </div>
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
