import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Sidebar from "@/components/Sidebar";
import type { Lot, Cluster } from "@/lib/types";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/login");
  }

  const lots = (await prisma.lot.findMany({
    include: { clusters: { orderBy: { order: "asc" } } },
    orderBy: { code: "asc" },
  })) as (Lot & { clusters: Cluster[] })[];

  return (
    <div className="flex min-h-screen">
      <Sidebar userName={session.user?.name} userEmail={session.user?.email} lots={lots} />
      <main className="flex-1 min-w-0 p-6 md:p-8">
        <div className="mx-auto max-w-6xl">{children}</div>
      </main>
    </div>
  );
}
