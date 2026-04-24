import PostGenerator from "@/components/PostGenerator";
import { requireUser } from "@/lib/auth";
import { getRemainingPosts, PLAN_LIMITS } from "@/lib/limits";
import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";

export default async function DashboardPage() {
  const user = await requireUser();

  const founderEmails = [
    "aams1969@gmail.com",
    "elma7rosa@gmx.com",
    "ayman@teosegypt.com",
  ];

  const isAdmin =
    founderEmails.includes(user.email.toLowerCase()) ||
    user.plan === "founder";

  const isStarter = !isAdmin && user.plan === "starter";

  const postCount = user.posts.length;
  const remaining = getRemainingPosts(user.plan, postCount, isAdmin);
  const starterLimit = PLAN_LIMITS.starter;
  const atLimit = isStarter && postCount >= starterLimit;

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-6 py-10 text-white">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="mt-1 text-sm text-zinc-400">
            {user.email} ·{" "}
            <span
              className={`font-medium ${
                isAdmin
                  ? "text-emerald-300"
                  : user.plan === "agency"
                  ? "text-yellow-300"
                  : user.plan === "pro"
                  ? "text-indigo-300"
                  : "text-zinc-300"
              }`}
            >
              {isAdmin ? "founder mode" : `${user.plan} plan`}
            </span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {isAdmin && (
            <Link
              href="/admin"
              className="rounded-xl border border-yellow-400/40 bg-yellow-500/10 px-4 py-2 text-sm font-bold text-yellow-300 hover:bg-yellow-500/20"
              title="Founder Admin"
            >
              👑 Founder Admin
            </Link>
          )}

          <Link
            href="/signup"
            className="rounded-xl border border-white/10 px-4 py-2 text-sm font-semibold text-zinc-200 hover:bg-white/10"
          >
            + Create Account
          </Link>

          <LogoutButton />
        </div>
      </div>

      {isAdmin && (
        <div className="mt-6 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-200">
          👑 Founder mode enabled — unlimited generation, LinkedIn access, and admin controls unlocked.
        </div>
      )}

      {isStarter && (
        <div className="mt-6 rounded-2xl border border-indigo-500/30 bg-indigo-500/5 p-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-white">
                Starter plan · {postCount}/{starterLimit} posts used
                {remaining !== null && remaining > 0 && (
                  <span className="ml-2 text-zinc-400">
                    ({remaining} remaining)
                  </span>
                )}
              </p>

              <div className="mt-2 h-2 w-48 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-indigo-500"
                  style={{
                    width: `${Math.min((postCount / starterLimit) * 100, 100)}%`,
                  }}
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
              You reached the {starterLimit}-post Starter limit. Upgrade to continue.
            </p>
          )}
        </div>
      )}

      <div className="mt-8 grid gap-6 md:grid-cols-[1.2fr,0.8fr]">
        <PostGenerator used={postCount} plan={user.plan} isAdmin={isAdmin} />

        <div className="space-y-6">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-lg font-semibold">Plan details</h2>

            <ul className="mt-4 space-y-2 text-sm text-zinc-300">
              {!isAdmin && user.plan === "starter" && (
                <li>{starterLimit} posts maximum</li>
              )}

              {!isAdmin && user.plan === "pro" && (
                <li>{PLAN_LIMITS.pro} posts included</li>
              )}

              {!isAdmin && user.plan === "agency" && (
                <li>{PLAN_LIMITS.agency} posts included</li>
              )}

              {isAdmin && (
                <>
                  <li className="text-emerald-300">✓ Unlimited posts</li>
                  <li className="text-emerald-300">✓ Admin dashboard enabled</li>
                </>
              )}

              {(isAdmin || user.plan === "agency") && (
                <li className="text-emerald-300">✓ LinkedIn enabled</li>
              )}

              {!isAdmin && user.plan !== "agency" && (
                <li className="text-zinc-400">LinkedIn: Agency only</li>
              )}

              <li className="text-zinc-400">
                Payment handled via Dodo or Pi launch activation
              </li>
            </ul>

            {!isAdmin && user.plan === "starter" && (
              <Link
                href="/#pricing"
                className="mt-4 block rounded-lg bg-indigo-600 py-2 text-center text-sm font-semibold hover:bg-indigo-500"
              >
                Upgrade to Pro — $29/month
              </Link>
            )}

            {!isAdmin && user.plan === "pro" && (
              <Link
                href="/#pricing"
                className="mt-4 block rounded-lg border border-yellow-500/30 py-2 text-center text-sm text-yellow-300 hover:bg-white/5"
              >
                Upgrade to Agency — $69/month
              </Link>
            )}

            <Link
              href="/pay/pi"
              className="mt-3 block rounded-lg border border-purple-500/30 py-2 text-center text-sm font-semibold text-purple-300 hover:bg-purple-500/10"
            >
              π Pay with Pi / Request Activation
            </Link>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-lg font-semibold">Account</h2>

            <div className="mt-4 space-y-3 text-sm">
              <Link
                href="/signup"
                className="block rounded-lg border border-white/10 px-4 py-2 text-center font-semibold text-zinc-200 hover:bg-white/10"
              >
                Create new user account
              </Link>

              <Link
                href="/forgot-password"
                className="block rounded-lg border border-purple-500/30 px-4 py-2 text-center font-semibold text-purple-300 hover:bg-purple-500/10"
              >
                Recover account / reset password
              </Link>

              <Link
                href="/pay/pi"
                className="block rounded-lg border border-purple-500/30 px-4 py-2 text-center font-semibold text-purple-300 hover:bg-purple-500/10"
              >
                π Pi payment activation
              </Link>

              {isAdmin && (
                <Link
                  href="/admin"
                  className="block rounded-lg bg-yellow-500/20 px-4 py-2 text-center font-bold text-yellow-300 hover:bg-yellow-500/30"
                >
                  👑 Open Founder Admin
                </Link>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-lg font-semibold">Saved posts</h2>

            {user.posts.length === 0 ? (
              <p className="mt-3 text-sm text-zinc-400">No saved posts yet.</p>
            ) : (
              <div className="mt-4 space-y-3">
                {user.posts.map((post) => (
                  <div
                    key={post.id}
                    className="rounded-xl border border-white/10 bg-[#111118] p-4"
                  >
                    <p className="whitespace-pre-wrap text-sm text-white">
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