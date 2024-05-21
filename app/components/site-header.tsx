import { MainNav } from "@/components/ui/main-nav.tsx";
import { MobileNav } from "@/components/ui/mobile-nav.tsx";
import { ModeToggle } from "@/components/ui/mode-toggle.tsx";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <MainNav />
        <MobileNav />
        <div className="flex flex-1 items-center space-x-2 justify-end">
          <nav className="flex items-center">
            <ModeToggle />
          </nav>
        </div>
      </div>
    </header>
  );
}
