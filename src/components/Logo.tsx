import Link from "next/link";

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-3">
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary">
        <span className="text-lg font-bold text-primary-foreground">S</span>
      </div>
      <h1 className="text-2xl font-bold text-foreground">S.A.N.I</h1>
    </Link>
  );
}
