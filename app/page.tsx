"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

// ─── Animated Counter ────────────────────────────────────────────────────────
function Counter({ end, suffix = "" }: { end: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        let start = 0;
        const step = Math.ceil(end / 60);
        const timer = setInterval(() => {
          start += step;
          if (start >= end) { setCount(end); clearInterval(timer); }
          else setCount(start);
        }, 16);
        observer.disconnect();
      }
    });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end]);
  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

// ─── Seats Bar ───────────────────────────────────────────────────────────────
function SeatsBar({ taken, total }: { taken: number; total: number }) {
  const pct = Math.round((taken / total) * 100);
  return (
    <div className="mt-3">
      <div className="flex justify-between text-xs mb-1" style={{ color: "#C9A84C" }}>
        <span>{taken} claimed</span><span>{total - taken} seats left</span>
      </div>
      <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
        <div className="h-full rounded-full transition-all duration-1000"
          style={{ width: `${pct}%`, background: "linear-gradient(90deg,#7B4FBF,#C9A84C)" }} />
      </div>
    </div>
  );
}

// ─── Rotating Ticker ─────────────────────────────────────────────────────────
function Ticker() {
  const msgs = [
    { icon: "🔥", text: "First 50 Lifetime Seats Open — Claim Yours Now" },
    { icon: "π", text: "Pi Users Get 50% Discount — Pioneer Offer Active" },
    { icon: "🦅", text: "Follow @KING_TEOS for Launch Updates & AI Drops" },
    { icon: "💬", text: "Join Telegram #ElmahrosaPi — Exclusive Pioneer Community" },
  ];
  const [idx, setIdx] = useState(0);
  const [vis, setVis] = useState(true);
  useEffect(() => {
    const t = setInterval(() => {
      setVis(false);
      setTimeout(() => { setIdx(i => (i + 1) % msgs.length); setVis(true); }, 380);
    }, 3600);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex justify-center items-center gap-2 py-1.5"
      style={{ background: "linear-gradient(90deg,#3D1F80,#7B4FBF,#3D1F80)", fontFamily: "'Syne',sans-serif" }}>
      <div className="flex items-center gap-2 text-xs tracking-wide transition-all duration-300"
        style={{ opacity: vis ? 1 : 0, transform: vis ? "translateY(0)" : "translateY(-5px)" }}>
        <span>{msgs[idx].icon}</span>
        <span style={{ color: "rgba(255,255,255,0.92)" }}>{msgs[idx].text}</span>
      </div>
    </div>
  );
}

// ─── Social Icons ─────────────────────────────────────────────────────────────
const XI = ({ s = 16 }: { s?: number }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.74l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);
const TGI = ({ s = 16 }: { s?: number }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.248-1.97 9.289c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L7.17 14.198l-2.95-.924c-.641-.204-.654-.641.136-.953l11.527-4.443c.537-.194 1.006.131.679.37z"/>
  </svg>
);
const LII = ({ s = 16 }: { s?: number }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

const SOCIAL = [
  { label: "Follow on X", handle: "@KING_TEOS", href: "https://twitter.com/KING_TEOS", Icon: XI, btnCls: "btn-x", color: "#ffffff" },
  { label: "Join Telegram", handle: "#ElmahrosaPi", href: "https://t.me/elmahrosapi", Icon: TGI, btnCls: "btn-tg", color: "#2AABEE" },
  { label: "Connect on LinkedIn", handle: "Teos Pharaoh Portal", href: "https://www.linkedin.com/company/teos-pharaoh-portal/?viewAsMember=true", Icon: LII, btnCls: "btn-li", color: "#5BA4CF" },
];

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function HomePage() {
  const [demoStep, setDemoStep] = useState(0);
  const [demoInput, setDemoInput] = useState("");
  const [isGen, setIsGen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const demoIdea = "Why most founders fail at content marketing — and how I fixed it in 7 days.";
  const demoPost = `🧠 Most founders treat content like an afterthought.\n\nThey post when they "have time."\nThey write what sounds smart.\nThey wonder why nobody engages.\n\nHere's what I learned after 7 days of obsessive testing:\n\n→ Specificity wins over expertise\n→ Stories outperform advice\n→ The first line IS the ad\n\nYour audience doesn't want your knowledge.\nThey want to see themselves in your story.\n\nStart there. 🔥`;
  const demoCta = "Save this if you're building an audience. Drop a 🙋 if you've made this mistake.";

  function runDemo() {
    if (demoStep === 0) { setDemoInput(demoIdea); setDemoStep(1); }
    else if (demoStep === 1) { setIsGen(true); setTimeout(() => { setIsGen(false); setDemoStep(2); }, 2200); }
    else { setDemoStep(0); setDemoInput(""); }
  }

  return (
    <div className="min-h-screen text-white overflow-x-hidden"
      style={{ background: "#050505", fontFamily: "'Cormorant Garamond','Georgia',serif" }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600;700&family=Syne:wght@400;500;700;800&family=JetBrains+Mono:wght@400;500&display=swap');
        :root{--gold:#C9A84C;--gl:#E8C96B;--pu:#7B4FBF;--pl:#9B6FDF;--pd:#3D1F80;--bg:#050505;--sur:#0D0D0D;--brd:rgba(201,168,76,0.15);}
        *{box-sizing:border-box;} html{scroll-behavior:smooth;}
        .syne{font-family:'Syne',sans-serif;} .mono{font-family:'JetBrains Mono',monospace;}
        @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
        @keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}
        @keyframes pulse-ring{0%{opacity:1;transform:scale(1)}100%{opacity:0;transform:scale(1.5)}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(22px)}to{opacity:1;transform:translateY(0)}}
        @keyframes live-pulse{0%,100%{opacity:1}50%{opacity:0.3}}
        .float{animation:float 5s ease-in-out infinite;}
        .fadeUp{animation:fadeUp .7s ease both;}
        .fu1{animation:fadeUp .7s .1s ease both;} .fu2{animation:fadeUp .7s .25s ease both;}
        .fu3{animation:fadeUp .7s .4s ease both;} .fu4{animation:fadeUp .7s .55s ease both;}
        .shimmer-text{background:linear-gradient(90deg,var(--gold),var(--gl),var(--gold),var(--gl));background-size:200%;-webkit-background-clip:text;-webkit-text-fill-color:transparent;animation:shimmer 3s linear infinite;}
        .card-hover{transition:transform .3s ease,box-shadow .3s ease;}
        .card-hover:hover{transform:translateY(-4px);box-shadow:0 12px 40px rgba(123,79,191,.2);}
        .btn-primary{background:linear-gradient(135deg,var(--gold),#A07030);color:#050505;font-weight:700;transition:all .2s;}
        .btn-primary:hover{background:linear-gradient(135deg,var(--gl),var(--gold));transform:translateY(-1px);box-shadow:0 6px 20px rgba(201,168,76,.35);}
        .btn-ghost{border:1px solid var(--brd);color:var(--gold);transition:all .2s;background:transparent;}
        .btn-ghost:hover{background:rgba(201,168,76,.08);border-color:var(--gold);}
        .btn-x{background:rgba(255,255,255,.06);color:#fff;border:1px solid rgba(255,255,255,.12);transition:all .2s;}
        .btn-x:hover{background:rgba(255,255,255,.12);transform:translateY(-1px);}
        .btn-tg{background:rgba(42,171,238,.1);color:#2AABEE;border:1px solid rgba(42,171,238,.25);transition:all .2s;}
        .btn-tg:hover{background:rgba(42,171,238,.18);transform:translateY(-1px);}
        .btn-li{background:rgba(10,102,194,.1);color:#5BA4CF;border:1px solid rgba(10,102,194,.25);transition:all .2s;}
        .btn-li:hover{background:rgba(10,102,194,.18);transform:translateY(-1px);}
        .live-dot{animation:live-pulse 1.5s ease-in-out infinite;}
        .orb{border-radius:50%;filter:blur(80px);opacity:.12;position:absolute;pointer-events:none;}
        .grid-bg{background-image:linear-gradient(rgba(201,168,76,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(201,168,76,.04) 1px,transparent 1px);background-size:60px 60px;}
        .divider{height:1px;background:linear-gradient(90deg,transparent,var(--brd),transparent);}
        .pricing-pop{background:linear-gradient(160deg,rgba(123,79,191,.15),rgba(201,168,76,.08));border:1px solid rgba(201,168,76,.3);}
        .pricing-life{background:linear-gradient(160deg,rgba(201,168,76,.1),rgba(123,79,191,.08));border:1px solid rgba(201,168,76,.4);}
        .comm-x{background:linear-gradient(135deg,rgba(255,255,255,.04),rgba(255,255,255,.02));border:1px solid rgba(255,255,255,.1);}
        .comm-tg{background:linear-gradient(135deg,rgba(42,171,238,.08),rgba(42,171,238,.03));border:1px solid rgba(42,171,238,.2);}
        .comm-li{background:linear-gradient(135deg,rgba(10,102,194,.08),rgba(10,102,194,.03));border:1px solid rgba(10,102,194,.2);}
        .social-hover{transition:all .2s;} .social-hover:hover{transform:translateY(-2px);opacity:.85;}
        .noise::before{content:'';position:absolute;inset:0;opacity:.03;background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");pointer-events:none;}
        .movement-bg{background:radial-gradient(ellipse at 50% 0%,rgba(123,79,191,.1) 0%,transparent 60%),radial-gradient(ellipse at 80% 100%,rgba(201,168,76,.05) 0%,transparent 50%);}
      `}</style>

      <Ticker />

      {/* ── NAVBAR ── */}
      <nav className="fixed z-40 left-0 right-0 flex items-center justify-between px-6 py-3"
        style={{ top:"26px", background:"rgba(5,5,5,.88)", backdropFilter:"blur(20px)", borderBottom:"1px solid rgba(201,168,76,.1)" }}>
        <Link href="/" className="flex items-center gap-2.5">
          <img src="/logo.png" alt="TEOS" className="h-8 w-8 object-contain" onError={e=>{(e.target as HTMLImageElement).style.display='none'}}/>
          <span className="syne font-800 text-sm tracking-widest uppercase" style={{color:"#C9A84C"}}>TEOS AI</span>
        </Link>
        <div className="hidden md:flex items-center gap-6 text-xs syne tracking-widest uppercase" style={{color:"rgba(255,255,255,.55)"}}>
          {[["Features","#features"],["Pricing","#pricing"],["Demo","#demo"],["Pi Launch","#pi-launch"],["Community","#community"]].map(([l,h])=>(
            <a key={l} href={h} className="hover:text-white transition-colors">{l}</a>
          ))}
        </div>
        <div className="hidden md:flex items-center gap-3">
          <a href="https://twitter.com/KING_TEOS" target="_blank" rel="noopener noreferrer"
            className="btn-x flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs syne tracking-wide">
            <XI s={12}/> @KING_TEOS
          </a>
          <Link href="/signup" className="btn-primary syne text-xs tracking-widest uppercase px-5 py-2 rounded-full">Get Started</Link>
        </div>
        <button className="md:hidden p-2" onClick={()=>setMenuOpen(!menuOpen)}>
          <div className="space-y-1">{[0,1,2].map(i=><div key={i} className="w-5 h-0.5 rounded" style={{background:"#C9A84C"}}/>)}</div>
        </button>
        {menuOpen && (
          <div className="absolute top-full left-0 right-0 py-4 px-6 flex flex-col gap-4"
            style={{background:"rgba(5,5,5,.97)",borderBottom:"1px solid rgba(201,168,76,.1)"}}>
            {[["Features","#features"],["Pricing","#pricing"],["Demo","#demo"],["Pi Launch","#pi-launch"],["Community","#community"],["Login","/login"]].map(([l,h])=>(
              <a key={l} href={h} className="syne text-xs tracking-widest uppercase" style={{color:"rgba(255,255,255,.7)"}} onClick={()=>setMenuOpen(false)}>{l}</a>
            ))}
            <Link href="/signup" className="btn-primary syne text-xs tracking-widest uppercase px-5 py-2.5 rounded-full text-center">Get Started Free</Link>
          </div>
        )}
      </nav>
      <div style={{height:"78px"}}/>

      {/* ── HERO ── */}
      <section id="hero" className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-20 pb-20 noise overflow-hidden"
        style={{position:"relative"}}>
        <div className="absolute inset-0 grid-bg"/>
        <div className="orb w-96 h-96 top-20 -left-20" style={{background:"#7B4FBF"}}/>
        <div className="orb w-80 h-80 bottom-20 -right-10" style={{background:"#C9A84C"}}/>

        <div className="float relative mb-8 fadeUp">
          <div className="absolute inset-0 rounded-full" style={{background:"radial-gradient(circle,rgba(123,79,191,.3) 0%,transparent 70%)",transform:"scale(1.5)"}}/>
          <img src="/logo.png" alt="TEOS AI Engine" className="relative w-32 h-32 md:w-44 md:h-44 object-contain"
            onError={e=>{const el=e.target as HTMLImageElement;el.style.display='none';el.parentElement!.innerHTML='<div style="width:160px;height:160px;background:radial-gradient(circle,#7B4FBF,#3D1F80);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:72px">👁</div>';}}/>
        </div>

        <div className="fu1 mb-5 flex items-center gap-2 px-4 py-2 rounded-full border text-xs syne tracking-widest"
          style={{borderColor:"rgba(201,168,76,.3)",background:"rgba(201,168,76,.06)",color:"#C9A84C"}}>
          <span>π</span><span>Pi Users Get 50% Launch Discount</span>
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 live-dot"/>
        </div>

        <h1 className="fu2 text-center max-w-3xl leading-none mb-6"
          style={{fontSize:"clamp(2.8rem,7vw,5.5rem)",fontWeight:700,letterSpacing:"-0.02em"}}>
          <span className="shimmer-text">AI That Sees</span><br/>
          <span style={{color:"rgba(255,255,255,.9)"}}>What Others Miss.</span>
        </h1>
        <p className="fu3 text-center max-w-xl mb-10 leading-relaxed syne"
          style={{color:"rgba(255,255,255,.55)",fontSize:"1.05rem"}}>
          Generate stronger content faster across X, Facebook, Instagram and LinkedIn —
          with built-in <span style={{color:"#C9A84C"}}>visibility scoring</span> that shows what will actually perform.
        </p>
        <div className="fu4 flex flex-col sm:flex-row gap-4 items-center">
          <Link href="/signup" className="btn-primary syne tracking-widest uppercase text-sm px-8 py-4 rounded-full flex items-center gap-2">
            <span>✦</span> Start Free — 5 Posts
          </Link>
          <a href="#demo" className="btn-ghost syne tracking-widest uppercase text-sm px-8 py-4 rounded-full flex items-center gap-2">
            <span>▶</span> Watch Demo
          </a>
        </div>
        <p className="mt-5 text-xs syne tracking-widest" style={{color:"rgba(255,255,255,.22)"}}>No credit card · Instant access · Cancel anytime</p>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2" style={{color:"rgba(255,255,255,.2)"}}>
          <div className="w-px h-10 rounded-full" style={{background:"linear-gradient(to bottom,rgba(201,168,76,.4),transparent)"}}/>
          <span className="text-xs syne tracking-widest">SCROLL</span>
        </div>
      </section>

      {/* ── JOIN THE MOVEMENT STRIP ── */}
      <section style={{background:"#080808",borderTop:"1px solid rgba(201,168,76,.08)",borderBottom:"1px solid rgba(201,168,76,.08)"}}>
        <div className="max-w-5xl mx-auto px-6 py-8">
          <div className="flex flex-col items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="h-px w-12" style={{background:"linear-gradient(to right,transparent,rgba(201,168,76,.4))"}}/>
              <span className="syne text-xs tracking-widest uppercase" style={{color:"rgba(255,255,255,.3)"}}>Join the TEOS Community</span>
              <div className="h-px w-12" style={{background:"linear-gradient(to left,transparent,rgba(201,168,76,.4))"}}/>
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              {SOCIAL.map(({label,handle,href,Icon,btnCls})=>(
                <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                  className={`social-hover ${btnCls} flex items-center gap-2 px-5 py-2.5 rounded-full syne text-sm font-600 tracking-wide`}>
                  <Icon s={14}/> {label} <span className="text-xs opacity-50">{handle}</span>
                </a>
              ))}
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              {[{l:"✔ Founder-led",c:"#C9A84C"},{l:"✔ Pi Ecosystem Builder",c:"#9B6FDF"},{l:"✔ Elmahrosa International",c:"#C9A84C"}].map(({l,c})=>(
                <span key={l} className="text-xs syne tracking-widest px-3 py-1.5 rounded-full"
                  style={{color:c,background:"rgba(255,255,255,.03)",border:`1px solid ${c}30`}}>{l}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <section className="py-10 px-6" style={{background:"#060606"}}>
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            {val:5000,suf:"+",label:"Pi Community Reach"},
            {val:75,suf:"+",label:"Countries in Telegram"},
            {val:87,suf:"%",label:"Avg Visibility Score"},
            {val:50,suf:" seats",label:"Lifetime Offer Left"},
          ].map(({val,suf,label})=>(
            <div key={label}>
              <div className="shimmer-text text-3xl md:text-4xl font-700 syne"><Counter end={val} suffix={suf}/></div>
              <div className="text-xs syne tracking-widest mt-1" style={{color:"rgba(255,255,255,.32)"}}>{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-1.5 rounded-full text-xs syne tracking-widest uppercase mb-4"
              style={{border:"1px solid var(--brd)",color:"#C9A84C"}}>The Difference</div>
            <h2 className="text-4xl md:text-5xl font-700" style={{letterSpacing:"-0.02em"}}>
              Built Different. <span className="shimmer-text">Built to Win.</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              {icon:"👁",title:"AI Visibility Scoring",desc:"Every post gets a real-time score 0–100. Know before you post whether your content will cut through the noise.",a:"#C9A84C"},
              {icon:"🎯",title:"Platform Optimization",desc:"Content auto-adapted for X, LinkedIn, Facebook, and Instagram — different formats, hooks, and lengths per channel.",a:"#9B6FDF"},
              {icon:"⚡",title:"CTA Intelligence",desc:"AI suggests the exact call-to-action that matches your post's tone and audience intent — not generic templates.",a:"#C9A84C"},
              {icon:"🦅",title:"Founder & Agency Workflows",desc:"Built for solo founders who move fast and agencies managing multiple brands — batch mode included.",a:"#9B6FDF"},
              {icon:"π",title:"Pi + Dodo Payments",desc:"Pay with Pi Network, USDC, or Dodo. One of the only SaaS tools globally accepting Pi for payment.",a:"#C9A84C"},
              {icon:"📊",title:"Content Analytics",desc:"Track which angles, formats and CTAs score highest over time — let data drive your content strategy.",a:"#9B6FDF"},
            ].map(({icon,title,desc,a})=>(
              <div key={title} className="card-hover rounded-2xl p-6" style={{background:"#0D0D0D",border:"1px solid rgba(255,255,255,.05)"}}>
                <div className="text-3xl mb-4">{icon}</div>
                <h3 className="syne font-700 text-base mb-2" style={{color:a}}>{title}</h3>
                <p className="text-sm leading-relaxed" style={{color:"rgba(255,255,255,.5)"}}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── INTERACTIVE DEMO ── */}
      <section id="demo" className="py-24 px-6" style={{background:"#070707"}}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-block px-4 py-1.5 rounded-full text-xs syne tracking-widest uppercase mb-4"
              style={{border:"1px solid var(--brd)",color:"#C9A84C"}}>See It Live</div>
            <h2 className="text-4xl md:text-5xl font-700 mb-4" style={{letterSpacing:"-0.02em"}}>TEOS In Action</h2>
            <p className="text-sm syne" style={{color:"rgba(255,255,255,.4)"}}>Paste an idea → get a post + visibility score in seconds</p>
          </div>
          <div className="rounded-3xl overflow-hidden" style={{border:"1px solid rgba(201,168,76,.2)",background:"#0A0A0A"}}>
            <div className="flex items-center gap-2 px-5 py-3.5" style={{background:"#111",borderBottom:"1px solid rgba(255,255,255,.05)"}}>
              <div className="w-3 h-3 rounded-full bg-red-500/60"/>
              <div className="w-3 h-3 rounded-full bg-yellow-500/60"/>
              <div className="w-3 h-3 rounded-full bg-green-500/60"/>
              <span className="ml-4 text-xs mono" style={{color:"rgba(255,255,255,.25)"}}>teos-ai-engine.vercel.app/dashboard</span>
            </div>
            <div className="p-6 md:p-8 space-y-6">
              <div>
                <label className="text-xs syne tracking-widest uppercase mb-3 block" style={{color:"#C9A84C"}}>01 — Your Content Idea</label>
                <textarea className="w-full rounded-xl px-4 py-3.5 text-sm resize-none mono outline-none"
                  style={{background:"#151515",border:"1px solid rgba(201,168,76,.15)",color:"rgba(255,255,255,.8)",minHeight:"80px"}}
                  placeholder="E.g. Why most founders fail at content marketing…"
                  value={demoInput} onChange={e=>setDemoInput(e.target.value)} readOnly={demoStep>0}/>
                <div className="flex gap-2 mt-2 flex-wrap">
                  {["LinkedIn","X / Twitter","Instagram","Facebook"].map(p=>(
                    <span key={p} className="text-xs px-3 py-1 rounded-full syne"
                      style={{background:p==="LinkedIn"?"rgba(123,79,191,.2)":"rgba(255,255,255,.05)",color:p==="LinkedIn"?"#9B6FDF":"rgba(255,255,255,.35)",border:"1px solid rgba(255,255,255,.08)"}}>
                      {p}
                    </span>
                  ))}
                </div>
              </div>
              <button onClick={runDemo}
                className="w-full py-3.5 rounded-xl syne text-sm font-700 tracking-widest uppercase flex items-center justify-center gap-2 transition-all duration-300"
                style={{background:demoStep===2?"rgba(255,255,255,.05)":"linear-gradient(135deg,#C9A84C,#A07030)",color:demoStep===2?"rgba(255,255,255,.4)":"#050505"}}>
                {isGen?(<><span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"/>Generating with TEOS AI…</>)
                  :demoStep===0?(<><span>✦</span> Load Demo Idea</>)
                  :demoStep===1?(<><span>⚡</span> Generate Post + Score</>)
                  :(<><span>↺</span> Try Again</>)}
              </button>
              {demoStep===2 && (
                <div className="space-y-4 fadeUp">
                  <div>
                    <label className="text-xs syne tracking-widest uppercase mb-3 block" style={{color:"#9B6FDF"}}>02 — Generated Post (LinkedIn)</label>
                    <div className="rounded-xl p-5 text-sm leading-relaxed mono"
                      style={{background:"#0F0F0F",border:"1px solid rgba(123,79,191,.2)",color:"rgba(255,255,255,.8)",whiteSpace:"pre-line"}}>
                      {demoPost}
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="rounded-xl p-5" style={{background:"#0F0F0F",border:"1px solid rgba(201,168,76,.15)"}}>
                      <div className="text-xs syne tracking-widest uppercase mb-3" style={{color:"#C9A84C"}}>03 — Visibility Score</div>
                      <div className="flex items-end gap-3">
                        <span className="shimmer-text font-700 syne" style={{fontSize:"3.5rem",lineHeight:1}}>87</span>
                        <span style={{color:"rgba(255,255,255,.3)",fontSize:"1.2rem"}}>/100</span>
                      </div>
                      <div className="mt-3 h-1.5 rounded-full bg-white/5 overflow-hidden">
                        <div className="h-full rounded-full" style={{width:"87%",background:"linear-gradient(90deg,#7B4FBF,#C9A84C)"}}/>
                      </div>
                      <div className="mt-2 text-xs syne" style={{color:"rgba(255,255,255,.35)"}}>Strong performance predicted · Top 15%</div>
                    </div>
                    <div className="rounded-xl p-5" style={{background:"#0F0F0F",border:"1px solid rgba(123,79,191,.2)"}}>
                      <div className="text-xs syne tracking-widest uppercase mb-3" style={{color:"#9B6FDF"}}>04 — Suggested CTA</div>
                      <p className="text-sm leading-relaxed" style={{color:"rgba(255,255,255,.7)"}}>"{demoCta}"</p>
                      <div className="mt-3 flex gap-2">
                        <button className="text-xs syne px-3 py-1.5 rounded-lg" style={{background:"rgba(201,168,76,.1)",color:"#C9A84C",border:"1px solid rgba(201,168,76,.2)"}}>Use This CTA</button>
                        <button className="text-xs syne px-3 py-1.5 rounded-lg" style={{background:"rgba(255,255,255,.04)",color:"rgba(255,255,255,.4)",border:"1px solid rgba(255,255,255,.08)"}}>Regenerate</button>
                      </div>
                    </div>
                  </div>
                  <div className="text-center pt-2">
                    <Link href="/signup" className="btn-primary syne text-sm tracking-widest uppercase px-8 py-3.5 rounded-full inline-flex items-center gap-2">
                      ✦ Get Your First 5 Posts Free
                    </Link>
                    <p className="text-xs mt-2 syne" style={{color:"rgba(255,255,255,.2)"}}>No card required</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── VIDEO DEMO ── */}
      <section id="watch-demo" className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-block px-4 py-1.5 rounded-full text-xs syne tracking-widest uppercase mb-6"
            style={{border:"1px solid var(--brd)",color:"#C9A84C"}}>Video Demo</div>
          <h2 className="text-4xl md:text-5xl font-700 mb-4" style={{letterSpacing:"-0.02em"}}>
            Watch the 90-Second<br/><span className="shimmer-text">Product Walkthrough</span>
          </h2>
          <p className="text-sm syne mb-10" style={{color:"rgba(255,255,255,.4)"}}>From signup to first post in under 2 minutes</p>
          <div className="relative rounded-2xl overflow-hidden aspect-video"
            style={{border:"1px solid rgba(201,168,76,.2)",background:"#0A0A0A"}}>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="relative mb-5">
                <div className="absolute inset-0 rounded-full border-2"
                  style={{borderColor:"rgba(201,168,76,.3)",animation:"pulse-ring 2s ease-out infinite"}}/>
                <button className="relative flex items-center justify-center rounded-full"
                  style={{width:"72px",height:"72px",background:"linear-gradient(135deg,#C9A84C,#7B4FBF)"}}>
                  <span style={{fontSize:"1.5rem",marginLeft:"4px"}}>▶</span>
                </button>
              </div>
              <p className="syne text-sm tracking-widest" style={{color:"rgba(255,255,255,.3)"}}>DEMO VIDEO — Coming Soon</p>
              <p className="text-xs syne mt-1" style={{color:"rgba(255,255,255,.15)"}}>Paste your Loom or YouTube URL here</p>
            </div>
            {[["top-4 left-4","border-t-2 border-l-2 rounded-tl"],["top-4 right-4","border-t-2 border-r-2 rounded-tr"],["bottom-4 left-4","border-b-2 border-l-2 rounded-bl"],["bottom-4 right-4","border-b-2 border-r-2 rounded-br"]].map(([p,b])=>(
              <div key={p} className={`absolute ${p} w-8 h-8 ${b}`} style={{borderColor:"rgba(201,168,76,.3)"}}/>
            ))}
          </div>
        </div>
      </section>

      {/* ── DEMO SCRIPT PANEL ── */}
      <section className="py-16 px-6" style={{background:"#070707"}}>
        <div className="max-w-3xl mx-auto">
          <div className="rounded-2xl overflow-hidden" style={{border:"1px solid rgba(201,168,76,.15)",background:"#0A0A0A"}}>
            <div className="px-6 py-4 flex items-center justify-between" style={{background:"#111",borderBottom:"1px solid rgba(255,255,255,.05)"}}>
              <div className="flex items-center gap-3">
                <span className="text-xs mono px-2.5 py-1 rounded" style={{background:"rgba(201,168,76,.12)",color:"#C9A84C"}}>SCRIPT</span>
                <span className="syne text-sm font-600">90-Second Demo Recording Flow</span>
              </div>
              <span className="text-xs syne" style={{color:"rgba(255,255,255,.2)"}}>⏱ ~90 sec</span>
            </div>
            <div className="p-6 space-y-3">
              {[
                {s:"01",t:"0:00–0:12",l:"Home Hero",d:"Open teos-ai-engine.vercel.app — show logo, headline, and launch ribbon ticker."},
                {s:"02",t:"0:12–0:25",l:"Sign Up",d:"Click 'Start Free — 5 Posts'. Fill form. Land on dashboard."},
                {s:"03",t:"0:25–0:50",l:"Generate a Post",d:"Paste idea. Select LinkedIn. Click Generate. Watch post appear live."},
                {s:"04",t:"0:50–1:02",l:"Visibility Score",d:"Highlight 87/100 score. Show CTA suggestion. Click copy."},
                {s:"05",t:"1:02–1:12",l:"Pi Payment",d:"Show Pi launch section. 50% discount badge. Payment options: Pi · USDC · Dodo."},
                {s:"06",t:"1:12–1:22",l:"Lifetime Offer",d:"Scroll to pricing. Show seats bar. Claim Pro Lifetime $97."},
                {s:"07",t:"1:22–1:30",l:"Community",d:"Show @KING_TEOS on X + Telegram #ElmahrosaPi + LinkedIn Teos Pharaoh Portal."},
              ].map(({s,t,l,d})=>(
                <div key={s} className="flex gap-4 p-4 rounded-xl" style={{background:"#111",border:"1px solid rgba(255,255,255,.04)"}}>
                  <div className="flex-shrink-0 flex flex-col items-center gap-1 w-16">
                    <span className="syne font-700 text-sm shimmer-text">{s}</span>
                    <span className="text-xs mono text-center" style={{color:"rgba(255,255,255,.2)"}}>{t}</span>
                  </div>
                  <div>
                    <div className="syne font-600 text-sm mb-1" style={{color:"rgba(255,255,255,.8)"}}>{l}</div>
                    <div className="text-xs leading-relaxed" style={{color:"rgba(255,255,255,.4)"}}>{d}</div>
                  </div>
                </div>
              ))}
              <div className="p-4 rounded-xl text-center" style={{background:"rgba(201,168,76,.06)",border:"1px solid rgba(201,168,76,.2)"}}>
                <p className="text-sm syne italic" style={{color:"#C9A84C"}}>
                  "Join the first sovereign AI content engine built with Pi support."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section id="pricing" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-1.5 rounded-full text-xs syne tracking-widest uppercase mb-4"
              style={{border:"1px solid var(--brd)",color:"#C9A84C"}}>Pricing</div>
            <h2 className="text-4xl md:text-5xl font-700 mb-4" style={{letterSpacing:"-0.02em"}}>
              Start Free. <span className="shimmer-text">Own It Forever.</span>
            </h2>
            <p className="text-sm syne" style={{color:"rgba(255,255,255,.4)"}}>Lifetime offers close when 50 seats fill — no exceptions.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-5 mb-8">
            <div className="card-hover rounded-2xl p-7" style={{background:"#0D0D0D",border:"1px solid rgba(255,255,255,.06)"}}>
              <div className="text-xs syne tracking-widest uppercase mb-4" style={{color:"rgba(255,255,255,.35)"}}>Starter</div>
              <div className="flex items-end gap-1 mb-1"><span className="text-5xl font-700 syne">$0</span></div>
              <p className="text-xs syne mb-6" style={{color:"rgba(255,255,255,.3)"}}>Free forever · No card</p>
              <ul className="space-y-3 mb-8">
                {["5 posts per month","1 platform","Basic visibility score","No credit card"].map(f=>(
                  <li key={f} className="text-sm flex gap-2" style={{color:"rgba(255,255,255,.55)"}}><span style={{color:"#C9A84C"}}>✓</span>{f}</li>
                ))}
              </ul>
              <Link href="/signup" className="block text-center py-3 rounded-xl syne text-sm tracking-widest uppercase"
                style={{border:"1px solid rgba(255,255,255,.1)",color:"rgba(255,255,255,.5)"}}>Start Free</Link>
            </div>
            <div className="card-hover pricing-pop rounded-2xl p-7 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs syne tracking-widest uppercase"
                style={{background:"linear-gradient(90deg,#7B4FBF,#9B6FDF)",color:"white"}}>Most Popular</div>
              <div className="text-xs syne tracking-widest uppercase mb-4" style={{color:"#9B6FDF"}}>Pro Monthly</div>
              <div className="flex items-end gap-1 mb-1"><span className="text-5xl font-700 syne shimmer-text">$29</span><span className="text-sm mb-2" style={{color:"rgba(255,255,255,.3)"}}>/mo</span></div>
              <p className="text-xs syne mb-6" style={{color:"rgba(255,255,255,.3)"}}>Cancel anytime</p>
              <ul className="space-y-3 mb-8">
                {["Unlimited posts","All 4 platforms","Full visibility scoring","CTA suggestions","Priority generation"].map(f=>(
                  <li key={f} className="text-sm flex gap-2" style={{color:"rgba(255,255,255,.7)"}}><span style={{color:"#C9A84C"}}>✓</span>{f}</li>
                ))}
              </ul>
              <Link href="/signup?plan=pro" className="btn-primary block text-center py-3.5 rounded-xl syne text-sm tracking-widest uppercase">Get Pro</Link>
            </div>
            <div className="card-hover rounded-2xl p-7" style={{background:"#0D0D0D",border:"1px solid rgba(255,255,255,.06)"}}>
              <div className="text-xs syne tracking-widest uppercase mb-4" style={{color:"rgba(255,255,255,.35)"}}>Agency</div>
              <div className="flex items-end gap-1 mb-1"><span className="text-5xl font-700 syne">$69</span><span className="text-sm mb-2" style={{color:"rgba(255,255,255,.3)"}}>/mo</span></div>
              <p className="text-xs syne mb-6" style={{color:"rgba(255,255,255,.3)"}}>For teams & agencies</p>
              <ul className="space-y-3 mb-8">
                {["Everything in Pro","5 team seats","Multi-brand workspace","Batch generation","Analytics dashboard","Priority support"].map(f=>(
                  <li key={f} className="text-sm flex gap-2" style={{color:"rgba(255,255,255,.55)"}}><span style={{color:"#9B6FDF"}}>✓</span>{f}</li>
                ))}
              </ul>
              <Link href="/signup?plan=agency" className="block text-center py-3 rounded-xl syne text-sm tracking-widest uppercase"
                style={{border:"1px solid rgba(255,255,255,.1)",color:"rgba(255,255,255,.5)"}}>Get Agency</Link>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-5">
            {[
              {name:"Pro Lifetime",price:"$97",orig:"$348/yr",taken:31,total:50,color:"#C9A84C",features:["Everything in Pro","Lifetime access","All future updates","Priority support forever"],plan:"pro-lifetime"},
              {name:"Agency Lifetime",price:"$197",orig:"$828/yr",taken:18,total:50,color:"#9B6FDF",features:["Everything in Agency","Lifetime access","5 team seats forever","All future updates","White-label ready"],plan:"agency-lifetime"},
            ].map(({name,price,orig,taken,total,color,features,plan})=>(
              <div key={name} className="card-hover pricing-life rounded-2xl p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 rounded-full opacity-10 -translate-y-1/2 translate-x-1/2"
                  style={{background:color,filter:"blur(40px)"}}/>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="text-xs syne tracking-widest uppercase mb-1" style={{color}}>🔥 Lifetime Offer</div>
                    <div className="syne font-700 text-lg">{name}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-4xl font-700 syne shimmer-text">{price}</div>
                    <div className="text-xs line-through mt-0.5" style={{color:"rgba(255,255,255,.2)"}}>{orig} value</div>
                  </div>
                </div>
                <SeatsBar taken={taken} total={total}/>
                <ul className="space-y-2.5 mt-5 mb-6">
                  {features.map(f=>(
                    <li key={f} className="text-sm flex gap-2" style={{color:"rgba(255,255,255,.65)"}}><span style={{color}}>✓</span>{f}</li>
                  ))}
                </ul>
                <Link href={`/signup?plan=${plan}`} className="btn-primary block text-center py-3.5 rounded-xl syne text-sm tracking-widest uppercase">
                  Claim Lifetime Seat — {price}
                </Link>
                <p className="text-center text-xs syne mt-2" style={{color:"rgba(255,255,255,.2)"}}>Accepts Pi · USDC · Card · Dodo</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PI PAYMENTS ── */}
      <section id="pi-launch" className="py-24 px-6" style={{background:"#070707"}}>
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-6xl mb-6">π</div>
          <div className="inline-block px-4 py-1.5 rounded-full text-xs syne tracking-widest uppercase mb-6"
            style={{border:"1px solid rgba(201,168,76,.3)",color:"#C9A84C",background:"rgba(201,168,76,.05)"}}>Pi Network Integration</div>
          <h2 className="text-4xl md:text-5xl font-700 mb-6" style={{letterSpacing:"-0.02em"}}>
            First Major SaaS to Accept <span className="shimmer-text">Pi Network</span>
          </h2>
          <p className="max-w-xl mx-auto text-sm leading-relaxed mb-10 syne" style={{color:"rgba(255,255,255,.5)"}}>
            TEOS AI Engine was built by a Pi pioneer. We're among the first SaaS platforms globally to accept Pi as real payment. Join the movement.
          </p>
          <div className="grid md:grid-cols-3 gap-5 text-left mb-10">
            {[
              {icon:"💜",title:"Pi Activation",desc:"Pay with Pi to unlock Pro or Agency tier instantly. Wallet-to-wallet."},
              {icon:"🏷",title:"50% Pioneer Discount",desc:"First 300 Pi users get 50% off any plan. Built-in loyalty for early believers."},
              {icon:"💳",title:"Multiple Payment Rails",desc:"Pi Network, USDC/Solana, Dodo Payments, and card all accepted."},
            ].map(({icon,title,desc})=>(
              <div key={title} className="rounded-2xl p-6" style={{background:"#0D0D0D",border:"1px solid rgba(201,168,76,.1)"}}>
                <div className="text-2xl mb-3">{icon}</div>
                <div className="syne font-700 text-sm mb-2" style={{color:"#C9A84C"}}>{title}</div>
                <p className="text-sm" style={{color:"rgba(255,255,255,.45)"}}>{desc}</p>
              </div>
            ))}
          </div>
          <Link href="/signup?payment=pi" className="btn-primary syne text-sm tracking-widest uppercase px-8 py-4 rounded-full inline-flex items-center gap-2">
            π Activate With Pi — 50% Off
          </Link>
        </div>
      </section>

      {/* ── COMMUNITY & ECOSYSTEM ── */}
      <section id="community" className="py-24 px-6 relative overflow-hidden movement-bg">
        <div className="orb w-72 h-72 top-0 right-0" style={{background:"#7B4FBF"}}/>
        <div className="orb w-56 h-56 bottom-0 left-0" style={{background:"#C9A84C"}}/>
        <div className="max-w-5xl mx-auto relative">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-1.5 rounded-full text-xs syne tracking-widest uppercase mb-4"
              style={{border:"1px solid rgba(201,168,76,.3)",color:"#C9A84C"}}>🌍 Community & Ecosystem</div>
            <h2 className="text-4xl md:text-5xl font-700 mb-5" style={{letterSpacing:"-0.02em"}}>
              Built in Public.<br/><span className="shimmer-text">Growing as a Movement.</span>
            </h2>
            <p className="max-w-lg mx-auto text-sm syne leading-relaxed" style={{color:"rgba(255,255,255,.45)"}}>
              TEOS isn't just a SaaS tool. It's a sovereign AI ecosystem built by a Pi pioneer, for founders who believe in building differently.
            </p>
          </div>

          {/* Community Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-12">
            {[
              {val:5000,suf:"+",label:"Pi Community Reach",sub:"across 75+ countries"},
              {val:3,suf:" platforms",label:"Multi-Platform Audience",sub:"X · Telegram · LinkedIn"},
              {val:50,suf:"+",label:"Early Access Users",sub:"onboarding now"},
            ].map(({val,suf,label,sub})=>(
              <div key={label} className="text-center p-5 rounded-2xl" style={{background:"#0D0D0D",border:"1px solid rgba(255,255,255,.05)"}}>
                <div className="shimmer-text text-2xl md:text-3xl font-700 syne mb-1"><Counter end={val} suffix={suf}/></div>
                <div className="text-xs syne font-600 mb-0.5" style={{color:"rgba(255,255,255,.7)"}}>{label}</div>
                <div className="text-xs syne" style={{color:"rgba(255,255,255,.25)"}}>{sub}</div>
              </div>
            ))}
          </div>

          {/* Community Cards */}
          <div className="grid md:grid-cols-3 gap-5">
            {/* X */}
            <div className="card-hover comm-x rounded-2xl p-7 flex flex-col">
              <div className="flex items-center justify-between mb-5">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{background:"rgba(255,255,255,.08)"}}>
                  <XI s={22}/>
                </div>
                <span className="text-xs syne px-2.5 py-1 rounded-full" style={{background:"rgba(255,255,255,.06)",color:"rgba(255,255,255,.4)"}}>X · Twitter</span>
              </div>
              <h3 className="syne font-700 text-base mb-2">X / Twitter Community</h3>
              <p className="text-sm leading-relaxed mb-6 flex-1" style={{color:"rgba(255,255,255,.5)"}}>
                Follow <strong style={{color:"white"}}>@KING_TEOS</strong> for product launches, AI drops, build-in-public updates and Pi ecosystem news.
              </p>
              <a href="https://twitter.com/KING_TEOS" target="_blank" rel="noopener noreferrer"
                className="btn-x flex items-center justify-center gap-2 py-3 rounded-xl syne text-xs tracking-widest uppercase font-600">
                <XI s={13}/> Follow @KING_TEOS
              </a>
            </div>
            {/* Telegram */}
            <div className="card-hover comm-tg rounded-2xl p-7 flex flex-col relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 opacity-15 -translate-y-1/2 translate-x-1/2 rounded-full" style={{background:"#2AABEE",filter:"blur(30px)"}}/>
              <div className="flex items-center justify-between mb-5">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{background:"rgba(42,171,238,.15)"}}>
                  <TGI s={22}/>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 live-dot"/>
                  <span className="text-xs syne" style={{color:"rgba(255,255,255,.35)"}}>Active Now</span>
                </div>
              </div>
              <h3 className="syne font-700 text-base mb-2">Telegram Pioneer Community</h3>
              <p className="text-sm leading-relaxed mb-6 flex-1" style={{color:"rgba(255,255,255,.5)"}}>
                Join <strong style={{color:"#2AABEE"}}>#ElmahrosaPi</strong> for exclusive Pi launch offers, founder drops, live support and 75+ country reach.
              </p>
              <a href="https://t.me/elmahrosapi" target="_blank" rel="noopener noreferrer"
                className="btn-tg flex items-center justify-center gap-2 py-3 rounded-xl syne text-xs tracking-widest uppercase font-600">
                <TGI s={13}/> Join #ElmahrosaPi
              </a>
            </div>
            {/* LinkedIn */}
            <div className="card-hover comm-li rounded-2xl p-7 flex flex-col">
              <div className="flex items-center justify-between mb-5">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{background:"rgba(10,102,194,.15)"}}>
                  <LII s={22}/>
                </div>
                <span className="text-xs syne px-2.5 py-1 rounded-full" style={{background:"rgba(10,102,194,.1)",color:"#5BA4CF"}}>LinkedIn</span>
              </div>
              <h3 className="syne font-700 text-base mb-2">LinkedIn Network</h3>
              <p className="text-sm leading-relaxed mb-6 flex-1" style={{color:"rgba(255,255,255,.5)"}}>
                Join <strong style={{color:"#5BA4CF"}}>Teos Pharaoh Portal</strong> on LinkedIn for B2B partnerships, enterprise updates and founder community.
              </p>
              <a href="https://www.linkedin.com/company/teos-pharaoh-portal/?viewAsMember=true" target="_blank" rel="noopener noreferrer"
                className="btn-li flex items-center justify-center gap-2 py-3 rounded-xl syne text-xs tracking-widest uppercase font-600">
                <LII s={13}/> View LinkedIn
              </a>
            </div>
          </div>
          <div className="mt-10 text-center">
            <p className="text-sm syne" style={{color:"rgba(255,255,255,.3)"}}>
              Join the first sovereign AI content engine built with Pi support.
            </p>
          </div>
        </div>
      </section>

      {/* ── SOCIAL PROOF ── */}
      <section className="py-24 px-6" style={{background:"#070707"}}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-1.5 rounded-full text-xs syne tracking-widest uppercase mb-4"
              style={{border:"1px solid var(--brd)",color:"#C9A84C"}}>Early Traction</div>
            <h2 className="text-4xl font-700" style={{letterSpacing:"-0.02em"}}>Founders Are Already Seeing Results</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-5 mb-14">
            {[
              {name:"Khaled M.",role:"SaaS Founder · Egypt",text:"I was posting 2x a week and getting nothing. TEOS helped me understand what to say and when. Engagement tripled in my first week.",score:91},
              {name:"Sarah O.",role:"Consultant · Nigeria",text:"The visibility score alone is worth the price. I finally know which posts will land before I hit publish. This is different.",score:88},
              {name:"Ahmed R.",role:"Agency Owner · UAE",text:"Managing 4 client brands was chaotic. TEOS batch mode and the CTA suggestions saved me 8+ hours a week. Lifetime deal was obvious.",score:94},
            ].map(({name,role,text,score})=>(
              <div key={name} className="card-hover rounded-2xl p-6" style={{background:"#0D0D0D",border:"1px solid rgba(255,255,255,.05)"}}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex gap-0.5">{[1,2,3,4,5].map(s=><span key={s} style={{color:"#C9A84C"}}>★</span>)}</div>
                  <span className="text-xs mono px-2 py-0.5 rounded" style={{background:"rgba(201,168,76,.1)",color:"#C9A84C"}}>Score: {score}</span>
                </div>
                <p className="text-sm leading-relaxed mb-5" style={{color:"rgba(255,255,255,.6)"}}>"{text}"</p>
                <div>
                  <div className="text-sm font-600 syne">{name}</div>
                  <div className="text-xs syne" style={{color:"rgba(255,255,255,.3)"}}>{role}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center">
            <p className="text-xs syne tracking-widest uppercase mb-6" style={{color:"rgba(255,255,255,.2)"}}>Trusted by founders across</p>
            <div className="flex flex-wrap justify-center gap-3 items-center">
              {["🇪🇬 Egypt","🇳🇬 Nigeria","🇦🇪 UAE","🇬🇭 Ghana","🇰🇪 Kenya","🇺🇸 USA","🇬🇧 UK","🇸🇦 KSA"].map(c=>(
                <span key={c} className="text-xs syne tracking-wider px-3 py-1.5 rounded-full"
                  style={{background:"rgba(255,255,255,.03)",color:"rgba(255,255,255,.3)",border:"1px solid rgba(255,255,255,.06)"}}>
                  {c}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="py-32 px-6 relative overflow-hidden">
        <div className="orb w-96 h-96 top-0 left-1/2 -translate-x-1/2 -translate-y-1/2" style={{background:"#7B4FBF"}}/>
        <div className="relative max-w-3xl mx-auto text-center">
          <img src="/logo.png" alt="TEOS" className="w-20 h-20 object-contain mx-auto mb-8 float"
            onError={e=>{(e.target as HTMLImageElement).style.display="none"}}/>
          <h2 className="text-5xl md:text-6xl font-700 mb-6" style={{letterSpacing:"-0.03em",lineHeight:1.05}}>
            Your first 5 posts<br/><span className="shimmer-text">are on us.</span>
          </h2>
          <p className="text-base syne mb-10" style={{color:"rgba(255,255,255,.45)"}}>
            No credit card. No catch. Just better content — starting now.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link href="/signup" className="btn-primary syne text-sm tracking-widest uppercase px-10 py-5 rounded-full flex items-center justify-center gap-2">
              <span>✦</span> Start Free With 5 Posts
            </Link>
            <a href="#pricing" className="btn-ghost syne text-sm tracking-widest uppercase px-10 py-5 rounded-full flex items-center justify-center gap-2">
              View Lifetime Deals
            </a>
          </div>
          {/* Social row */}
          <div className="flex flex-wrap justify-center gap-3 mb-6">
            {SOCIAL.map(({label,href,Icon,color})=>(
              <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                className="social-hover flex items-center gap-2 px-4 py-2 rounded-full text-xs syne"
                style={{background:"rgba(255,255,255,.04)",border:"1px solid rgba(255,255,255,.08)",color}}>
                <Icon s={12}/> {label}
              </a>
            ))}
          </div>
          <p className="text-xs syne tracking-widest" style={{color:"rgba(255,255,255,.2)"}}>
            50 lifetime seats · {50-31} Pro + {50-18} Agency remaining
          </p>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="py-12 px-6" style={{borderTop:"1px solid rgba(201,168,76,.08)"}}>
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-8">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-3 mb-3">
                <img src="/logo.png" alt="TEOS" className="h-9 w-9 object-contain"
                  onError={e=>{(e.target as HTMLImageElement).style.display="none"}}/>
                <div>
                  <div className="syne text-sm tracking-widest uppercase" style={{color:"#C9A84C"}}>TEOS AI Engine</div>
                  <div className="text-xs syne" style={{color:"rgba(255,255,255,.25)"}}>Powered by Elmahrosa International</div>
                </div>
              </div>
              <p className="text-xs syne mb-3" style={{color:"rgba(255,255,255,.25)"}}>Alexandria, Egypt</p>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 live-dot"/>
                <span className="text-xs syne" style={{color:"rgba(255,255,255,.3)"}}>Pi Launch Support Available</span>
              </div>
            </div>
            {/* Social icons */}
            <div className="flex flex-col gap-3">
              <span className="text-xs syne tracking-widest uppercase" style={{color:"rgba(255,255,255,.2)"}}>Find Us</span>
              <div className="flex gap-3">
                <a href="https://twitter.com/KING_TEOS" target="_blank" rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full flex items-center justify-center social-hover"
                  style={{background:"rgba(255,255,255,.07)",border:"1px solid rgba(255,255,255,.1)",color:"white"}} title="@KING_TEOS">
                  <XI s={14}/>
                </a>
                <a href="https://t.me/elmahrosapi" target="_blank" rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full flex items-center justify-center social-hover"
                  style={{background:"rgba(42,171,238,.12)",border:"1px solid rgba(42,171,238,.2)",color:"#2AABEE"}} title="#ElmahrosaPi">
                  <TGI s={14}/>
                </a>
                <a href="https://www.linkedin.com/company/teos-pharaoh-portal/?viewAsMember=true" target="_blank" rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full flex items-center justify-center social-hover"
                  style={{background:"rgba(10,102,194,.12)",border:"1px solid rgba(10,102,194,.2)",color:"#5BA4CF"}} title="Teos Pharaoh Portal">
                  <LII s={14}/>
                </a>
              </div>
              <div className="flex flex-col gap-1.5">
                <a href="https://twitter.com/KING_TEOS" target="_blank" className="flex items-center gap-1.5 text-xs syne hover:text-white transition-colors" style={{color:"rgba(255,255,255,.3)"}}>
                  <XI s={10}/> @KING_TEOS
                </a>
                <a href="https://t.me/elmahrosapi" target="_blank" className="flex items-center gap-1.5 text-xs syne hover:text-white transition-colors" style={{color:"rgba(255,255,255,.3)"}}>
                  <TGI s={10}/> #ElmahrosaPi · t.me/elmahrosapi
                </a>
                <a href="https://www.linkedin.com/company/teos-pharaoh-portal/?viewAsMember=true" target="_blank" className="flex items-center gap-1.5 text-xs syne hover:text-white transition-colors" style={{color:"rgba(255,255,255,.3)"}}>
                  <LII s={10}/> Teos Pharaoh Portal
                </a>
              </div>
            </div>
            {/* Nav links */}
            <div className="flex flex-col gap-2.5">
              <span className="text-xs syne tracking-widest uppercase" style={{color:"rgba(255,255,255,.2)"}}>Navigate</span>
              {[["Features","#features"],["Pricing","#pricing"],["Pi Launch","#pi-launch"],["Community","#community"],["Login","/login"]].map(([l,h])=>(
                <a key={l} href={h} className="text-xs syne hover:text-white transition-colors" style={{color:"rgba(255,255,255,.35)"}}>{l}</a>
              ))}
            </div>
          </div>
          <div style={{height:"1px",background:"linear-gradient(90deg,transparent,rgba(201,168,76,.15),transparent)",marginBottom:"20px"}}/>
          <div className="flex flex-col md:flex-row justify-between items-center gap-3 text-xs syne" style={{color:"rgba(255,255,255,.2)"}}>
            <span>© 2025 Elmahrosa International · Alexandria, Egypt</span>
            <span style={{color:"rgba(201,168,76,.4)"}}>AI That Sees What Others Miss.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}