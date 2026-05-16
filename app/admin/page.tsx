import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { isAdminEmail } from "@/lib/access";
import { listUsers } from "@/lib/db";

export default async function AdminPage() {
  let session;
  try {
    session = await getServerSession(authOptions);
  } catch {
    return (
      <div className="min-h-screen bg-[#09090f] text-white p-8 flex items-center justify-center">
        <div className="text-center max-w-md">
          <h1 className="text-xl font-bold text-red-400 mb-3">Configuration Error</h1>
          <p className="text-zinc-400 text-sm">
            AUTH_SECRET / NEXTAUTH_SECRET must be set in environment variables.
          </p>
        </div>
      </div>
    );
  }

  if (!isAdminEmail(session?.user?.email)) {
    redirect("/dashboard");
  }

  let users: any[] = [];
  try {
    users = await listUsers();
  } catch {
    return (
      <div className="min-h-screen bg-[#09090f] text-white p-8 flex items-center justify-center">
        <div className="text-center max-w-md">
          <h1 className="text-xl font-bold text-red-400 mb-3">Database Error</h1>
          <p className="text-zinc-400 text-sm">
            Could not connect to database. Check DATABASE_URL.
          </p>
        </div>
      </div>
    );
  }

  const totalMRR = users.reduce((sum: number, user: any) => {
    if (user.plan === "agency") return sum + 99;
    if (user.plan === "pro") return sum + 29;
    return sum;
  }, 0);

  const activeUsers = users.filter((user: any) => user.plan !== "free").length;
  const trialUsers = users.filter((user: any) => user.plan === "free").length;

  return (
    <main className="min-h-screen bg-[#09090f] p-6 text-white">
      <header className="mx-auto mb-8 max-w-7xl">
        <div className="mb-3 inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.16em] text-zinc-300">
          Admin
        </div>
        <h1 className="text-4xl font-semibold">Admin dashboard</h1>
        <p className="mt-2 text-zinc-400">Operational snapshot for Teos AI Engine</p>
      </header>

      <div className="mx-auto mb-8 grid max-w-7xl grid-cols-1 gap-4 md:grid-cols-4">
        {[
          { label: "Monthly MRR", value: `$${totalMRR}`, color: "text-violet-300" },
          { label: "Active users", value: activeUsers, color: "text-emerald-300" },
          { label: "Trials", value: trialUsers, color: "text-amber-300" },
          { label: "Total users", value: users.length, color: "text-cyan-300" },
        ].map(s => (
          <div key={s.label} className="rounded-3xl border border-white/10 bg-white/5 p-5">
            <div className="text-sm text-zinc-400">{s.label}</div>
            <div className={`mt-2 text-3xl font-semibold ${s.color}`}>{s.value}</div>
          </div>
        ))}
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
            {users.length === 0 ? (
              <tr><td colSpan={5} className="text-center p-8 text-zinc-500">No users yet</td></tr>
            ) : (
              users.map((user: any) => (
                <tr key={user.id} className="border-t border-white/5">
                  <td className="px-4 py-4">
                    <div className="font-medium">{user.name || "—"}</div>
                    <div className="text-sm text-zinc-400">{user.email}</div>
                  </td>
                  <td className="px-4 py-4 capitalize">{user.plan}</td>
                  <td className="px-4 py-4 capitalize">
                    {user.plan === "free" ? "trial" : "active"}
                  </td>
                  <td className="px-4 py-4 text-sm text-zinc-400">
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "—"}
                  </td>
                  <td className="px-4 py-4 text-sm text-zinc-400">
                    {user.posts?.length ?? user.totalPostsUsed ?? 0}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
