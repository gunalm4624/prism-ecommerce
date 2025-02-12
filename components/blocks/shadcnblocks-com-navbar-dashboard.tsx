"use client"

import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@radix-ui/react-accordion";
import { NavigationMenu, NavigationMenuList } from "@radix-ui/react-navigation-menu";
import { JSX, useState } from "react";
import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "../ui/sheet";
import { User, Menu, ShoppingCart } from "lucide-react";
import { ShoppingCartSheet } from "@/app/dashboard/cart/page";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth } from "../../lib/firebaseClient"; // Import the Firebase auth object
import Image from 'next/image'

interface MenuItem {
  title: string;
  url: string;
  description?: string;
  icon?: JSX.Element;
  items?: MenuItem[];
}

interface NavbarDashboardProps {
  logo?: {
    url: string;
    src: string;
    alt: string;
    title: string;
  };
  menu?: MenuItem[];
  mobileExtraLinks?: {
    name: string;
    url: string;
  }[];

}

export const NavbarDashboard = ({
  logo = {
    url: "https://prismdesign.in",
    src: "/images/prism-logo.svg",
    alt: "logo",
    title: "prism",
  },
  menu = [
    { title: "Home", url: "/dashboard" },
    { title: "Products", url: "/dashboard/products" },
    { title: "My Orders", url: "/dashboard/orders" },
  ],
  mobileExtraLinks = [
    { name: "Press", url: "#" },
    { name: "Contact", url: "#" },
    { name: "Imprint", url: "#" },
    { name: "Sitemap", url: "#" },
  ],

}: NavbarDashboardProps) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const router = useRouter();

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth); // Use the Firebase auth object here
      setDropdownOpen(false); // Close dropdown on logout
      router.push("/auth/signin"); // Redirect to login
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <section className="">
      <div className="">
        <nav className="hidden justify-between lg:flex">
          <div className="flex items-center gap-6">
            <a href={logo.url} className="flex items-center gap-2">
              <Image
                src={logo.src}
                alt={logo.alt}
                width={32}
                height={32}
                className="w-8"
              />
              <span className="text-lg font-semibold">{logo.title}</span>
            </a>
            <div className="flex items-center">
              <NavigationMenu>
                <NavigationMenuList>
                  {menu.map((item) => renderMenuItem(item))}
                </NavigationMenuList>
              </NavigationMenu>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <ShoppingCartSheet />
            <div className="relative">
              <Button variant="outline" size="icon" className="relative">
                <User className="w-6 h-6 cursor-pointer" onClick={toggleDropdown} />
              </Button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg">
                  <button
                    onClick={handleLogout}
                    className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </nav>

        {/* Mobile Navbar */}
        <div className="block lg:hidden">
          <div className="flex items-center justify-between">
            <a href={logo.url} className="flex items-center gap-2">
              <Image
                src={logo.src}
                alt={logo.alt}
                width={32}
                height={32}
                className="w-8"
              />
              <span className="text-lg font-semibold">{logo.title}</span>
            </a>
            <div>
            <ShoppingCartSheet/>

            <Sheet>
              <SheetTrigger asChild>

                <Button variant="outline" size="icon">
                  <Menu className="size-4" />
                </Button>
              </SheetTrigger>
              <SheetContent className="overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>
                    <a href={logo.url} className="flex items-center gap-2">
                      <Image
                        src={logo.src}
                        alt={logo.alt}
                        width={32}
                        height={32}
                        className="w-8"
                      />
                      <span className="text-lg font-semibold">
                        {logo.title}
                      </span>
                    </a>
                  </SheetTitle>
                </SheetHeader>
                <div className="my-6 flex flex-col gap-6">
                  <Accordion
                    type="single"
                    collapsible
                    className="flex w-full flex-col gap-4"
                  >
                    {menu.map((item) => renderMobileMenuItem(item))}
                  </Accordion>
                  <div className="border-t py-4">
                    <div className="grid grid-cols-2 justify-start">
                      {mobileExtraLinks.map((link, idx) => (
                        <a
                          key={idx}
                          className="inline-flex h-10 items-center gap-2 whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-accent-foreground"
                          href={link.url}
                        >
                          {link.name}
                        </a>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col gap-3">
                    <Button onClick={handleLogout} variant="outline">
                      Logout
                    </Button>
               
                  </div>
                </div>
              </SheetContent>
            </Sheet>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const renderMenuItem = (item: MenuItem) => {
  return (
    <a
      key={item.title}
      className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-accent-foreground"
      href={item.url}
    >
      {item.title}
    </a>
  );
};

const renderMobileMenuItem = (item: MenuItem) => {
  return (
    <AccordionItem key={item.title} value={item.title} className="border-b-0">
      <AccordionTrigger className="py-0 font-semibold hover:no-underline">
        {item.title}
      </AccordionTrigger>
      <AccordionContent className="mt-2">
        <a
          key={item.title}
          className="flex select-none gap-4 rounded-md p-3 leading-none outline-none transition-colors hover:bg-muted hover:text-accent-foreground"
          href={item.url}
        >
          {item.title}
        </a>
      </AccordionContent>
    </AccordionItem>
  );
};