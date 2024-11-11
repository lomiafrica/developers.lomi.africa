import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Github } from "lucide-react";
import { CommandMenuTrigger } from "@/components/command-menu/command-menu";
import Image from "next/image";
import { Typography } from "@/components/ui/typography";

export const Navbar = () => {
  return (
    <div className="flex w-full py-2 sm:py-4 justify-center border-b pl-0 pr-2 sm:px-8 top-0 z-30 sticky bg-transparent backdrop-blur">
      <nav className="flex items-center max-w-[1400px] w-full justify-between">
        <div className="flex items-center grow">
          <Button
            className="flex items-center group !no-underline"
            asChild
            variant="link"
          >
            <Link href="/">
              <div className="flex items-center">
                <Image
                  src="/43.png"
                  alt="lomi. Logo"
                  height={40}
                  width={40}
                  className="h-8 w-8 sm:h-10 sm:w-10 group-hover:animate-infinite group-hover:animate-wiggle"
                />
                <Typography variant="h3" className="ml-1">
                  lomi.
                </Typography>
              </div>
            </Link>
          </Button>
        </div>
        <div className="flex items-center">
          <CommandMenuTrigger className="mr-1 sm:mr-3" />
          <Button variant="ghost" className="px-1 sm:px-2" asChild>
            <Link href="https://github.com/lomiafrica/lomi-docs" target="_blank">
              <Github className="h-5 w-5" />
            </Link>
          </Button>
        </div>
      </nav>
    </div>
  );
};
