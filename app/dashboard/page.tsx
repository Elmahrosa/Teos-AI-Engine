import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { findUserByEmail } from "@/lib/db";
import { isAdminEmail } from "@/lib/access";
import PostGenerator from "@/components/PostGenerator";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) redirect("/login");

  const user = await findUserByEmail(session.user.email);
  if (!user) redirect("/login");

  const starterUsed = user.posts.length;
  const starterLimit = 10;
  const starterRemaining = Math.max(0, starterLimit - starterUsed);

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-6 py-10">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-zinc-400">
            {user.name} · {user.email} · {user.plan} · {user.status}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {isAdminEmail(session.user.email) && (
            <Link
              href="/admin"
              className="rounded-xl border border-white/10 px-4 py-2 hover:bg-white/5"
            >
              Admin
            </Link>
          )}
        </div>
      </div>

      {user.plan === "starter" && (
        <div className="mb-6 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4">
          <p className="text-sm text-amber-100">
            Starter plan: {starterUsed}/{starterLimit} posts used.
            {starterRemaining > 0
              ? ` ${starterRemaining} remaining.`
              : " Limit reached. Upgrade to continue."}
          </p>
          <div className="mt-3 flex gap-3">
            <Link
              href="/api/subscribe?plan=pro"
              className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold hover:bg-indigo-500"
            >
              Upgrade to Pro
            </Link>
            <Link
              href="/api/subscribe?plan=agency"
              className="rounded-xl border border-white/10 px-4 py-2 text-sm hover:bg-white/5"
            >
              Go Agency
            </Link>
          </div>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <PostGenerator />

        <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="mb-3 text-xl font-semibold">Saved posts</h2>
          {user.posts.length === 0 ? (
            <p className="text-sm text-zinc-400">No generated posts yet.</p>
          ) : (
            <div className="space-y-3">
              {user.posts.map((post) => (
                <div key={post.id} className="rounded-xl border border-white/10 p-3">
                  <div className="mb-1 text-xs uppercase text-zinc-500">
                    {post.platform}
                  </div>
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
