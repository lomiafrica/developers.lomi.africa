import Image from "next/image";

export function TransactionsIcon({ className }: { className?: string }) {
  return (
    <Image
      src="/random/transactions.webp"
      alt="Transactions"
      className={className}
      width={20}
      height={20}
    />
  );
}
