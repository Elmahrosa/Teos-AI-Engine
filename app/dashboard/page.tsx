import PostGenerator from '@/components/PostGenerator';
import { requireUser } from '@/lib/auth';
import { getRemainingPosts } from '@/lib/limits';
import Link from 'next/link';
import LogoutButton from '@/components/LogoutButton';

export default async function DashboardPage() {
  const user = await requireUser();
  const isStarter = user.plan === 'starter';
  const postCount = user.posts.length;
  const remaining = getRemainingPosts(user.plan, postCount);
  const atLimit = isStarter && postCount >= 10;

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-6 py-10 text-white">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="mt-1 text-sm text-zinc-400">
            {user.email} ·{' '}
            <span className={`font-medium ${user.plan === 'agency' ? 'text-purple-300' : user.plan === 'pro' ? 'text-indigo-300' : 'text-zinc-300'}`}>
              {user.plan} plan
            </span>
            {user.status === 'active' && (
              <span className="ml-2 rounded-full bg-emerald-500/20 px-2 py-0.5 text-xs text-emerald-300">active</span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <LogoutButton />
        </div>
      </div>

      {isStarter && (
        <div className="mt-6 rounded-2xl border border-indigo-500/30 bg-indigo-500/5 p-5">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <p className="text-sm font-medium text-white">
                Starter plan · {postCount}/10 posts used
                {remaining !== null && remaining > 0 && (
                  <span className="ml-2 text-zinc-400">({remaining} remaining)</span>
                )}
              </p>
              <div className="mt-2 h-2 w-48 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-indigo-500 transition-all"
                  style={{ width: `${Math.min((postCount / 10) * 100, 100)}%` }}
                />
              </div>
            </div>
            <Link href="/#pricing" className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold hover:bg-indigo-500">
              Upgrade to Pro →
            </Link>
          </div>
          {atLimit && (
            <p className="mt-3 text-sm text-amber-300">
              You have reached the 10-post Starter limit. Upgrade to Pro for unlimited posts.
            </p>
          )}
        </div>
      )}

      <div className="mt-8 grid gap-6 md:grid-cols-[1.2fr,0.8fr]">
        <PostGenerator used={postCount} plan={user.plan} />

        <div className="space-y-6">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-lg font-semibold">Plan details</h2>
            <ul className="mt-4 space-y-2 text-sm text-zinc-300">
              {user.plan === 'starter' && <li className="text-zinc-400">10 posts maximum (free forever)</li>}
              {user.plan !== 'starter' && <li className="text-emerald-300">✓ Unlimited posts</li>}
              {user.plan === 'agency' && <li className="text-emerald-300">✓ LinkedIn posts included</li>}
              {user.plan !== 'agency' && <li className="text-zinc-400">LinkedIn: Agency plan only</li>}
              <li className="text-zinc-400">Manual payment confirmation during launch</li>
            </ul>
            {user.plan === 'starter' && (
              <Link href="/#pricing" className="mt-4 block rounded-lg bg-indigo-600 py-2 text-center text-sm font-semibold hover:bg-indigo-500">
                Upgrade to Pro — $29 USDC
              </Link>
            )}
            {user.plan === 'pro' && (
              <Link href="/#pricing" className="mt-4 block rounded-lg border border-purple-500/30 py-2 text-center text-sm hover:bg-white/5 text-purple-300">
                Upgrade to Agency — $99 USDC
              </Link>
            )}
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-lg font-semibold">Saved posts</h2>
            {postCount === 0 ? (
              <p className="mt-3 text-sm text-zinc-400">No saved posts yet. Generate and save your first post above.</p>
            ) : (
              <div className="mt-4 max-h-96 space-y-3 overflow-y-auto pr-1">
                {user.posts.map((post) => {
                  const hashtags = (() => {
                    try { return JSON.parse(post.hashtags || '[]') as string[]; }
                    catch { return []; }
                  })();
                  return (
                    <div key={post.id} className="rounded-xl border border-white/10 bg-[#111118] p-4">
                      <div className="mb-1.5 flex items-center gap-2">
                        <span className="rounded-full bg-indigo-500/20 px-2 py-0.5 text-xs text-indigo-300 uppercase tracking-wide">
                          {post.platform}
                        </span>
                        <span className="text-xs text-zinc-500">
                          {new Date(post.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="line-clamp-3 whitespace-pre-wrap text-sm text-white">{post.content}</p>
                      {hashtags.length > 0 && (
                        <p className="mt-2 text-xs text-zinc-500">{hashtags.join(' ')}</p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Submit payment proof / upgrade flow */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <h2 className="text-base font-semibold text-white">Submit payment proof</h2>
            <p className="mt-1 text-sm text-zinc-400">Already paid? Submit your transaction hash to upgrade your plan.</p>
            <Link
              href="/success"
              className="mt-3 block rounded-lg border border-indigo-500/30 py-2 text-center text-sm text-indigo-300 hover:bg-indigo-500/10"
            >
              Submit TX hash →
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
