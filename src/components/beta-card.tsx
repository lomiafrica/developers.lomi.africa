import React from "react";
import { Card, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Typography } from "@/components/ui/typography";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";

const GithubLink = () => (
  <Button
    variant="default"
    asChild
    className="inline-flex py-0.5 px-1 h-fit ml-2 text-xs"
  >
    <Link href="https://github.com/lomiafrica/developers.lomi.africa" target="_blank">
      GitHub
    </Link>
  </Button>
);

export const BetaCard: React.FC<{
  className?: string;
  badge?: string;
  color?: "default" | "destructive" | "warning";
  title: React.ReactNode | string;
  tooltip?: React.ReactNode;
  trigger?: React.ReactNode | string;
  includeGithubLink?: boolean;
}> = ({
  className,
  badge,
  color = "default",
  title,
  tooltip,
  trigger,
  includeGithubLink,
}) => {
    return (
      <Card className={cn("flex items-center p-2 rounded-xl w-fit", className)}>
        <CardTitle className="flex items-center">
          {badge && (
            <Badge variant={color} className="rounded-lg">
              {badge}
            </Badge>
          )}
          {typeof title === "string" ? (
            <Typography variant="small" className={cn(badge && "ml-2")}>
              {title}
            </Typography>
          ) : (
            title
          )}
          {tooltip && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  {trigger || <Info size={16} className="ml-2" />}
                </TooltipTrigger>
                <TooltipContent>
                  {typeof tooltip === "string" ? (
                    <Typography
                      variant="muted"
                      className="max-w-sm sm:max-w-[500px]"
                    >
                      {tooltip}
                      {includeGithubLink && <GithubLink />}
                    </Typography>
                  ) : (
                    tooltip
                  )}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </CardTitle>
      </Card>
    );
  };
