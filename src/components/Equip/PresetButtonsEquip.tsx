import { Button } from "../ui/Button";

export function PresetButtonsEquip() {
  return (
    <div className="border-t pt-4 grid gap-2.5 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
      <Button className="w-full break-words whitespace-normal">Berkas Épico clean</Button>
      <Button className="w-full break-words whitespace-normal">Berkas Lendario clean</Button>
      <Button className="w-full break-words whitespace-normal">Vazio clean</Button>
      <Button className="w-full break-words whitespace-normal">Berkas Épico c/ propriedades</Button>
      <Button className="w-full break-words whitespace-normal">Berkas Lendario c/ propriedades</Button>
      <Button className="w-full break-words whitespace-normal">Vazio c/ propriedades</Button>
      <Button className="w-full break-words whitespace-normal">Berkas Épico MAX</Button>
      <Button className="w-full break-words whitespace-normal">Berkas Lendario MAX</Button>
      <Button className="w-full break-words whitespace-normal">Vazio MAX</Button>
      <Button className="w-full break-words whitespace-normal sm:col-span-2 md:col-span-3">Equipamento MAX</Button>
    </div>
  );
}
