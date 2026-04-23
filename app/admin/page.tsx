import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth";

export default async function AdminPage() {
  const user = await requireUser();

  if (!user.isAdmin) {
    redirect("/dashboard");
  }

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      email: true,
      plan: true,
      status: true,
      createdAt: true,
      posts: {
        select: { id: true },
      },
      billing: {
        orderBy: { createdAt: "desc" },
        take: 3,
        select: {
          id: true,
          provider: true,
          plan: true,
          status: true,
        },
      },
    },
  });

  const totalUsers = users.length;
  const starterUsers = users.filter((u) => u.plan === "starter").length;
  const proUsers = users.filter((u) => u.plan === "pro").length;
  const agencyUsers = users.filter((u) => u.plan === "agency").length;

  return (
    <main className="mx-auto min-h-screen max-w-7xl px-6 py-10 text-white">
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Admin Panel</h1>
          <p className="mt-2 text-sm text-zinc-400">
            Founder control center for Teos AI Engine
          </p>
        </div>

        <a
          href="/dashboard"
          className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm hover:bg-white/10"
        >
          Back to Dashboard
        </a>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <p className="text-sm text-zinc-400">Total Users</p>
          <p className="mt-2 text-3xl font-bold">{totalUsers}</p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <p className="text-sm text-zinc-400">Starter</p>
          <p className="mt-2 text-3xl font-bold text-zinc-200">{starterUsers}</p>
        </div>

        <div className="rounded-2xl border border-indigo-500/20 bg-indigo-500/10 p-5">
          <p className="text-sm text-indigo-300">Pro</p>
          <p className="mt-2 text-3xl font-bold text-indigo-200">{proUsers}</p>
        </div>

        <div className="rounded-2xl border border-yellow-500/20 bg-yellow-500/10 p-5">
          <p className="text-sm text-yellow-300">Agency</p>
          <p className="mt-2 text-3xl font-bold text-yellow-200">{agencyUsers}</p>
        </div>
      </div>

      <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-5">
        <h2 className="text-lg font-semibold">Users</h2>

        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-white/10 text-zinc-400">
              <tr>
                <th className="px-3 py-3">Email</th>
                <th className="px-3 py-3">Plan</th>
                <th className="px-3 py-3">Status</th>
                <th className="px-3 py-3">Posts</th>
                <th className="px-3 py-3">Billing</th>
                <th className="px-3 py-3">Created</th>
                <th className="px-3 py-3">Actions</th>
              </tr>
            </thead>

            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b border-white/5 align-top">
                  <td className="px-3 py-4">
                    <div className="font-medium text-white">{u.email}</div>
                    {u.email === "aams1969@gmail.com" ? (
                      <div className="mt-1 inline-block rounded-full bg-emerald-500/15 px-2 py-0.5 text-xs text-emerald-300">
                        Founder/Admin
                      </div>
                    ) : null}
                  </td>

                  <td className="px-3 py-4">
                    <span
                      className={`rounded-full px-2 py-1 text-xs ${
                        u.plan === "agency"
                          ? "bg-yellow-500/15 text-yellow-300"
                          : u.plan === "pro"
                          ? "bg-indigo-500/15 text-indigo-300"
                          : "bg-zinc-500/15 text-zinc-300"
                      }`}
                    >
                      {u.plan}
                    </span>
                  </td>

                  <td className="px-3 py-4">
                    <span className="rounded-full bg-white/5 px-2 py-1 text-xs text-zinc-300">
                      {u.status}
                    </span>
                  </td>

                  <td className="px-3 py-4">{u.posts.length}</td>

                  <td className="px-3 py-4 text-xs text-zinc-400">
                    {u.billing.length === 0 ? (
                      <span>No billing yet</span>
                    ) : (
                      <div className="space-y-1">
                        {u.billing.map((b) => (
                          <div key={b.id}>
                            {b.provider} · {b.plan} · {b.status}
                          </div>
                        ))}
                      </div>
                    )}
                  </td>

                  <td className="px-3 py-4 text-zinc-400">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>

                  <td className="px-3 py-4">
                    <div className="flex flex-wrap gap-2">
                      <form action="/api/admin/activate" method="POST">
                        <input type="hidden" name="email" value={u.email} />
                        <input type="hidden" name="plan" value="starter" />
                        <button className="rounded-lg border border-zinc-500/20 bg-zinc-500/10 px-3 py-1.5 text-xs text-zinc-200 hover:bg-zinc-500/20">
                          Starter
                        </button>
                      </form>

                      <form action="/api/admin/activate" method="POST">
                        <input type="hidden" name="email" value={u.email} />
                        <input type="hidden" name="plan" value="pro" />
                        <button className="rounded-lg border border-indigo-500/20 bg-indigo-500/10 px-3 py-1.5 text-xs text-indigo-200 hover:bg-indigo-500/20">
                          Pro
                        </button>
                      </form>

                      <form action="/api/admin/activate" method="POST">
                        <input type="hidden" name="email" value={u.email} />
                        <input type="hidden" name="plan" value="agency" />
                        <button className="rounded-lg border border-yellow-500/20 bg-yellow-500/10 px-3 py-1.5 text-xs text-yellow-200 hover:bg-yellow-500/20">
                          Agency
                        </button>
                      </form>

                      <form action="/api/admin/reset-posts" method="POST">
                        <input type="hidden" name="email" value={u.email} />
                        <button className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-1.5 text-xs text-red-200 hover:bg-red-500/20">
                          Reset Posts
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}