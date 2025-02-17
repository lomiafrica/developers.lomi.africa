import { useMonaco } from "@monaco-editor/react";
import { Suspense, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Columns2, Copy, Expand, Rows2, Shrink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { prettifyName, transformThemeName } from "./utils";

// Replace useData with a static themes array for now
const themes = ['github-dark', 'github-light', 'monokai']; // Add your themes here

export const ToolBar = ({
  copyClipboard,
  openDialog,
  setOpenDialog,
  editorTheme,
  setEditorTheme,
  layoutMode,
  setLayoutMode,
  className,
  editorBg,
  setEditorBg
}: {
  copyClipboard: () => void,
  openDialog: boolean,
  setOpenDialog: (open: boolean) => void,
  editorTheme: string,
  setEditorTheme: (theme: string) => void,
  layoutMode: "col" | "row",
  setLayoutMode: (mode: "col" | "row") => void,
  className?: string,
  editorBg: string,
  setEditorBg: (color: string) => void
}) => {
  const monaco = useMonaco();
  const [selectedTheme, setSelectedTheme] = useState(editorTheme);

  const handleThemeChange = async (theme: string) => {
    setSelectedTheme(theme);
    if (theme === 'vs-dark' || theme === 'vs-light') {
      monaco?.editor.setTheme(theme);
      setEditorTheme(theme);
      setEditorBg(theme === 'vs-dark' ? '#1E1E1E' : '#fff')
      return;
    }
    try {
      const themeData = await fetch(`/static/themes/${theme}.json`).then(res => res.json());
      monaco?.editor.defineTheme(transformThemeName(theme), themeData);
      monaco?.editor.setTheme(theme);
      setEditorTheme(transformThemeName(theme));
      setEditorBg(themeData.colors['editor.background']);
    } catch (error) {
      console.error('Failed to load theme:', error);
    }
  };

  return (
    <Suspense fallback={<Badge variant="outline">Loading themes...</Badge>}>
      <div
        className={cn(
          "flex w-full justify-between items-center relative z-20",
          openDialog && 'bg-white dark:bg-zinc-900 p-2',
          className
        )}
      >
        <div className="flex items-center">
          <Select onValueChange={handleThemeChange}>
            <SelectTrigger className="mr-2">
              <SelectValue placeholder={prettifyName(selectedTheme)} />
            </SelectTrigger>
            <SelectContent>
              {themes.map((theme: string) => (
                <SelectItem value={theme} key={theme}>
                  {prettifyName(theme)}
                </SelectItem>
              ))}
              <SelectItem value="vs-dark">Vs Dark</SelectItem>
              <SelectItem value="vs-light">Vs Light</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex items-center w-fit">
            <ToggleGroup type="single" value={layoutMode}>
              <ToggleGroupItem value="col" onClick={() => setLayoutMode("col")}>
                <Rows2 size={16} />
              </ToggleGroupItem>
              <ToggleGroupItem value="row" onClick={() => setLayoutMode("row")}>
                <Columns2 size={16} />
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
        </div>
        <div className={cn('flex items-center')}>
          <Button
            variant="outline"
            className="mr-2 h-10 w-10 p-0"
            onClick={() => copyClipboard()}
          >
            <Copy size={16} />
          </Button>
          <Button
            variant="ghost"
            className="flex items-center"
            onClick={() => setOpenDialog(!openDialog)}
          >
            {openDialog ? (
              <Shrink size={16} />
            ) : (
              <Expand size={16} />
            )}
          </Button>
        </div>
      </div>
    </Suspense>
  );
};