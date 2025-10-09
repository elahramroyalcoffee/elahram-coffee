"use client";
import { websiteLinks } from "@/lib/websiteLinks";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import { LuMenu } from "react-icons/lu";

function MobileNavbar() {
  const pathname = usePathname();
  const [openMenu, setOpenMenu] = useState(false);
  console.log(pathname);

  const isActivePath = (link: any) => {
    return link.path == "/"
      ? pathname == link.path
      : pathname.includes(link.path);
  };
  return (
    <div>
      <LuMenu
        size={28}
        className="text-brown-600 cursor-pointer"
        onClick={() => setOpenMenu(!openMenu)}
      />

      {openMenu && (
        <nav
          onClick={() => setOpenMenu(false)}
          className="fixed  bg-beige-600/98 z-20 animate-move-right  top-20 min-w-[250px] w-[500px] max-w-[80%] left-center overflow-hidden shadow-lg rounded-lg"
        >
          <ul className="flex flex-col ">
            {websiteLinks.map((link, idx) => (
              <li
                key={idx}
                className={` text-center not-last:border-b-1 not-last:border-b-brown-400/20 transition  ${
                  isActivePath(link) ? "border-b-brown-700" : ""
                }`}
              >
                <Link
                  href={link.path}
                  className={`text-black/60 hover:text-brown-700 text-xl xl:text-lg transition p-4 select-none w-full block
                      ${isActivePath(link) ? "text-brown-700" : ""}
                      `}
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </div>
  );
}

export default MobileNavbar;
