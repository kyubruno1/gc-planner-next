import Image from "next/image";

interface TEMPORARYRunesProps { }

export function TEMPORARYRunes(props: TEMPORARYRunesProps) {
  const runes = ["circle", "shield", "diamond", "pentagon", "hexagon"];

  return (
    <div className="flex gap-2">
      {runes.map((rune, index) => (
        <div
          key={index}
          className="w-20 h-20 bg-bghovermodal rounded flex items-center justify-center"
        >
          <Image
            src={`/assets/images/system/runes/${rune}.png`}
            alt={rune}
            width={70}
            height={70}
          />
        </div>
      ))}
    </div>
  );
}
