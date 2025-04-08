"use client";

import type { MDXComponents } from "mdx/types";
import dynamic from "next/dynamic";

const InfoBox = dynamic(() => import("@/components/ui/info-box"));

// For Next.js 13+ MDX configuration
const components: MDXComponents = {
  InfoBox,
};

export function useMDXComponents(): MDXComponents {
  return {
    InfoBox,
  };
}
