import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-bold text-foreground">404</h1>
        <h2 className="text-xl text-muted-foreground">Page Not Found</h2>
        <p className="text-sm text-muted-foreground max-w-md">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="pt-4">
          <Link
            href="/"
            className="inline-flex items-center justify-center h-9 rounded-none px-4 py-2 text-sm font-medium text-white transition-colors bg-[#D73D57] hover:bg-[#D73D57]/90 focus:outline-none"
          >
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}
