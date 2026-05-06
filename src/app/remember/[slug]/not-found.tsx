import Link from "next/link";

export default function MemorialNotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col justify-center px-6 py-20 text-center">
      <h1 className="font-display text-3xl text-foreground">
        Memorial not found
      </h1>
      <p className="mt-4 text-muted">
        This link may be incorrect, or the memorial may not be published yet.
      </p>
      <Link
        href="/"
        className="mt-10 inline-flex min-h-12 items-center justify-center rounded-full bg-foreground px-8 text-sm font-medium text-background"
      >
        Back to MemoryMint
      </Link>
    </div>
  );
}
