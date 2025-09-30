import { signInAction } from "@/utils/actions";
import FormProvider from "@/components/global/form/FormProvider";
import SubmitButton from "@/components/global/form/SubmitButton";
import FormGroup from "@/components/global/form/FormGroup";
import Image from "next/image";
import logo from "@/public/logo.png";
import coffeBG from "@/public/coffeBG.jpg";
import type { Metadata } from "next";
import { login } from "@/utils/auth";

export const metadata: Metadata = {
  title: "Admin Login - Al Ahram",
  description:
    "Secure administrator login for Al Ahram coffee shop management system",
  robots: "noindex, nofollow",
};

export default function AdminLoginPage() {
  return (
    <div
      className="min-h-screen bg-orange-950/40 p-4 relative z-0 flex items-center justify-center"
      style={{
        backgroundImage: `url(${coffeBG.src})`,
      }}
    >
      <div className="absolute w-full h-full inset-0 bg-black/55 z-0 "></div>
      <div className="max-w-md w-full space-y-8 relative z-10">
        <div className="bg-white shadow-xl rounded-lg p-8">
          <Image
            alt="logo"
            src={logo}
            width={160}
            height={160}
            className="w-32 h-auto object-cover mx-auto mb-8"
          />

          <FormProvider action={login}>
            <div className="space-y-4">
              {/* Hidden honeypot field for bot protection */}
              <input
                type="text"
                name="website"
                style={{ display: "none" }}
                tabIndex={-1}
                autoComplete="off"
              />

              <FormGroup
                name="email"
                type="email"
                required
                label={"البريد الإلكتروني"}
                placeholder="Enter your email"
              />
              <FormGroup
                name="password"
                type="password"
                required
                label={"الرقم السري"}
                placeholder="Enter your password"
              />

              {/* Security token field */}
              <input
                type="hidden"
                name="csrf_token"
                value={Math.random().toString(36).substring(7)}
              />
            </div>

            <SubmitButton
              text={"تسجيل الدخول"}
              className="mx-auto w-fit block !mt-4 cursor-pointer"
            />
          </FormProvider>
        </div>
      </div>
    </div>
  );
}
