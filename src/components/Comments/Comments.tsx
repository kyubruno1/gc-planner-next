"use client";

import { useState } from "react";

interface Comment {
  id: string;
  userId: string;
  user: {
    name?: string;
    image?: string;
  };
  content: string;
  createdAt: string;
}

interface CommentsProps {
  buildId: string;
  userId?: string;
  initialComments: Comment[];
}

export function Comments({ buildId, userId, initialComments }: CommentsProps) {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!newComment.trim()) return;

    setLoading(true);

    try {
      // Envia o comentário para sua API
      const res = await fetch(`/api/builds/${buildId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, content: newComment }),
      });

      if (!res.ok) throw new Error("Erro ao enviar comentário");

      const savedComment = await res.json();

      // Atualiza lista local
      setComments([savedComment, ...comments]);
      setNewComment("");
    } catch (error) {
      alert("Erro ao enviar comentário");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h3 className="text-lg font-semibold mb-3">Comentários</h3>

      {userId ? (
        <form onSubmit={handleSubmit} className="mb-4">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Escreva seu comentário..."
            rows={3}
            className="w-full p-2 border rounded resize-none"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !newComment.trim()}
            className="mt-2 px-4 py-2 bg-primary text-white rounded disabled:opacity-50"
          >
            {loading ? "Enviando..." : "Enviar comentário"}
          </button>
        </form>
      ) : (
        <p>Faça login para adicionar comentários.</p>
      )}

      <ul>
        {comments.length === 0 && <li>Nenhum comentário ainda.</li>}
        {comments.map((comment) => (
          <li key={comment.id} className="mb-3 border-b pb-2">
            <div className="flex items-center gap-2 mb-1">
              {comment.user.image && (
                <img
                  src={comment.user.image}
                  alt={comment.user.name || "Usuário"}
                  className="w-6 h-6 rounded-full"
                />
              )}
              <strong>{comment.user.name || "Anônimo"}</strong>
              <span className="text-xs text-gray-500 ml-auto">
                {new Date(comment.createdAt).toLocaleString()}
              </span>
            </div>
            <p>{comment.content}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
