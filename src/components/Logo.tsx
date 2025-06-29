import Link from "next/link";
import { Bot } from "lucide-react";

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
        <Bot className="h-5 w-5" />
      </div>
      <h1 className="text-xl font-semibold text-foreground">S.A.N.I</h1>
    </Link>
  );
}
