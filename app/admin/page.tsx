import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { isAdminEmail } from "@/lib/access";
import { listUsers } from "@/lib/db";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);
  if (!isAdminEmail(session?.user?.email)) redirect("/dashboard");

  const users = await listUsers();
  const totalMRR = users.reduce((sum, u) => sum + (u.status === "active" ? (u.plan === "agency" ? 99 : u.plan === "pro" ? 29 : 0) : 0), 0);
  const activeUsers = users.filter((u) => u.status === "active").length;
  const trialUsers = users.filter((u) => u.status === "trial").length;

  return (
    <div className="min-h-screen bg-[#0a0a0f] p-6 text-white">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-zinc-400">X-Teos Pro</p>
      </header>

      <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-4">
        <div className="rounded-xl border border-white/10 bg-[#0f0f1a] p-4"><div className="text-sm text-zinc-400">Monthly MRR</div><div className="text-3xl font-bold text-indigo-400">${totalMRR}</div></div>
        <div className="rounded-xl border border-white/10 bg-[#0f0f1a] p-4"><div className="text-sm text-zinc-400">Active Users</div><div className="text-3xl font-bold text-emerald-400">{activeUsers}</div></div>
        <div className="rounded-xl border border-white/10 bg-[#0f0f1a] p-4"><div className="text-sm text-zinc-400">In Trial</div><div className="text-3xl font-bold text-amber-400">{trialUsers}</div></div>
        <div className="rounded-xl border border-white/10 bg-[#0f0f1a] p-4"><div className="text-sm text-zinc-400">Total Users</div><div className="text-3xl font-bold text-blue-400">{users.length}</div></div>
      </div>

      <div className="overflow-hidden rounded-xl border border-white/10 bg-[#0f0f1a]">
        <table className="w-full">
          <thead className="bg-[#1a1a2e] text-left text-xs uppercase text-zinc-400">
            <tr>
              <th className="px-4 py-3">User</th>
              <th className="px-4 py-3">Plan</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Created</th>
              <th className="px-4 py-3">Posts</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-t border-white/5">
                <td className="px-4 py-3"><div className="font-medium">{user.name}</div><div className="text-sm text-zinc-400">{user.email}</div></td>
                <td className="px-4 py-3">{user.plan}</td>
                <td className="px-4 py-3">{user.status}</td>
                <td className="px-4 py-3 text-sm text-zinc-400">{new Date(user.createdAt).toLocaleDateString()}</td>
                <td className="px-4 py-3 text-sm text-zinc-400">{user.posts.length}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
