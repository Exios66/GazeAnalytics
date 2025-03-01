import { ReactNode } from "react";
import { useLocation, Link } from "wouter";
import { 
  Home, 
  LayoutDashboard, 
  Settings as SettingsIcon, 
  Info, 
  Menu, 
  X 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger, 
  SheetClose 
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [location] = useLocation();

  const navItems = [
    {
      label: "Home",
      href: "/home",
      icon: <Home className="h-5 w-5" />,
    },
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      label: "Settings",
      href: "/settings",
      icon: <SettingsIcon className="h-5 w-5" />,
    },
    {
      label: "About",
      href: "/about",
      icon: <Info className="h-5 w-5" />,
    },
  ];

  const NavLink = ({ item }: { item: typeof navItems[0] }) => {
    const isActive = location === item.href;
    
    return (
      <Link href={item.href}>
        <a className={cn(
          "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
          isActive 
            ? "bg-primary text-primary-foreground" 
            : "hover:bg-muted"
        )}>
          {item.icon}
          <span>{item.label}</span>
        </a>
      </Link>
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Mobile Header */}
      <header className="lg:hidden border-b bg-background sticky top-0 z-10">
        <div className="flex h-14 items-center px-4 justify-between">
          <div className="font-semibold text-lg">GazeAnalytics</div>
          
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <div className="flex flex-col gap-1 mt-8">
                {navItems.map((item) => (
                  <SheetClose key={item.href} asChild>
                    <NavLink item={item} />
                  </SheetClose>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      <div className="flex-1 flex">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex w-64 flex-col border-r bg-background h-screen sticky top-0">
          <div className="p-4 font-semibold text-xl">GazeAnalytics</div>
          <nav className="flex-1 p-2 space-y-1">
            {navItems.map((item) => (
              <NavLink key={item.href} item={item} />
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
} 