'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';

type UserRow = {
  id: string;
  email: string;
  name: string | null;
  plan: string;
  status: string;
  createdAt: string;
  posts: { id: string }[];
};
type BillingRow = {
  id: string;
  userId: string | null;
  plan: string;
  provider: string;
  amount: number | null;
  network: string | null;
  txHash: string | null;
  status: string;
  createdAt: string;
  user: { email: string } | null;
};

const planColor: Record<string, string> = {
  agency: 'bg-purple-500/20 text-purple-300',
  pro: 'bg-indigo-500/20 text-indigo-300',
  starter: 'bg-zinc-500/20 text-zinc-300',
};

function StatCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
      <div className="text-xs font-medium uppercase tracking-wide text-zinc-400">{label}</div>
      <div className="mt-2 text-3xl font-bold text-white">{value}</div>
      {sub && <div className="mt-1 text-xs text-zinc-500">{sub}</div>}
    </div>
  );
}

export default function AdminPage() {
  const router = useRouter();
  const [users, setUsers] = useState<UserRow[]>([]);
  const [billing, setBilling] = useState<BillingRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [activating, setActivating] = useState<string | null>(null);
  const [manualTarget, setManualTarget] = useState<{ userId: string; email: string } | null>(null);
  const [manualPlan, setManualPlan] = useState<'pro' | 'agency'>('pro');
  const [message, setMessage] = useState<string | null>(null);
  const [copiedAddr, setCopiedAddr] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    const res = await fetch('/api/admin/data');
    if (res.status === 403) { router.push('/dashboard'); return; }
    if (res.status === 401) { router.push('/login'); return; }
    const data = await res.json();
    setUsers(data.users || []);
    setBilling(data.billing || []);
    setLoading(false);
  }, [router]);

  useEffect(() => { fetchData(); }, [fetchData]);

  async function approve(ev: BillingRow) {
    if (!ev.userId) return;
    setActivating(ev.id);
    setMessage(null);
    const res = await fetch('/api/admin/activate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ billingEventId: ev.id, userId: ev.userId, plan: ev.plan }),
    });
    setMessage(res.ok ? `✓ Approved: ${ev.user?.email} → ${ev.plan}` : '✗ Approval failed. Check server logs.');
    setActivating(null);
    if (res.ok) fetchData();
  }

  async function manualActivate() {
    if (!manualTarget) return;
    setActivating('manual');
    setMessage(null);
    const res = await fetch('/api/admin/manual-activate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: manualTarget.userId, plan: manualPlan }),
    });
    const data = await res.json();
    setMessage(res.ok ? `✓ Manually activated: ${manualTarget.email} → ${manualPlan}` : `✗ ${data.error || 'Failed'}`);
    setActivating(null);
    setManualTarget(null);
    if (res.ok) fetchData();
  }

  async function copyToClipboard(text: string, label: string) {
    await navigator.clipboard.writeText(text);
    setCopiedAddr(label);
    setTimeout(() => setCopiedAddr(null), 2000);
  }

  if (loading) return (
    <main className="flex min-h-screen items-center justify-center bg-[#0a0a0f] text-white">
      <p className="text-zinc-400">Loading admin data...</p>
    </main>
  );

  const pending = billing.filter(b => b.status === 'pending');
  const confirmed = billing.filter(b => b.status === 'confirmed');
  const totalRevenue = confirmed.reduce((s, b) => s + (b.amount || 0), 0);
  const totalPosts = users.reduce((s, u) => s + u.posts.length, 0);
  const proUsers = users.filter(u => u.plan === 'pro').length;
  const agencyUsers = users.filter(u => u.plan === 'agency').length;
  const mrr = proUsers * 29 + agencyUsers * 99;

  const USDC_ADDR = process.env.NEXT_PUBLIC_USDC_SOL_ADDRESS || '59sj62fWNmVWRFhMQER8XEgR8CKNswTrb5kMJEMp8g8Y';
  const PI_ADDR = process.env.NEXT_PUBLIC_PI_ADDRESS || 'MALYJFJ5SVD45FBWN2GT4IW67SEZ3IBOFSBSPUFCWV427NBNLG3PWAAAAAAAAAMHQDECQ';

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-6 py-10 text-white">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Founder Dashboard</h1>
          <p className="mt-1 text-sm text-zinc-400">Teos AI Engine · Elmahrosa International</p>
        </div>
        <div className="flex gap-3">
          <a href="/dashboard" className="rounded-lg border border-white/20 px-4 py-2 text-sm hover:bg-white/5">
            My Dashboard
          </a>
          <a href="/" className="rounded-lg border border-white/20 px-4 py-2 text-sm hover:bg-white/5">
            Landing page
          </a>
        </div>
      </div>

      {/* Alerts */}
      {message && (
        <div className={`mt-4 rounded-xl border px-4 py-3 text-sm ${message.startsWith('✓') ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300' : 'border-red-500/30 bg-red-500/10 text-red-300'}`}>
          {message}
        </div>
      )}
      {pending.length > 0 && (
        <div className="mt-4 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
          ⚠ {pending.length} payment{pending.length > 1 ? 's' : ''} waiting for approval
        </div>
      )}

      {/* Stats */}
      <section className="mt-8 grid gap-4 md:grid-cols-5">
        <StatCard label="Total users" value={users.length} />
        <StatCard label="Pro users" value={proUsers} />
        <StatCard label="Agency users" value={agencyUsers} />
        <StatCard label="Est. MRR" value={`$${mrr}`} sub="based on confirmed plans" />
        <StatCard label="Total revenue" value={`$${totalRevenue.toFixed(0)}`} sub="confirmed payments" />
      </section>
      <section className="mt-4 grid gap-4 md:grid-cols-3">
        <StatCard label="Posts saved" value={totalPosts} />
        <StatCard label="Billing events" value={billing.length} />
        <StatCard label="Pending" value={pending.length} sub="awaiting approval" />
      </section>

      {/* Wallet addresses quick copy */}
      <section className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5">
        <h2 className="mb-3 text-base font-semibold text-white">Payment addresses</h2>
        <div className="space-y-2">
          {[
            { label: 'USDC (Solana)', addr: USDC_ADDR },
            { label: 'Pi Network', addr: PI_ADDR },
          ].map(({ label, addr }) => (
            <div key={label} className="flex items-center gap-3">
              <span className="w-32 text-xs text-zinc-400 shrink-0">{label}</span>
              <code className="flex-1 truncate rounded bg-white/5 px-2 py-1 text-xs text-zinc-300 font-mono">{addr}</code>
              <button
                onClick={() => copyToClipboard(addr, label)}
                className="shrink-0 rounded-lg border border-white/20 px-3 py-1 text-xs hover:bg-white/10"
              >
                {copiedAddr === label ? '✓ Copied' : 'Copy'}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Pending approvals */}
      <section className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-6">
        <h2 className="text-xl font-semibold">
          Pending approvals{' '}
          {pending.length > 0 && (
            <span className="ml-2 rounded-full bg-amber-500/20 px-2 py-0.5 text-xs text-amber-300">
              {pending.length}
            </span>
          )}
        </h2>
        {pending.length === 0 ? (
          <p className="mt-3 text-sm text-zinc-400">No pending payments. All clear.</p>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-zinc-400">
                <tr>
                  <th className="py-2 pr-4">User</th>
                  <th className="pr-4">Plan</th>
                  <th className="pr-4">Provider</th>
                  <th className="pr-4">Amount</th>
                  <th className="pr-4">TX Hash</th>
                  <th className="pr-4">Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {pending.map((ev) => (
                  <tr key={ev.id} className="border-t border-white/10">
                    <td className="py-3 pr-4">{ev.user?.email || '—'}</td>
                    <td className="pr-4">
                      <span className={`rounded-full px-2 py-0.5 text-xs ${planColor[ev.plan] || planColor.starter}`}>
                        {ev.plan}
                      </span>
                    </td>
                    <td className="pr-4">{ev.provider}</td>
                    <td className="pr-4">{ev.amount ? `$${ev.amount}` : '—'}</td>
                    <td className="max-w-[140px] truncate pr-4 font-mono text-xs text-zinc-400">
                      {ev.txHash ? (
                        <button
                          onClick={() => copyToClipboard(ev.txHash!, 'tx-' + ev.id)}
                          className="hover:text-white"
                          title={ev.txHash}
                        >
                          {ev.txHash.slice(0, 12)}…
                        </button>
                      ) : '—'}
                    </td>
                    <td className="pr-4 text-xs text-zinc-500">
                      {new Date(ev.createdAt).toLocaleDateString()}
                    </td>
                    <td>
                      <button
                        onClick={() => approve(ev)}
                        disabled={activating === ev.id || !ev.userId}
                        className="rounded-lg bg-emerald-600 px-3 py-1 text-xs font-medium text-white hover:bg-emerald-500 disabled:opacity-50"
                      >
                        {activating === ev.id ? 'Approving…' : 'Approve ✓'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Manual plan activation (for you as founder / for support) */}
      <section className="mt-6 rounded-2xl border border-indigo-500/20 bg-indigo-500/5 p-6">
        <h2 className="text-xl font-semibold">Manual plan activation</h2>
        <p className="mt-1 text-sm text-zinc-400">
          Use this to activate your own account or resolve support issues without a billing event.
        </p>
        {!manualTarget ? (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-zinc-400">
                <tr>
                  <th className="py-2 pr-4">Email</th>
                  <th className="pr-4">Current plan</th>
                  <th className="pr-4">Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-t border-white/10">
                    <td className="py-3 pr-4">{u.email}</td>
                    <td className="pr-4">
                      <span className={`rounded-full px-2 py-0.5 text-xs ${planColor[u.plan] || planColor.starter}`}>
                        {u.plan}
                      </span>
                    </td>
                    <td className="pr-4">
                      <span className={`rounded-full px-2 py-0.5 text-xs ${u.status === 'active' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-zinc-500/20 text-zinc-300'}`}>
                        {u.status}
                      </span>
                    </td>
                    <td>
                      <button
                        onClick={() => setManualTarget({ userId: u.id, email: u.email })}
                        className="rounded-lg border border-indigo-500/40 px-3 py-1 text-xs text-indigo-300 hover:bg-indigo-500/10"
                      >
                        Activate plan
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-end">
            <div>
              <p className="text-sm text-white">User: <span className="font-medium text-indigo-300">{manualTarget.email}</span></p>
              <label className="mt-2 block text-xs text-zinc-400">Select plan to activate</label>
              <select
                value={manualPlan}
                onChange={(e) => setManualPlan(e.target.value as 'pro' | 'agency')}
                className="mt-1 rounded-lg border border-white/20 bg-[#111118] px-3 py-2 text-sm text-white"
              >
                <option value="pro">Pro</option>
                <option value="agency">Agency</option>
              </select>
            </div>
            <div className="flex gap-2">
              <button
                onClick={manualActivate}
                disabled={activating === 'manual'}
                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 disabled:opacity-50"
              >
                {activating === 'manual' ? 'Activating…' : 'Confirm activate'}
              </button>
              <button
                onClick={() => setManualTarget(null)}
                className="rounded-lg border border-white/20 px-4 py-2 text-sm hover:bg-white/5"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </section>

      {/* All billing */}
      <section className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-6">
        <h2 className="text-xl font-semibold">All billing events</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-zinc-400">
              <tr>
                <th className="py-2 pr-4">User</th>
                <th className="pr-4">Plan</th>
                <th className="pr-4">Provider</th>
                <th className="pr-4">Amount</th>
                <th className="pr-4">Status</th>
                <th className="pr-4">TX Hash</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {billing.map((ev) => (
                <tr key={ev.id} className="border-t border-white/10">
                  <td className="py-3 pr-4">{ev.user?.email || '—'}</td>
                  <td className="pr-4">{ev.plan}</td>
                  <td className="pr-4">{ev.provider}</td>
                  <td className="pr-4">{ev.amount ? `$${ev.amount}` : '—'}</td>
                  <td className="pr-4">
                    <span className={`rounded-full px-2 py-0.5 text-xs ${ev.status === 'confirmed' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'}`}>
                      {ev.status}
                    </span>
                  </td>
                  <td className="max-w-[130px] truncate pr-4 font-mono text-xs text-zinc-400">
                    {ev.txHash || '—'}
                  </td>
                  <td className="text-xs text-zinc-500">
                    {new Date(ev.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Users table */}
      <section className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-6">
        <h2 className="text-xl font-semibold">All users ({users.length})</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-zinc-400">
              <tr>
                <th className="py-2 pr-4">Email</th>
                <th className="pr-4">Name</th>
                <th className="pr-4">Plan</th>
                <th className="pr-4">Status</th>
                <th className="pr-4">Posts</th>
                <th>Joined</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-t border-white/10">
                  <td className="py-3 pr-4">{u.email}</td>
                  <td className="pr-4 text-zinc-400">{u.name || '—'}</td>
                  <td className="pr-4">
                    <span className={`rounded-full px-2 py-0.5 text-xs ${planColor[u.plan] || planColor.starter}`}>
                      {u.plan}
                    </span>
                  </td>
                  <td className="pr-4">
                    <span className={`rounded-full px-2 py-0.5 text-xs ${u.status === 'active' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-zinc-500/20 text-zinc-300'}`}>
                      {u.status}
                    </span>
                  </td>
                  <td className="pr-4">{u.posts.length}</td>
                  <td className="text-xs text-zinc-500">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
