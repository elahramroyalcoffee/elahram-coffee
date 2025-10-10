"use client";
import { websiteLinks } from "@/lib/websiteLinks";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

function Navbar() {
  const pathname = usePathname();
  return (
    <nav>
      <ul className="flex gap-5">
        {websiteLinks.map((link, idx) => (
          <li key={idx}>
            <Link
              href={link.path}
              className={`relative text-black/60 hover:text-brown-700 focus:text-brown-700  group transition  p-2 select-none font-semibold text-lg
                ${
                  (
                    link.path == "/"
                      ? pathname == link.path
                      : pathname?.includes(link.path)
                  )
                    ? "text-brown-700"
                    : ""
                }
                `}
            >
              {link.name}
              <span
                className={`absolute top-[86%] rounded-full right-[7%] w-0  h-0.5 bg-brown-600 group-hover:w-[86%] group-focus:w-[86%] transition-all duration-400
                ${
                  (
                    link.path == "/"
                      ? pathname == link.path
                      : pathname?.includes(link.path)
                  )
                    ? "w-[86%] h-0.5"
                    : ""
                }
                `}
              ></span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default Navbar;
