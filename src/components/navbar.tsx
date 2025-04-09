"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Sun, Moon, LogOut, Loader2, Menu, X, Newspaper, Globe, LogIn, Search } from "lucide-react";
import { useTheme } from "next-themes";
import { XIcon } from "@/components/icons/XIcon";
import { PHIcon } from "@/components/icons/PHIcon";
import { LinkedInIcon } from "@/components/icons/LinkedInIcon";
import { FacebookIcon } from "@/components/icons/FacebookIcon";
import { GitHubIcon } from "@/components/icons/GitHubIcon";
import { JumboIcon } from "@/components/icons/JumboIcon";
import {
  ButtonExpandLogo,
  ButtonExpandMobileMenu,
} from "@/components/ui/button-expand";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase/client";
import type { Session, AuthChangeEvent } from "@supabase/supabase-js";
import { AuthModal } from "@/components/auth/auth-modal";
import { toast } from "sonner";
import ModalSupportForm from "@/components/portal/modal-support-form";
import { CommandMenu } from "@/components/command-menu/command-menu";
import jsonFileCache from "@/lib/cache/fileCache.json";
import { FileCache } from "@/lib/types/fileCache";
import { Badge } from "@/components/ui/badge";

export const Navbar = () => {
  const { setTheme, theme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isDesktopMenuOpen, setIsDesktopMenuOpen] = useState(false);
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);
  const [isCommandMenuOpen, setIsCommandMenuOpen] = useState(false);

  useEffect(() => {
    setAuthLoading(true);
    supabase.auth.getSession().then(({ data: { session } }: { data: { session: Session | null } }) => {
      setSession(session);
      setAuthLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event: AuthChangeEvent, session: Session | null) => {
      setSession(session);
      if (session) {
        setIsAuthModalOpen(false);
      }
      setAuthLoading(false);
    });

    return () => subscription?.unsubscribe();
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "d" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsCommandMenuOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const openAuthModal = () => setIsAuthModalOpen(true);
  const closeAuthModal = () => setIsAuthModalOpen(false);
  const openSupportModal = () => setIsSupportModalOpen(true);
  const closeSupportModal = () => setIsSupportModalOpen(false);

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Sign out failed", { description: error.message });
    } else {
      toast.success("Signed out successfully");
    }
  };

  const currentTheme = mounted
    ? theme === "system"
      ? systemTheme
      : theme
    : "light";

  const baseIconClass =
    "inline-flex h-9 w-9 items-center justify-center text-foreground/80 dark:text-muted-foreground transition-all duration-200";

  const actionButtonStyle = "ml-4 text-xs font-semibold transition-colors cursor-pointer";
  const getStartedStyle = cn(actionButtonStyle, "text-[#366FDF] hover:text-[#4DA1F8] dark:text-[#4DA1F8] dark:hover:text-[#1E4B9E]");
  const disconnectStyle = cn(actionButtonStyle, "text-red-600 hover:text-red-500 dark:text-red-500 dark:hover:text-red-400");

  const mobileLinkStyle = "p-2 rounded-sm transition-colors";
  const mobileGetStartedStyle = cn(mobileLinkStyle, "text-[#366FDF] hover:text-[#4DA1F8] dark:text-[#4DA1F8] dark:hover:text-[#1E4B9E]");
  const mobileDisconnectStyle = cn(mobileLinkStyle, "text-red-600 hover:bg-red-500/10 dark:text-red-500 dark:hover:bg-red-500/10");

  const dropdownItemStyle = "flex items-center justify-between w-full p-2 text-sm rounded-sm cursor-pointer transition-colors hover:bg-accent dark:hover:bg-accent/50";
  const dropdownLinkStyle = `${dropdownItemStyle} focus:outline-none`;
  const dropdownButtonStyle = `${dropdownItemStyle} focus:outline-none`;

  const renderAuthButton = (isMobile = false) => {
    if (isMobile) {
      return null;
    }

    const baseStyle = actionButtonStyle;
    const getStarted = getStartedStyle;
    const disconnect = disconnectStyle;

    if (authLoading) {
      return (
        <span className={cn(baseStyle, "flex items-center text-muted-foreground", 'ml-4')}>
          <Loader2 className="h-4 w-4 animate-spin mr-2" />
          Loading...
        </span>
      );
    }

    if (session) {
      return (
        <button onClick={handleSignOut} className={disconnect}>
          Disconnect
        </button>
      );
    } else {
      return (
        <button onClick={openAuthModal} className={getStarted}>
          Get Started
        </button>
      );
    }
  };

  const DesktopDropdownContent = () => (
    <DropdownMenuContent
      className="w-60 p-2 rounded-sm border bg-background shadow-lg mr-3"
      align="end"
      sideOffset={14}
    >
      <DropdownMenuItem asChild>
        <Link href="/blog" className={cn(dropdownLinkStyle, 'group hover:text-[#E01E5A] dark:hover:text-[#E01E5A]')}>
          Blog <Globe className="h-4 w-4 ml-auto opacity-80 group-hover:text-[#E01E5A] dark:group-hover:text-[#E01E5A]" />
        </Link>
      </DropdownMenuItem>
      <DropdownMenuItem asChild>
        <Link href="https://twitter.com/lomiafrica" target="_blank" rel="noopener noreferrer" className={cn(dropdownLinkStyle, 'group hover:text-[#000000] dark:hover:text-[#FFFFFF]')}>
          Twitter <XIcon className="h-4 w-4 ml-auto opacity-80 group-hover:text-[#000000] dark:group-hover:text-[#FFFFFF]" />
        </Link>
      </DropdownMenuItem>
      <DropdownMenuItem asChild>
        <Link href="https://www.facebook.com/people/lomi/61574769796760/" target="_blank" rel="noopener noreferrer" className={cn(dropdownLinkStyle, 'group hover:text-[#1877F2] dark:hover:text-[#1877F2]')}>
          Facebook <FacebookIcon className="h-4 w-4 ml-auto opacity-80 group-hover:text-[#1877F2] dark:group-hover:text-[#1877F2]" />
        </Link>
      </DropdownMenuItem>
      <DropdownMenuItem asChild>
        <Link href="https://www.producthunt.com/products/lomi" target="_blank" rel="noopener noreferrer" className={cn(dropdownLinkStyle, 'group hover:text-[#DA552F] dark:hover:text-[#DA552F]')}>
          Product Hunt <PHIcon className="h-[20px] w-[20px] ml-auto translate-x-[2px] opacity-80 group-hover:text-[#DA552F] dark:group-hover:text-[#DA552F]" />
        </Link>
      </DropdownMenuItem>
      <DropdownMenuItem asChild>
        <Link href="https://www.linkedin.com/company/lomiafri" target="_blank" rel="noopener noreferrer" className={cn(dropdownLinkStyle, 'group hover:text-[#0A66C2] dark:hover:text-[#0A66C2]')}>
          LinkedIn <LinkedInIcon className="h-4 w-4 ml-auto opacity-80 group-hover:text-[#0A66C2] dark:group-hover:text-[#0A66C2]" />
        </Link>
      </DropdownMenuItem>
      <DropdownMenuItem asChild>
        <Link href="https://github.com/lomiafrica/developers.lomi.africa" target="_blank" rel="noopener noreferrer" className={cn(dropdownLinkStyle, 'group hover:text-[#6e5494] dark:hover:text-[#6e5494]')}>
          GitHub <GitHubIcon className="h-4 w-4 ml-auto opacity-80 group-hover:text-[#6e5494] dark:group-hover:text-[#6e5494]" />
        </Link>
      </DropdownMenuItem>
      <DropdownMenuItem asChild>
        <Link href="https://jumbo.lomi.africa" target="_blank" rel="noopener noreferrer" className={cn(dropdownLinkStyle, 'group hover:text-green-500 dark:hover:text-green-500')}>
          Jumbo <JumboIcon className="h-[22px] w-[22px] ml-auto translate-x-[3px] opacity-80 group-hover:text-green-500 dark:group-hover:text-green-500" />
        </Link>
      </DropdownMenuItem>
      <DropdownMenuSeparator className="bg-border/40 dark:bg-zinc-700/40 h-px" />
      <DropdownMenuItem
        onClick={openSupportModal}
        className={cn(
          dropdownButtonStyle,
          'group hover:text-teal-600 dark:hover:text-teal-500 hover:bg-teal-500/5 dark:hover:bg-teal-500/10'
        )}
      >
        Support
      </DropdownMenuItem>
      <DropdownMenuItem
        onClick={toggleTheme}
        className={cn(
          dropdownButtonStyle,
          'group hover:text-amber-500 dark:hover:text-amber-400 hover:bg-amber-500/5 dark:hover:bg-amber-400/10'
        )}
      >
        Toggle Theme
        {currentTheme === "dark" ? (
          <Sun className="h-4 w-4 ml-auto opacity-80 group-hover:text-amber-500 dark:group-hover:text-amber-400" />
        ) : (
          <Moon className="h-4 w-4 ml-auto opacity-80 group-hover:text-amber-500 dark:group-hover:text-amber-400" />
        )}
      </DropdownMenuItem>
      <DropdownMenuSeparator className="bg-border/40 dark:bg-zinc-700/40 h-px" />
      <DropdownMenuItem className="p-0 focus:bg-transparent">
        {authLoading ? (
          <div className={cn(dropdownButtonStyle, "text-muted-foreground justify-start")}>
            Loading... <Loader2 className="h-4 w-4 animate-spin ml-auto" />
          </div>
        ) : session ? (
          <button onClick={handleSignOut} className={cn(dropdownButtonStyle, "text-red-600 hover:text-red-500 dark:text-red-500 dark:hover:text-red-400 justify-start font-semibold")}>
            Disconnect <LogOut className="h-4 w-4 ml-auto opacity-80" />
          </button>
        ) : (
          <button onClick={openAuthModal} className={cn(dropdownButtonStyle, "text-[#366FDF] dark:text-[#4DA1F8] justify-start font-semibold")}>
            Get Started <LogIn className="h-4 w-4 ml-auto opacity-80" />
          </button>
        )}
      </DropdownMenuItem>
    </DropdownMenuContent>
  );

  return (
    <>
      <div className="sticky top-0 z-30 w-full border-b bg-background">
        <nav className="container flex h-14 max-w-screen-2xl items-center justify-between">
          <div className="flex items-center md:ml-3 -ml-6">
            <Link href="/" className="flex items-center">
              <div className="h-10 w-10 -ml-6" />
              <ButtonExpandLogo />
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <Button
              className="hidden sm:flex items-center gap-2 h-9 px-3 w-[200px] sm:w-[250px] mr-2 text-foreground/80 dark:text-muted-foreground hover:text-foreground rounded-sm border border-input bg-transparent"
              variant="outline"
              onClick={() => setIsCommandMenuOpen(true)}
            >
              <Search className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground hidden sm:inline-flex">
                Search docs
              </span>
              <Badge variant="secondary" className="ml-auto rounded-sm px-1">
                <span className="text-xs">⌘D</span>
              </Badge>
            </Button>

            <div className="hidden items-center gap-3 md:flex">
              {/* Remove individual icons */}
            </div>

            <div className="flex items-center">
              {/* Theme Toggle Button - Mobile Only */}
              <div className="md:hidden">
                {mounted ? (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleTheme}
                    className="h-9 w-9 text-foreground dark:text-white hover:text-amber-500 dark:hover:text-amber-400 hover:bg-amber-500/5 dark:hover:bg-amber-400/10 hover:border hover:border-amber-500/10 dark:hover:border-amber-400/20 px-0 rounded-sm"
                  >
                    {currentTheme === "dark" ? (
                      <Sun className="h-5 w-5" />
                    ) : (
                      <Moon className="h-5 w-5" />
                    )}
                    <span className="sr-only">Toggle theme</span>
                  </Button>
                ) : (
                  <div className="h-9 w-9" /> // Placeholder for SSR
                )}
              </div>

              {/* Vertical Separator - Mobile Only */}
              <div className="h-6 w-px bg-border mx-2 md:hidden" />

              {/* Mobile Menu Button - Wrap in div for conditional display */}
              <div className="md:hidden">
                <ButtonExpandMobileMenu
                  onClick={toggleMobileMenu}
                  isOpen={isMobileMenuOpen}
                />
              </div>

              {/* Desktop Menu Button */}
              <DropdownMenu open={isDesktopMenuOpen} onOpenChange={setIsDesktopMenuOpen}>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="hidden md:inline-flex h-9 w-9 text-foreground/80 dark:text-muted-foreground hover:bg-accent dark:hover:bg-accent/50 rounded-sm"
                  >
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Open Menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DesktopDropdownContent />
              </DropdownMenu>
            </div>
          </div>
        </nav>
      </div>

      <div
        className={cn(
          "fixed inset-x-0 top-[57px] z-20 bg-background border-b md:hidden",
          "transform transition-transform duration-300 ease-in-out",
          isMobileMenuOpen ? "translate-y-0" : "-translate-y-full",
        )}
        onClick={() => setIsMobileMenuOpen(false)}
      >
        <div className="container py-4 space-y-4">
          <Button
            className="flex items-center gap-2 h-9 px-3 w-full text-foreground/80 dark:text-muted-foreground hover:text-foreground rounded-sm border border-input bg-transparent"
            variant="outline"
            onClick={() => {
              setIsMobileMenuOpen(false);
              setIsCommandMenuOpen(true);
            }}
          >
            <Search className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground hidden sm:inline-flex">
              Search docs
            </span>
            <Badge variant="secondary" className="ml-auto rounded-sm px-1">
              <span className="text-xs">⌘D</span>
            </Badge>
          </Button>
          <div className="flex flex-col space-y-2">
            <Link
              href="/blog"
              className="group flex items-center justify-between p-2 hover:bg-accent dark:hover:bg-accent/50 hover:text-[#E01E5A] dark:hover:text-[#E01E5A] rounded-sm"
            >
              Blog <Globe className="h-4 w-4 ml-auto opacity-80 group-hover:text-[#E01E5A] dark:group-hover:text-[#E01E5A]" />
            </Link>
            <Link
              href="https://twitter.com/lomiafrica"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between p-2 hover:bg-black/5 dark:hover:bg-white/10 hover:text-[#000000] dark:hover:text-[#FFFFFF] rounded-sm"
            >
              Twitter <XIcon className="h-4 w-4 ml-auto opacity-80 group-hover:text-[#000000] dark:group-hover:text-[#FFFFFF]" />
            </Link>
            <Link
              href="https://www.facebook.com/people/lomi/61574769796760/"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between p-2 hover:bg-blue-500/5 dark:hover:bg-blue-500/10 hover:text-[#1877F2] dark:hover:text-[#1877F2] rounded-sm"
            >
              Facebook <FacebookIcon className="h-4 w-4 ml-auto opacity-80 group-hover:text-[#1877F2] dark:group-hover:text-[#1877F2]" />
            </Link>
            <Link
              href="https://www.producthunt.com/products/lomi"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between p-2 hover:bg-[#DA552F]/5 dark:hover:bg-[#DA552F]/10 hover:text-[#DA552F] dark:hover:text-[#DA552F] rounded-sm"
            >
              Product Hunt <PHIcon className="h-5 w-5 ml-auto opacity-80 translate-x-[3px] group-hover:text-[#DA552F] dark:group-hover:text-[#DA552F]" />
            </Link>
            <Link
              href="https://www.linkedin.com/company/lomiafri"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between p-2 hover:bg-[#0A66C2]/5 dark:hover:bg-[#0A66C2]/10 hover:text-[#0A66C2] dark:hover:text-[#0A66C2] rounded-sm"
            >
              LinkedIn <LinkedInIcon className="h-4 w-4 ml-auto opacity-80 group-hover:text-[#0A66C2] dark:group-hover:text-[#0A66C2]" />
            </Link>
            <Link
              href="https://github.com/lomiafrica/developers.lomi.africa"
              target="_blank"
              rel="noopener noreferrer"
              className={cn(mobileLinkStyle, "group flex items-center justify-between hover:bg-[#6e5494]/5 dark:hover:bg-[#6e5494]/10 hover:text-[#6e5494] dark:hover:text-[#6e5494]")}
            >
              GitHub <GitHubIcon className="h-4 w-4 ml-auto opacity-80 group-hover:text-[#6e5494] dark:group-hover:text-[#6e5494]" />
            </Link>
            <Link
              href="https://jumbo.lomi.africa"
              target="_blank"
              rel="noopener noreferrer"
              className={cn(mobileLinkStyle, "group flex items-center justify-between hover:bg-green-400/5 dark:hover:bg-green-400/10 text-green-400 dark:text-green-400 hover:text-green-500 dark:hover:text-green-500")}
            >
              Jumbo <JumboIcon className="h-[24px] w-[24px] ml-auto opacity-80 translate-x-[3px] group-hover:text-green-500 dark:group-hover:text-green-500" />
            </Link>
          </div>
        </div>
      </div>

      <AuthModal isOpen={isAuthModalOpen} onClose={closeAuthModal} />
      <ModalSupportForm isOpen={isSupportModalOpen} onClose={closeSupportModal} />
      <CommandMenu
        open={isCommandMenuOpen}
        setOpen={setIsCommandMenuOpen}
        fileCache={jsonFileCache as FileCache}
        key="command_menu_navbar"
      />
    </>
  );
};
