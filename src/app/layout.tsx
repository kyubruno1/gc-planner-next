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
      <body>
        <EquipProvider>
          <AtkTotalProvider>
            <CharacterProvider>
              {children}
              <ToastContainer position="top-right" autoClose={300000} toastClassName="text-lg bg-black text-gold border-[4px] border-primary outline-[3px] outline outline-bgdarkblue font-bold text-outline-md"
                progressClassName="fancy-progress-bar"
              />
            </CharacterProvider>
          </AtkTotalProvider>
        </EquipProvider>
      </body>
    </html>
  );
}
