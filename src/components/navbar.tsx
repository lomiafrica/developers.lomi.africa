'use client'

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Github, Sun, Moon } from "lucide-react";
import { CommandMenuTrigger } from "@/components/command-menu/command-menu";
import { useTheme } from "next-themes";
import { XIcon } from "@/components/icons/XIcon";
import { PHIcon } from "@/components/icons/PHIcon";
import { LinkedInIcon } from "@/components/icons/LinkedInIcon";
import { JumboIcon } from "@/components/icons/JumboIcon";
import { ButtonExpandLogo, ButtonExpandMobileMenu } from "@/components/ui/button-expand";
import { cn } from "@/lib/utils";

export const Navbar = () => {
  const { setTheme, theme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Only access theme after component is mounted to prevent hydration mismatch
  const currentTheme = mounted ? (theme === 'system' ? systemTheme : theme) : 'light';

  const baseIconClass = "inline-flex h-9 w-9 items-center justify-center text-foreground/80 dark:text-muted-foreground transition-all duration-200";

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
            <CommandMenuTrigger
              className="hidden sm:flex w-[200px] sm:w-[250px] mr-2 text-foreground/80 dark:text-muted-foreground hover:text-foreground rounded-sm"
            />

            <div className="hidden items-center gap-3 md:flex">
              {/* <Link
                href="https://twitter.com/lomiafrica"
                target="_blank"
                rel="noopener noreferrer"
                className={`${baseIconClass} hover:bg-black/5 dark:hover:bg-white/10 hover:text-[#000000] dark:hover:text-[#FFFFFF] hover:border hover:border-black/10 dark:hover:border-white/20 rounded-sm`}
              >
                <XIcon className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link> */}
              {/* <Link
                href="https://www.producthunt.com/products/lomi"
                target="_blank"
                rel="noopener noreferrer"
                className={`${baseIconClass} hover:bg-[#DA552F]/5 dark:hover:bg-[#DA552F]/10 hover:text-[#DA552F] dark:hover:text-[#DA552F] hover:border hover:border-[#DA552F]/10 dark:hover:border-[#DA552F]/20 rounded-sm`}
              >
                <PHIcon className="h-[22px] w-[22px]" />
                <span className="sr-only">Product Hunt</span>
              </Link> */}
              {/* <Link
                href="https://www.linkedin.com/company/lomiafri"
                target="_blank"
                rel="noopener noreferrer"
                className={`${baseIconClass} hover:bg-[#0A66C2]/5 dark:hover:bg-[#0A66C2]/10 hover:text-[#0A66C2] dark:hover:text-[#0A66C2] hover:border hover:border-[#0A66C2]/10 dark:hover:border-[#0A66C2]/20 rounded-sm`}
              >
                <LinkedInIcon className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </Link> */}
              <Link
                href="https://github.com/lomiafrica/developers.lomi.africa"
                target="_blank"
                rel="noopener noreferrer"
                className={`${baseIconClass} hover:bg-[#6e5494]/5 dark:hover:bg-[#6e5494]/10 hover:text-[#6e5494] dark:hover:text-[#6e5494] hover:border hover:border-[#6e5494]/10 dark:hover:border-[#6e5494]/20 rounded-sm`}
              >
                <Github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </Link>
              <Link
                href="https://jumbo.lomi.africa"
                target="_blank"
                rel="noopener noreferrer"
                className={`${baseIconClass} hover:bg-green-400/5 dark:hover:bg-green-400/10 hover:text-green-400 dark:hover:text-green-400 hover:border hover:border-green-400/10 dark:hover:border-green-400/20 rounded-sm`}
              >
                <JumboIcon className="h-7 w-7" />
                <span className="sr-only">Jumbo</span>
              </Link>
            </div>

            <div className="flex items-center">
              {mounted ? (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleTheme}
                  className="h-9 w-9 text-foreground dark:text-white hover:text-amber-500 dark:hover:text-amber-400 hover:bg-amber-500/5 dark:hover:bg-amber-400/10 hover:border hover:border-amber-500/10 dark:hover:border-amber-400/20 px-0 rounded-sm"
                >
                  {currentTheme === 'dark' ? (
                    <Sun className="h-5 w-5" />
                  ) : (
                    <Moon className="h-5 w-5" />
                  )}
                  <span className="sr-only">Toggle theme</span>
                </Button>
              ) : (
                <div className="h-9 w-9" /> // Placeholder while loading
              )}
              <div className="mx-3 h-9 w-[1px] bg-border" />
              <ButtonExpandMobileMenu onClick={toggleMenu} isOpen={isMenuOpen} />
              <Link
                href="https://portal.lomi.africa"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden md:block ml-4 text-xs font-semibold text-[#366FDF] hover:text-[#4DA1F8] dark:text-[#4DA1F8] dark:hover:text-[#1E4B9E] transition-colors cursor-pointer"
              >
                Get Started
              </Link>
            </div>
          </div>
        </nav>
      </div>

      {/* Mobile Menu */}
      <div className={cn(
        "fixed inset-x-0 top-[57px] z-20 bg-background border-b md:hidden",
        "transform transition-transform duration-300 ease-in-out",
        isMenuOpen ? "translate-y-0" : "-translate-y-full"
      )}>
        <div className="container py-4 space-y-4">
          <CommandMenuTrigger
            className="w-full text-foreground/80 dark:text-muted-foreground hover:text-foreground rounded-sm"
          />
          <div className="flex flex-col space-y-2">
            <Link
              href="https://twitter.com/lomiafrica"
              className="p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-sm"
            >
              Twitter
            </Link>
            <Link
              href="https://www.producthunt.com/products/lomi"
              className="p-2 hover:bg-[#DA552F]/5 dark:hover:bg-[#DA552F]/10 rounded-sm"
            >
              Product Hunt
            </Link>
            <Link
              href="https://www.linkedin.com/company/lomiafri"
              className="p-2 hover:bg-[#0A66C2]/5 dark:hover:bg-[#0A66C2]/10 rounded-sm"
            >
              LinkedIn
            </Link>
            <Link
              href="https://github.com/lomiafrica/developers.lomi.africa"
              className="p-2 hover:bg-[#6e5494]/5 dark:hover:bg-[#6e5494]/10 rounded-sm"
            >
              GitHub
            </Link>
            <Link
              href="https://jumbo.lomi.africa"
              className="p-2 hover:bg-green-400/5 dark:hover:bg-green-400/10 text-green-400 dark:text-green-400 rounded-sm"
            >
              Jumbo
            </Link>
            <Link
              href="https://portal.lomi.africa"
              className="p-2 text-[#366FDF] hover:text-[#4DA1F8] dark:text-[#4DA1F8] dark:hover:text-[#1E4B9E]"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};
