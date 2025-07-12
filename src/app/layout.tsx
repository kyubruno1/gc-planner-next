import { SiteHeader } from "@/components/SiteHeader/SiteHeader";
import { AtkTotalProvider } from "@/context/AtkTotalContext";
import { CharacterProvider } from "@/context/CharacterContext";
import { EquipProvider } from "@/context/EquipContext";
import { ToastContainer } from "react-toastify";
import "./globals.css";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body >
        {/* <div className="absolute inset-0 bg-[url('/assets/images/login.png')] bg-cover bg-center opacity-60 z-0 " />
        <div className="relative z-1 w-full h-full bg-gradient-to-b from-bgdarkblue/80 to-bgtextdark/80"> */}
        <EquipProvider>
          <AtkTotalProvider>
            <CharacterProvider>
              <SiteHeader />
              <main>{children}</main>
              <ToastContainer position="top-right" autoClose={3000} toastClassName="text-lg bg-primary text-gold border-[4px] border-primary outline-[3px] outline outline-bgdarkblue font-bold "
                progressClassName="fancy-progress-bar"
              />
            </CharacterProvider>
          </AtkTotalProvider>
        </EquipProvider>
        {/* </div> */}
      </body>
    </html>
  );
}
