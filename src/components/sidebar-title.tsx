import { Typography } from "@/components/ui/typography";

export const SidebarTitle = ({
  type,
  title,
}: {
  type?: string;
  title?: string;
  route?: string;
}) => {
  if (type === "separator") {
    return (
      <div style={{ background: "cyan", textAlign: "center" }}>{title}</div>
    );
  }
  return <Typography variant="small">{title}</Typography>;
};
