"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export function HeroCollectionPrint() {
  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    const fetchImages = async () => {
      const res = await fetch("/api/arts");
      const data = await res.json();
      setImages(data);
    };

    fetchImages();
  }, []);

  return (
    <>
      <div className="grid grid-cols-30 gap-0.5">
        {images.map((src, index) => (
          <div key={index} className="relative w-10 h-20">
            <Image
              src={src}
              alt={`Character ${index}`}
              fill
              className="object-cover" />
          </div>
        ))}
      </div>
    </>
  );
}
