'use client'

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Github, Sun, Moon } from "lucide-react";
import { CommandMenuTrigger } from "@/components/command-menu/command-menu";
import Image from "next/image";
import { Typography } from "@/components/ui/typography";
import { useTheme } from "next-themes";
import { XIcon } from "@/components/icons/XIcon";
import { PHIcon } from "@/components/icons/PHIcon";
import { LinkedInIcon } from "@/components/icons/LinkedInIcon";

export const Navbar = () => {
  const { setTheme, theme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  // Only access theme after component is mounted to prevent hydration mismatch
  const currentTheme = mounted ? (theme === 'system' ? systemTheme : theme) : 'light';

  const iconLinkClass = "inline-flex h-9 w-9 items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent hover:border hover:border-input transition-colors";

  return (
    <div className="sticky top-0 z-30 w-full border-b bg-background/80 backdrop-blur">
      <nav className="container flex h-14 max-w-screen-2xl items-center justify-between">
        <div className="flex items-center">
          <Link href="/" className="flex items-center space-x-2">
            {mounted ? (
              <Image
                src={currentTheme === 'dark' ? '/transparent-white.webp' : '/transparent-black.webp'}
                alt="lomi. Logo"
                height={32}
                width={32}
                className="h-8 w-8"
                priority
              />
            ) : (
              <div className="h-8 w-8" /> // Placeholder while loading
            )}
            <Typography
              variant="h3"
              className="hidden text-xl font-bold sm:inline-block"
            >
              lomi.
            </Typography>
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <CommandMenuTrigger className="w-[200px] sm:w-[250px] mr-2" />

          <div className="hidden items-center gap-3 md:flex">
            <Link
              href="https://twitter.com/lomiafrica"
              target="_blank"
              rel="noopener noreferrer"
              className={iconLinkClass}
            >
              <XIcon className="h-5 w-5" />
              <span className="sr-only">Twitter</span>
            </Link>
            <Link
              href="https://www.producthunt.com/products/lomi"
              target="_blank"
              rel="noopener noreferrer"
              className={iconLinkClass}
            >
              <PHIcon className="h-5 w-5" />
              <span className="sr-only">Product Hunt</span>
            </Link>
            <Link
              href="https://www.linkedin.com/company/lomiafri"
              target="_blank"
              rel="noopener noreferrer"
              className={iconLinkClass}
            >
              <LinkedInIcon className="h-5 w-5" />
              <span className="sr-only">LinkedIn</span>
            </Link>
            <Link
              href="https://github.com/lomiafrica/developers.lomi.africa"
              target="_blank"
              rel="noopener noreferrer"
              className={iconLinkClass}
            >
              <Github className="h-5 w-5" />
              <span className="sr-only">GitHub</span>
            </Link>
          </div>

          <div className="flex items-center">
            <div className="mx-3 h-9 w-[1px] bg-border" />
            {mounted ? (
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="h-9 w-9 text-muted-foreground hover:text-foreground hover:bg-accent hover:border hover:border-input px-0"
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
          </div>
        </div>
      </nav>
    </div>
  );
};
