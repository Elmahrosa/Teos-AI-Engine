import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { findUserByEmail } from "@/lib/db";
import { isAdminEmail } from "@/lib/access";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) redirect("/login");

  const user = await findUserByEmail(session.user.email);
  if (!user) redirect("/login");

  return (
    <main className="mx-auto min-h-screen max-w-5xl px-6 py-10">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-zinc-400">
            {user.name} · {user.email} · {user.plan} · {user.status}
          </p>
        </div>
        {isAdminEmail(session.user.email) && (
          <Link href="/admin" className="rounded-xl border border-white/10 px-4 py-2 hover:bg-white/5">
            Admin
          </Link>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="mb-3 text-xl font-semibold">Production baseline</h2>
          <ul className="space-y-2 text-sm text-zinc-300">
            <li>• Durable storage via PostgreSQL + Prisma</li>
            <li>• Tap webhook events are logged for idempotency</li>
            <li>• Admin access is session-based via ADMIN_EMAILS</li>
            <li>• LinkedIn remains agency-only</li>
          </ul>
        </section>

        <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="mb-3 text-xl font-semibold">Saved posts</h2>
          {user.posts.length === 0 ? (
            <p className="text-sm text-zinc-400">No generated posts yet.</p>
          ) : (
            <div className="space-y-3">
              {user.posts.map((post) => (
                <div key={post.id} className="rounded-xl border border-white/10 p-3">
                  <div className="mb-1 text-xs uppercase text-zinc-500">{post.platform}</div>
                  <div className="text-sm">{post.content}</div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
