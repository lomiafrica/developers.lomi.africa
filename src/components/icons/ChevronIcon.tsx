import { IconChevronDown, IconChevronRight } from "@tabler/icons-react";

export function ChevronIcon({
  isOpen,
  className,
}: {
  isOpen?: boolean;
  className?: string;
}) {
  const Icon = isOpen ? IconChevronDown : IconChevronRight;
  return <Icon className={className} stroke={1.5} />;
}
