import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { isAdminEmail } from "@/lib/access";
import { listUsers } from "@/lib/db";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  if (!isAdminEmail(session?.user?.email)) {
    redirect("/dashboard");
  }

  const users = await listUsers();
  const totalMRR = users.reduce((sum, user) => {
    if (user.status !== "active") return sum;
    if (user.plan === "agency") return sum + 99;
    if (user.plan === "pro") return sum + 29;
    return sum;
  }, 0);

  const activeUsers = users.filter((user) => user.status === "active").length;
  const trialUsers = users.filter((user) => user.status === "trial").length;

  return (
    <main className="min-h-screen bg-[#09090f] p-6 text-white">
      <header className="mx-auto mb-8 max-w-7xl">
        <div className="mb-3 inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.16em] text-zinc-300">
          Admin
        </div>
        <h1 className="text-4xl font-semibold">Admin dashboard</h1>
        <p className="mt-2 text-zinc-400">Operational snapshot for X-Teos Pro</p>
      </header>

      <div className="mx-auto mb-8 grid max-w-7xl grid-cols-1 gap-4 md:grid-cols-4">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
          <div className="text-sm text-zinc-400">Monthly MRR</div>
          <div className="mt-2 text-3xl font-semibold text-violet-300">${totalMRR}</div>
        </div>
        <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
          <div className="text-sm text-zinc-400">Active users</div>
          <div className="mt-2 text-3xl font-semibold text-emerald-300">{activeUsers}</div>
        </div>
        <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
          <div className="text-sm text-zinc-400">Trials</div>
          <div className="mt-2 text-3xl font-semibold text-amber-300">{trialUsers}</div>
        </div>
        <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
          <div className="text-sm text-zinc-400">Total users</div>
          <div className="mt-2 text-3xl font-semibold text-cyan-300">{users.length}</div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl overflow-hidden rounded-3xl border border-white/10 bg-white/5">
        <table className="w-full border-collapse">
          <thead className="bg-white/5 text-left text-xs uppercase tracking-[0.14em] text-zinc-400">
            <tr>
              <th className="px-4 py-4">User</th>
              <th className="px-4 py-4">Plan</th>
              <th className="px-4 py-4">Status</th>
              <th className="px-4 py-4">Created</th>
              <th className="px-4 py-4">Posts</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-t border-white/5">
                <td className="px-4 py-4">
                  <div className="font-medium">{user.name}</div>
                  <div className="text-sm text-zinc-400">{user.email}</div>
                </td>
                <td className="px-4 py-4 capitalize">{user.plan}</td>
                <td className="px-4 py-4 capitalize">{user.status}</td>
                <td className="px-4 py-4 text-sm text-zinc-400">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-4 text-sm text-zinc-400">{user.posts.length}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
