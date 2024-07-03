"use client";
import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from "@nextui-org/navbar";
import { Link } from "@nextui-org/link";
import Image from "next/image";
import logo from "../public/bloobin_happy.png";

export default function NavBar() {
  const pathname = usePathname();
  const [activeItem, setActiveItem] = useState("");

  useEffect(() => {
    // Set the active item based on the current route
    switch (pathname) {
      case "/":
        setActiveItem("Image Search");
        break;
      case "/text-search":
        setActiveItem("Text Search");
        break;
      case "/chat":
        setActiveItem("Chat");
        break;
      default:
        setActiveItem("");
    }
  }, [pathname]);

  return (
    <Navbar className="w-full">
      <NavbarBrand>
        <Link href="/">
          <div className="cursor-pointer p-6 inline-flex items-center">
            <Image
              src="/bloobin_happy.png"
              alt="Bloo Logo Image"
              width={48}
              height={48}
            />
            <p className="font-bold">Bloo</p>
          </div>
        </Link>
      </NavbarBrand>
      <NavbarContent className="sm:flex gap-4 ">
        <NavbarItem>
          <Link
            color={activeItem === "Image Search" ? "primary" : "foreground"}
            href="/"
            className={activeItem === "Image Search" ? "font-semibold" : ""}
          >
            Image Search
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link
            color={activeItem === "Text Search" ? "primary" : "foreground"}
            href="/text-search"
            className={activeItem === "Text Search" ? "font-semibold" : ""}
          >
            Text Search
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link
            color={activeItem === "Chat" ? "primary" : "foreground"}
            href="/chat"
            className={activeItem === "Chat" ? "font-semibold" : ""}
          >
            Chat (coming soon)
          </Link>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}
