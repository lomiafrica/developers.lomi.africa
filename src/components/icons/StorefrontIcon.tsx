import Image from "next/image";

export function StorefrontIcon({ className }: { className?: string }) {
  return (
    <Image
      src="/random/storefront.webp"
      alt="Storefront"
      className={className}
      width={20}
      height={20}
    />
  );
}
