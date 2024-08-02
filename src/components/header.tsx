import {
  Factory,
  Forklift,
  Home,
  Package,
  Package2,
  PanelLeft,
  Settings,
} from "lucide-react";
import {
  SheetContent,
  SheetTrigger,
  Sheet,
  SheetTitle,
  SheetClose,
} from "~/components/ui/sheet";
import { Button } from "~/components/ui/button";
import Link from "next/link";
import Breadcrumbs from "~/components/breadCrumbs";

import { UserButton } from "@clerk/nextjs";
import { Search } from "~/components/search";
import "@algolia/autocomplete-theme-classic";

const Header = async () => {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button size="icon" variant="outline" className="sm:hidden">
            <PanelLeft className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="sm:max-w-xs">
          <nav className="grid gap-6 text-lg font-medium">
            <SheetClose asChild>
              <Link
                href="../../../"
                className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base"
              >
                <Package2 className="h-5 w-5 transition-all group-hover:scale-110" />
                <SheetTitle className="sr-only">R&L Packaging</SheetTitle>
              </Link>
            </SheetClose>
            <SheetClose asChild>
              <Link
                href="../../dashboard"
                className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
              >
                <Home className="h-5 w-5" />
                Dashboard
              </Link>
            </SheetClose>
            <SheetClose asChild>
              <Link
                href="../../dashboard/scrap"
                className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
              >
                <Factory className="h-5 w-5" />
                Scrap Material
              </Link>
            </SheetClose>
            <SheetClose asChild>
              <Link
                href="../../dashboard/stock"
                className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
              >
                <Package className="h-5 w-5" />
                Stock Sheets
              </Link>
            </SheetClose>
            <SheetClose asChild>
              <Link
                href="../../dashboard/pallets"
                className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
              >
                <Forklift className="h-5 w-5" />
                Pallet Stock
              </Link>
            </SheetClose>
            <SheetClose asChild>
              <Link
                href="../../dashboard/settings"
                className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
              >
                <Settings className="h-5 w-5" />
                Settings
              </Link>
            </SheetClose>
          </nav>
        </SheetContent>
      </Sheet>
      <Breadcrumbs />
      <div className="relative ml-auto flex-1 text-muted-foreground md:grow-0">
        <Search />
      </div>
      <UserButton />
    </header>
  );
};

export default Header;
