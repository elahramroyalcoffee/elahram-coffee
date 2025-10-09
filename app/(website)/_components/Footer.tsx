import React from "react";
import logo from "@/public/brownLogo.svg";
import Image from "next/image";
import { websiteLinks } from "@/lib/websiteLinks";
import Link from "next/link";
import phone from "@/public/icons/phone.svg";
import map from "@/public/icons/mappin.svg";
import file from "@/public/icons/file.svg";

function Footer() {
  return (
    <footer className="py-[50px] container grid lg:grid-cols-2 mt-[120px]">
      <div className="flex-center  gap-4 ">
        <div>
          <Image
            src={logo}
            alt="logo"
            width={100.98}
            height={104.97}
            className=""
          />
        </div>
        <p className="font-cairo text-gray-300 max-w-[392px]">
          نستورد أجود حبوب القهوة الخضراء العالمية ليتم تحميصها وطحنها بعناية
          ودقة وبخبرة 35 عامًا من شغفنا بالقهوة نفتخر بحفاظنا على مذاق متميز
          وسعي دائم لارضاء كافة الاذواق من عشاق القهوة
        </p>
      </div>
      <div className="grid lg:grid-cols-2">
        <div className="flex flex-col gap-4">
          <span className="font-cairo text-xl text-black/50 font-semibold">
            روابط سريعة
          </span>
          <ul className="flex flex-col gap-2 ">
            {websiteLinks.map((link, index) => (
              <li
                key={index}
                className="text-gray-400  hover:text-gray-600 transition font-cairo"
              >
                <Link href={link.path}>{link.name}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col gap-4">
          <span className="font-cairo text-xl text-black/50 font-semibold">
            معلومات الإتصال
          </span>
          <ul className="flex flex-col gap-2 ">
            <li className="text-gray-400  hover:text-gray-600 transition font-cairo flex items-center gap-2">
              <Image src={phone} alt="phone" />
              <span className="flex" dir="ltr">
                +201550604021
              </span>
            </li>
            <li className="text-gray-400  hover:text-gray-600 transition font-cairo flex items-center gap-2">
              <Image src={map} alt="phone" />
              <span className="flex" dir="ltr">
                دكرنس - المنصوره
              </span>
            </li>
            <li className="text-gray-400  hover:text-gray-600 transition font-cairo flex items-center gap-2">
              <Image src={file} alt="phone" />
              <span className="flex" dir="ltr">
                2244879652
              </span>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
