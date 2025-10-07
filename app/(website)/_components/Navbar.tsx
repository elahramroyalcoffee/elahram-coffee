"use client";
import { websiteLinks } from "@/lib/websiteLinks";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

function Navbar() {
  const pathname = usePathname();
  console.log(pathname);
  return (
    <nav>
      <ul className="flex gap-6">
        {websiteLinks.map((link, idx) => (
          <li key={idx}>
            <Link
              href={link.path}
              className={`text-black/60 hover:text-brown-600 text-lg transition  p-4 select-none
                ${
                  (
                    link.path == "/"
                      ? pathname == link.path
                      : pathname.includes(link.path)
                  )
                    ? "text-brown-600"
                    : ""
                }
                `}
            >
              {link.name}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default Navbar;
