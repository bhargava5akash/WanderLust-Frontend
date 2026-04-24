import { useState, useEffect, useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { ThemeContext } from "@/App";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Menu, Sun, Moon, User, LogOut, LayoutDashboard, Compass } from "lucide-react";

const NAV_LINKS = [
  { to: "/destinations", label: "Destinations" },
  { to: "/planner", label: "Trip Planner" },
  { to: "/budget", label: "Budget" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useContext(ThemeContext);
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === "/";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const navBg = scrolled || !isHome
    ? "glass shadow-sm"
    : "bg-transparent";

  const textColor = (!scrolled && isHome)
    ? "text-white"
    : "text-foreground";

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navBg}`} data-testid="navbar">
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between h-16 md:h-20">
        {/* Logo */}
        <Link to="/" className={`font-bold text-xl md:text-2xl tracking-tight ${textColor}`} style={{ fontFamily: "Outfit, sans-serif" }} data-testid="navbar-logo">
          Wander<span className="text-primary">Lust</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                location.pathname === link.to ? "text-primary" : textColor + "/80"
              }`}
              data-testid={`nav-link-${link.label.toLowerCase().replace(" ", "-")}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right Side */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-full transition-colors hover:bg-white/10 ${textColor}`}
            data-testid="theme-toggle"
          >
            {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
          </button>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className={`rounded-full gap-2 ${textColor}`} data-testid="user-menu-trigger">
                  <User size={18} />
                  <span className="text-sm">{user.name}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => navigate("/dashboard")} data-testid="nav-dashboard">
                  <LayoutDashboard size={16} className="mr-2" /> Dashboard
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/planner")} data-testid="nav-planner">
                  <Compass size={16} className="mr-2" /> Trip Planner
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout} data-testid="nav-logout">
                  <LogOut size={16} className="mr-2" /> Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" className={`rounded-full text-sm ${textColor}`} onClick={() => navigate("/login")} data-testid="nav-login-btn">
                Sign In
              </Button>
              <Button className="rounded-full text-sm bg-primary text-primary-foreground hover:bg-primary/90" onClick={() => navigate("/register")} data-testid="nav-register-btn">
                Get Started
              </Button>
            </div>
          )}
        </div>

        {/* Mobile */}
        <div className="flex md:hidden items-center gap-2">
          <button onClick={toggleTheme} className={`p-2 rounded-full ${textColor}`} data-testid="mobile-theme-toggle">
            {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
          </button>
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <button className={`p-2 ${textColor}`} data-testid="mobile-menu-trigger">
                <Menu size={22} />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 pt-12">
              <nav className="flex flex-col gap-4">
                {NAV_LINKS.map(link => (
                  <Link key={link.to} to={link.to} onClick={() => setMobileOpen(false)} className="text-base font-medium py-2 hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                ))}
                <div className="border-t pt-4 mt-2">
                  {user ? (
                    <>
                      <Link to="/dashboard" onClick={() => setMobileOpen(false)} className="block py-2 text-base font-medium hover:text-primary">Dashboard</Link>
                      <button onClick={() => { handleLogout(); setMobileOpen(false); }} className="block py-2 text-base font-medium text-destructive hover:opacity-80">Logout</button>
                    </>
                  ) : (
                    <>
                      <Link to="/login" onClick={() => setMobileOpen(false)} className="block py-2 text-base font-medium hover:text-primary">Sign In</Link>
                      <Link to="/register" onClick={() => setMobileOpen(false)} className="block py-2 text-base font-medium text-primary">Get Started</Link>
                    </>
                  )}
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
