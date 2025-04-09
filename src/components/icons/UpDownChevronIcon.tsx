import { useTheme } from "@/lib/hooks/use-theme";
import { cn } from "@/lib/actions/utils";

export function UpDownChevronIcon({ className }: { className?: string }) {
  const { theme } = useTheme();

  return (
    <img
      src="/random/up_down_chevron.webp"
      alt="Up Down Chevron"
      className={cn(
        className,
        theme === "dark" && "brightness-0 invert opacity-80",
      )}
      width={15}
      height={15}
    />
  );
}
