'use client'

import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Github } from "lucide-react";
import { CommandMenuTrigger } from "@/components/command-menu/command-menu";
import Image from "next/image";
import { Typography } from "@/components/ui/typography";
import { useTheme } from "next-themes";

export const Navbar = () => {
  const { setTheme, theme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className="flex w-full py-2 sm:py-4 justify-center border-b pl-0 pr-2 sm:px-8 top-0 z-30 sticky bg-transparent backdrop-blur transition-colors duration-300">
      <nav className="flex items-center max-w-[1400px] w-full justify-between">
        <div className="flex items-center grow">
          <Button
            className="flex items-center !no-underline transition-colors duration-300"
            asChild
            variant="link"
            onClick={toggleTheme}
          >
            <Link href="/">
              <div className="flex items-center">
                <Image
                  src="/lomi.png"
                  alt="lomi. Logo"
                  height={35}
                  width={35}
                  className="h-6 w-6 sm:h-10 mr-2 sm:w-10"
                />
                <Typography
                  variant="h3"
                  className="ml-1 text-black dark:text-white hover:text-gray-700 dark:hover:text-gray-300 transition-colors duration-300"
                >
                  lomi.
                </Typography>
              </div>
            </Link>
          </Button>
        </div>
        <div className="flex items-center">
          <CommandMenuTrigger className="mr-1 sm:mr-3" />
          <Button variant="ghost" className="px-1 sm:px-2 transition-colors duration-300" asChild>
            <Link href="https://github.com/lomiafrica/developers.lomi.africa" target="_blank">
              <Github className="h-5 w-5" />
            </Link>
          </Button>
        </div>
      </nav>
    </div>
  );
};
