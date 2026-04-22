import PostGenerator from '@/components/PostGenerator';
import { requireUser } from '@/lib/auth';
import { getRemainingPosts } from '@/lib/limits';
import Link from 'next/link';
import LogoutButton from '@/components/LogoutButton';

export default async function DashboardPage() {
  const user = await requireUser();
  const isAdmin = user.email === 'aams1969@gmail.com';
  const isStarter = !isAdmin && user.plan === 'starter';
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
            <span
              className={`font-medium ${
                isAdmin
                  ? 'text-emerald-300'
                  : user.plan === 'agency'
                  ? 'text-yellow-300'
                  : user.plan === 'pro'
                  ? 'text-indigo-300'
                  : 'text-zinc-300'
              }`}
            >
              {isAdmin ? 'founder mode' : `${user.plan} plan`}
            </span>
          </p>
        </div>
        <LogoutButton />
      </div>

      {isAdmin && (
        <div className="mt-6 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-200">
          Founder mode enabled — unlimited generation and LinkedIn access unlocked.
        </div>
      )}

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
                  className="h-full rounded-full bg-indigo-500"
                  style={{ width: `${Math.min((postCount / 10) * 100, 100)}%` }}
                />
              </div>
            </div>

            <Link
              href="/#pricing"
              className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold hover:bg-indigo-500"
            >
              Upgrade to Pro →
            </Link>
          </div>

          {atLimit && (
            <p className="mt-3 text-sm text-amber-300">
              You reached the 10-post limit. Upgrade to continue.
            </p>
          )}
        </div>
      )}

      <div className="mt-8 grid gap-6 md:grid-cols-[1.2fr,0.8fr]">
        <PostGenerator
          used={postCount}
          plan={user.plan}
          isAdmin={isAdmin}
        />

        <div className="space-y-6">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-lg font-semibold">Plan details</h2>

            <ul className="mt-4 space-y-2 text-sm text-zinc-300">
              {!isAdmin && user.plan === 'starter' && <li>10 posts maximum</li>}
              {(isAdmin || user.plan !== 'starter') && (
                <li className="text-emerald-300">✓ Unlimited posts</li>
              )}
              {(isAdmin || user.plan === 'agency') && (
                <li className="text-emerald-300">✓ LinkedIn enabled</li>
              )}
              {!isAdmin && user.plan !== 'agency' && (
                <li className="text-zinc-400">LinkedIn: Agency only</li>
              )}
              <li className="text-zinc-400">Payment handled via Dodo during launch</li>
            </ul>

            {!isAdmin && user.plan === 'starter' && (
              <Link
                href="/#pricing"
                className="mt-4 block rounded-lg bg-indigo-600 py-2 text-center text-sm font-semibold hover:bg-indigo-500"
              >
                Upgrade to Pro — $19/month
              </Link>
            )}

            {!isAdmin && user.plan === 'pro' && (
              <Link
                href="/#pricing"
                className="mt-4 block rounded-lg border border-yellow-500/30 py-2 text-center text-sm text-yellow-300 hover:bg-white/5"
              >
                Upgrade to Agency — $49/month
              </Link>
            )}
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-lg font-semibold">Saved posts</h2>

            {postCount === 0 ? (
              <p className="mt-3 text-sm text-zinc-400">No saved posts yet.</p>
            ) : (
              <div className="mt-4 space-y-3">
                {user.posts.map((post) => (
                  <div
                    key={post.id}
                    className="rounded-xl border border-white/10 bg-[#111118] p-4"
                  >
                    <p className="text-sm text-white whitespace-pre-wrap">
                      {post.content}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}