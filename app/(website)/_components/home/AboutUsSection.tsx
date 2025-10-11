import SectionHeader from "@/components/web/ui/SectionHeader";
import Image from "next/image";
import React from "react";
import aboutUs from "@/public/home/about-us.svg";

function AboutUsSection() {
  return (
    <section className="py-[50px] mt-[50px]">
      <div className="container">
        <SectionHeader title="من نحن؟" />

        <div className="flex-center flex-wrap lg:flex-nowrap gap-8">
          <div className="max-w-[470px]">
            <h5 className="text-3xl font-bold">بن الأهرام</h5>
            <p className="mt-6 text-black/60 text-lg lg:text-2xl">
              نستورد أجود حبوب القهوة الخضراء من مختلف أنحاء العالم، لنقوم
              بتحميصها وطحنها بعناية ودقة على أيدي خبراء يمتلكون أكثر من 35
              عامًا من الشغف والخبرة في عالم القهوة. منذ بدايتنا ونحن نضع الجودة
              في المقدمة، محافظين على مذاق فريد يرضي جميع الأذواق، من عشاق
              القهوة التركية الأصيلة إلى محبي الإسبريسو القوي وحبوب القهوة
              المميزة. نفتخر بأننا لا نقدم مجرد قهوة… بل تجربة متكاملة تبدأ من
              اختيار الحبة وتنتهي بفنجان غني يحمل عبق الشغف ورفاهية المذاق.
            </p>
          </div>
          <Image
            src={aboutUs}
            alt="about us photo"
            width={604}
            height={480}
            className="max-w-[470px] w-[80%] h-auto object-cover"
          />
        </div>
      </div>
    </section>
  );
}

export default AboutUsSection;
