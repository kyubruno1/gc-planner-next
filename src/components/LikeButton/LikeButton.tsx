"use client";
import { useState } from "react";

export function LikeButton({ userId, buildId, initialLiked }: {
  userId: string;
  buildId: string;
  initialLiked: boolean;
}) {
  const [liked, setLiked] = useState(initialLiked);
  const [loading, setLoading] = useState(false);

  const toggleLike = async () => {
    const method = liked ? "DELETE" : "POST";
    const url = liked
      ? `/api/builds/${buildId}/likes?userId=${encodeURIComponent(userId)}`
      : `/api/builds/${buildId}/likes`;

    const res = await fetch(url, {
      method,
      body: liked ? undefined : JSON.stringify({ userId }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();
    setLiked(data.liked);
  };

  return (
    <button
      onClick={toggleLike}
      disabled={loading}
      className="px-4 py-2 rounded bg-primary text-white hover:bg-primary-dark disabled:opacity-50"
      aria-pressed={liked}
    >
      {liked ? "💖 Descurtir" : "🤍 Curtir"}
    </button>
  );
}
