import Image from "next/image";

interface AwakeningSkillTreeProps {
  backgroundColor?: string,
  backgroundCharacter: string,
}

export function AwakeningSkillTree({ backgroundCharacter }: AwakeningSkillTreeProps) {
  const nodes = [
    { row: 1, col: 1, size: "lg" },
    { row: 1, col: 3, size: "md" },
    { row: 1, col: 7, size: "md" },
    { row: 2, col: 2, size: "md" },
    { row: 2, col: 4, size: "md" },
    { row: 2, col: 6, size: "md" },
    { row: 2, col: 8, size: "md" },
    { row: 3, col: 5, size: "lg" },
    { row: 3, col: 9, size: "lg" },
    { row: 4, col: 8, size: "md" },
    { row: 5, col: 7, size: "md" },
    { row: 6, col: 6, size: "md" },
    { row: 7, col: 5, size: "lg" },
  ];

  function getSizeClass(size: string) {
    switch (size) {
      case "lg":
        return "w-24 h-20";
      case "md":
        return "w-14 h-14";
      default:
        return "w-24 h-20";
    }
  }

  return (
    <div className="relative w-full w- max-w-[560px] aspect-[9/7] mx-auto overflow-hidden rounded border-4 border-bghovermodal shadow-dark-blue bg-bghovermodal">
      {/* Imagem de fundo absoluta */}
      <Image
        src={`/assets/images/characters/awakening/${backgroundCharacter}.webp`}
        alt={`${backgroundCharacter} background`}
        fill
        style={{ objectFit: 'contain' }}
        priority={true}
        className="absolute top-0 left-0 "
      />

      {/* Overlay para escurecer a imagem */}
      <div className="absolute inset-0 bg-black/60 " />

      {/* Conteúdo em cima */}
      <div className="relative w-full h-full grid grid-cols-9 grid-rows-7 p-4 text-white">
        {nodes.map((node, i) => (
          <div
            key={i}
            className="flex items-center justify-center"
            style={{ gridColumn: node.col, gridRow: node.row }}
          >
            <div
              className={`${getSizeClass(node.size)} relative   flex items-center justify-center overflow-visible`}
            >
              {/* <div className="relative w-[140%] h-[140%] "> */}
              <Image
                src="/assets/images/system/nucleo_de_apoio.png"
                alt="Núcleo de Apoio"
                fill
                style={{ objectFit: "cover" }}
                className=" z-1"
              />
              {/* </div> */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
