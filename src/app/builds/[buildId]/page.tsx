import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { EquipView } from "../EquipView";

interface PageProps {
  params: {
    buildId: string;
  };
}

export default async function Page({ params }: PageProps) {
  const session = await getServerSession(authOptions);
  const buildId = params.buildId;

  const build = await prisma.build.findUnique({
    where: { id: buildId },
    include: {
      character: true,
      status: true,
      equipments: {
        include: {
          cards: true,
          stone: true,
        },
      },
      user: true,
      likes: true, // carrega todos os likes
      comments: {
        include: {
          user: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      },
      _count: {
        select: { likes: true },
      },
    },
  });

  if (!build) return <div className="text-white p-8">Build não encontrada</div>;

  const isLikedByUser = !!build.likes.find(
    (like) => like.userId === session?.user?.id
  );

  return (
    // <div className="gap-5 p-5 grid grid-cols-[20rem_1200px_1fr]">
    <div className="">
      <EquipView
        savedBuild={build}
        userId={session?.user?.id}
        buildId={buildId}
        initialLiked={isLikedByUser}
        initialComments={build.comments}
        likeCount={build._count.likes}
      />
    </div>
  );
}
