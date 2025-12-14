"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  Link,
  Button,
} from "@heroui/react";
import { Sun, Moon } from "lucide-react";

const routes = [
  { label: "Home", href: "/" },
  { label: "Alarm Clock", href: "/alarm" },
  { label: "Countdown Timer", href: "/timer" },
  { label: "Holidays Timer", href: "/holidays" },
  { label: "Stopwatch", href: "/stopwatch" },
];

export default function NavigationBar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);

  // Prevent hydration mismatch
  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const isDark = theme === "dark";

  return (
    <Navbar onMenuOpenChange={setIsMenuOpen} isBordered>
      {/* LEFT */}
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden"
        />
        <NavbarBrand>
          <p className="font-bold text-inherit">TICKR</p>
        </NavbarBrand>
      </NavbarContent>

      {/* CENTER (Desktop) */}
      <NavbarContent className="hidden sm:flex gap-6" justify="center">
        {routes.map((route) => (
          <NavbarItem
            key={route.href}
            isActive={pathname === route.href}
          >
            <Link
              color={pathname === route.href ? "primary" : "foreground"}
              href={route.href}
            >
              {route.label}
            </Link>
          </NavbarItem>
        ))}
      </NavbarContent>

      {/* RIGHT (Theme Toggle Desktop) */}
      <NavbarContent justify="end" className="hidden sm:flex">
        <Button
          isIconOnly
          variant="light"
          aria-label="Toggle theme"
          onPress={() => setTheme(isDark ? "light" : "dark")}
        >
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </Button>
      </NavbarContent>

      {/* MOBILE MENU */}
      <NavbarMenu>
        {routes.map((route) => (
          <NavbarMenuItem key={route.href}>
            <Link
              className="w-full"
              href={route.href}
              size="lg"
              color={pathname === route.href ? "primary" : "foreground"}
              onClick={() => setIsMenuOpen(false)}
            >
              {route.label}
            </Link>
          </NavbarMenuItem>
        ))}

        {/* Theme Toggle (Mobile) */}
        <NavbarMenuItem>
          <Button
            fullWidth
            variant="flat"
            onPress={() => setTheme(isDark ? "light" : "dark")}
            startContent={isDark ? <Sun size={18} /> : <Moon size={18} />}
          >
            Switch to {isDark ? "Light" : "Dark"} Mode
          </Button>
        </NavbarMenuItem>
      </NavbarMenu>
    </Navbar>
  );
}
