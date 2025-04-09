import { ArrowRight, LucideIcon, Phone, ArrowLeft, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ButtonExpandProps {
  text: string;
  icon?: LucideIcon;
  bgColor?: string;
  textColor?: string;
  hoverBgColor?: string;
  hoverTextColor?: string;
  onClick?: () => void;
  className?: string;
  iconPlacement?: "left" | "right";
  type?: "button" | "submit" | "reset";
  customIcon?: React.ReactNode;
  disabled?: boolean;
}

function ButtonExpand({
  text,
  icon: Icon = ArrowRight,
  bgColor = "bg-green-50 dark:bg-green-900/30",
  textColor = "text-green-700 dark:text-green-300",
  hoverBgColor = "hover:bg-green-100 dark:hover:bg-green-900/40",
  hoverTextColor = "hover:text-green-800 dark:hover:text-green-200",
  onClick,
  className,
  iconPlacement = "right",
  type = "button",
  customIcon,
  disabled,
}: ButtonExpandProps) {
  return (
    <Button
      type={type}
      variant="expandIcon"
      Icon={() => customIcon || <Icon className="h-4 w-4" />}
      iconPlacement={iconPlacement}
      className={cn(
        `text-lg sm:text-base font-medium ${textColor} ${hoverTextColor} ${bgColor} ${hoverBgColor} shadow-lg transition-all duration-300 h-[52px] sm:h-10 px-[32px] sm:px-4 focus:outline-none focus-visible:outline-none`,
        className,
        disabled && "opacity-50 cursor-not-allowed",
      )}
      onClick={onClick}
      disabled={disabled}
    >
      {text}
    </Button>
  );
}

// Pre-configured button for Talk to us action
function ButtonExpandTalkToUs() {
  return (
    <ButtonExpand
      text={"Talk to us"}
      icon={Phone}
      bgColor="bg-blue-50 dark:bg-blue-900/30"
      textColor="text-blue-700 dark:text-blue-300"
      hoverBgColor="hover:bg-blue-100 dark:hover:bg-blue-900/40"
      hoverTextColor="hover:text-blue-800 dark:hover:text-blue-200"
      onClick={() => window.open("https://cal.com/babacar-diop", "_blank")}
    />
  );
}

// Back button with specific styling
function ButtonExpandBack({
  onClick,
  text,
}: {
  onClick?: () => void;
  text: string;
}) {
  return (
    <ButtonExpand
      text={text}
      icon={ArrowLeft}
      iconPlacement="left"
      bgColor="bg-zinc-900/90 dark:bg-black/50"
      textColor="text-zinc-100 dark:text-sage-100"
      hoverTextColor="hover:text-white dark:hover:text-sage-200"
      hoverBgColor="hover:bg-zinc-900"
      className="relative z-20 inline-flex items-center transition-colors px-4 py-2 rounded-none border-zinc-800 border w-fit shadow-none backdrop-blur-sm"
      onClick={onClick}
    />
  );
}

// Logo button with hover effect
function ButtonExpandLogo({ className }: { className?: string }) {
  return (
    <div className="relative group">
      <span className="flex items-baseline text-xl font-bold">
        <span>lomi</span>
        <div className="w-[0.15em] h-[0.15em] bg-current ml-[1.5px]" />
      </span>
      <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-1">
        <span className="inline-flex items-center">
          <span className="text-[#1E4B9E] dark:text-[#4DA1F8] px-3 py-1 bg-[#E3EEFD] dark:bg-[#1E232A] text-sm font-semibold border border-transparent dark:border-[#1E232A] rounded-sm whitespace-nowrap">
            for developers
          </span>
        </span>
      </div>
    </div>
  );
}

// Mobile menu button
function ButtonExpandMobileMenu({
  onClick,
  isOpen,
}: {
  onClick: () => void;
  isOpen: boolean;
}) {
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={onClick}
      className={cn(
        "md:hidden h-9 w-9 text-foreground dark:text-white",
        "hover:bg-black/5 dark:hover:bg-white/10",
        "hover:text-foreground dark:hover:text-white",
        "rounded-sm transition-colors",
      )}
    >
      <Menu className="h-5 w-5" />
      <span className="sr-only">Toggle menu</span>
    </Button>
  );
}

export {
  ButtonExpand,
  ButtonExpandTalkToUs,
  ButtonExpandBack,
  ButtonExpandLogo,
  ButtonExpandMobileMenu,
};
