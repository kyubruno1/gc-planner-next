interface CardCollectionProps {
  collectionLevel: number
}

export function CardCollectionLevel({ collectionLevel }: CardCollectionProps) {
  return (
    <div className="relative w-fit">
      <div className="clip-hex bg-gradient-to-r from-yellow-400 to-yellow-600 border-2 border-yellow-700 px-6 py-2 shadow-md text-white text-sm font-bold relative flex items-center gap-2">
        <div className="relative w-6 h-6">
          {/* <img src="/assets/images/logo_retangulo_header.png" alt="Ícone" className="w-6 h-6" /> */}
          <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-xs font-bold bg-white text-black px-1 rounded">
            {collectionLevel}
          </span>
        </div>
        <span className="drop-shadow-sm">RECOMPENSAS DE COLEÇÃO</span>
      </div>
    </div>

  )
}
