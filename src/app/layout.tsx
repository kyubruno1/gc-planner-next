import { SiteHeader } from "@/components/Header/SiteHeader";
import { Providers } from "@/components/Providers/Providers";
import { AtkTotalProvider } from "@/context/AtkTotalContext";
import { CharacterProvider } from "@/context/CharacterContext";
import { EquipProvider } from "@/context/EquipContext";
import { ToastContainer } from "react-toastify";
import "./globals.css";

export const metadata = {
  title: "GrandChase Planner",
  description: "Planeje e compartilhe suas builds de forma fácil",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>
        <Providers>
          <EquipProvider>
            <AtkTotalProvider>
              <CharacterProvider>
                <SiteHeader />
                <main>{children}</main>
                <ToastContainer
                  position="top-right"
                  autoClose={3000}
                  toastClassName="text-lg bg-primary text-gold border-[4px] border-primary outline-[3px] outline outline-bgdarkblue font-bold"
                  progressClassName="fancy-progress-bar"
                />
              </CharacterProvider>
            </AtkTotalProvider>
          </EquipProvider>
        </Providers>
      </body>
    </html>
  );
}
