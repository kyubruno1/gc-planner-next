import { AtkTotalProvider } from "@/context/AtkTotalContext";
import { CharacterProvider } from "@/context/CharacterContext";
import { EquipProvider } from "@/context/EquipContext";
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
            </CharacterProvider>
          </AtkTotalProvider>
        </EquipProvider>
      </body>
    </html>
  );
}
