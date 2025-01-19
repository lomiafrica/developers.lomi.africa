import { useMemo } from "react";
import { cn } from "@/lib/utils";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import Image from "next/image";
import { Editor } from "@monaco-editor/react";
import { transformThemeName } from "@/components/translator/utils";

export const EditorLayout = ({ pmCode, computedTranslation, setPmCode, layoutMode, openDialog, editorTheme, className, editorBg }: {
  pmCode: string[],
  computedTranslation: string[],
  setPmCode: (code: string[]) => void,
  layoutMode: "col" | "row",
  openDialog?: boolean,
  editorTheme?: string,
  className?: string,
  editorBg?: string
}) => {
  const editorClasses = `flex [&>div]:py-1 [&>div]:!rounded-md [&>div]:overflow-hidden ${!openDialog && 'border-zinc-200 dark:border-zinc-700'}`;
  const editorOptions = {
    lineDecorationsWidth: 0,
    lineNumbersMinChars: 3,
    minimap: { enabled: false },
    wordwrap: 'off',
    wrappingIndent: 'indent',
    autoIndent: 'keep',
    formatOnType: true,
    formatOnPaste: true,
    scrollBeyondLastLine: false,
    automaticLayout: true,
    scrollbar: {
      vertical: 'hidden',
      horizontal: 'hidden'
    },
  } as any;
  const rowMode = useMemo(() => (layoutMode === "row"), [layoutMode]);
  const computedHeightClasses = useMemo(() => {
    return openDialog ? "min-h-[calc(100dvh-52px)] h-[calc(100dvh-52px)]" : rowMode ? 'h-[500px]' : 'h-[600px]'
  }, [openDialog, rowMode]);
  return (
    <div className={cn(
      "flex items-center w-full",
      openDialog ? 'min-h-[calc(100dvh-52px)]' : 'rounded-lg',
      rowMode ? "flex-row" : "flex-col",
      className
    )}
      style={{ backgroundColor: editorBg }}
    >
      <ResizablePanelGroup
        direction={
          rowMode ? "horizontal" : "vertical"
        }
        className={cn('w-full min-h-[500px] max-w-[calc(100dvw)]', !openDialog && 'border rounded-lg', computedHeightClasses)}
      >
        <ResizablePanel
          defaultSize={50}
          className={cn("flex relative", rowMode ? openDialog ? "transition-none my-1" : " my-1" : "w-full")}>
          <div className={cn(
            "absolute z-30 p-1 rounded-tl-md rounded-br-md",
            rowMode ? "bottom-2 right-1" : "bottom-1 right-2")}
          >
            <Image src="/postman.svg" alt="postman code" height={30} width={28}
              className="flex items-center pr-0.5" />
          </div>
          <Editor
            options={editorOptions}
            className={cn(editorClasses, "pl-2", rowMode ? "pr-1 py-2" : "pr-2 pt-2 pb-1")}
            height={openDialog ? rowMode ? "80dvh" : "37.5dvh" : rowMode ? 500 : 300}
            defaultLanguage="javascript"
            defaultValue={pmCode.join("\n")}
            onChange={(value) => setPmCode(value?.split("\n") || [])}
            theme={transformThemeName(editorTheme ?? "vs-dark")}
          />
        </ResizablePanel>
        <ResizableHandle className="opacity-70" />
        <ResizablePanel defaultSize={50} className={cn("flex relative", rowMode ? openDialog ? "transition-none my-1" : "my-1" : "w-full")}>
          <div className="absolute bottom-2 right-2 z-30 p-1 rounded-tl-md rounded-br-md">
            <Image src="/max.png" alt="lomi. code" height={30} width={30} />
          </div>
          <Editor
            options={editorOptions}
            className={cn(editorClasses, "pr-2", rowMode ? "pl-1 py-2" : "pl-2 pt-1 pb-2")}
            height={openDialog ? rowMode ? "calc(80dvh" : "37.5dvh" : rowMode ? 500 : 300}
            defaultLanguage="javascript"
            value={computedTranslation.join("\n")}
            theme={transformThemeName(editorTheme ?? "vs-dark")}
          />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}