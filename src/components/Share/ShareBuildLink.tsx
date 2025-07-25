"use client";

import { useEffect, useState } from "react";

interface ShareBuildLinkProps {
  buildId: string;
}

export function ShareBuildLink({ buildId }: ShareBuildLinkProps) {
  const [shareLink, setShareLink] = useState("");

  useEffect(() => {
    if (buildId) {
      setShareLink(`${window.location.origin}/builds/${buildId}`);
    }
  }, [buildId]);

  async function copyToClipboard() {
    if (!shareLink) return;
    try {
      await navigator.clipboard.writeText(shareLink);
      alert("Link copiado para a área de transferência!");
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      alert("Falha ao copiar link. Tente manualmente.");
    }
  }

  return (
    <div className="p-4 bg-gray-800 text-white rounded shadow-md max-w-md">
      <p className="mb-2">Compartilhe sua build usando o link abaixo:</p>
      <input
        type="text"
        readOnly
        value={shareLink}
        className="w-full p-2 rounded text-black"
        onFocus={(e) => e.target.select()}
      />
      <button
        onClick={copyToClipboard}
        className="mt-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded"
      >
        Copiar Link
      </button>
    </div>
  );
}
