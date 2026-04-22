import PostGenerator from "@/components/PostGenerator";
import { DashboardHeader } from "@/components/DashboardHeader";

export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <DashboardHeader />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Teos AI Engine</h1>
          <p className="text-zinc-400 mt-2">Sovereign Content Strategy for Elmahrosa International.</p>
        </div>
        <PostGenerator />
      </div>
    </main>
  );
}
