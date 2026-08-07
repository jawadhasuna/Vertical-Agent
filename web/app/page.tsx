import ChatWidget from "@/components/ChatWidget";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#05070f] text-white">
      <style>{`
        @keyframes float-a {
          0%   { transform: translate(0, 0) scale(1); }
          25%  { transform: translate(18vw, 14vh) scale(1.1); }
          50%  { transform: translate(30vw, 4vh) scale(0.9); }
          75%  { transform: translate(10vw, 24vh) scale(1.05); }
          100% { transform: translate(0, 0) scale(1); }
        }
        @keyframes float-b {
          0%   { transform: translate(0, 0) scale(1); }
          30%  { transform: translate(-24vw, 18vh) scale(1.15); }
          55%  { transform: translate(-32vw, -10vh) scale(0.88); }
          80%  { transform: translate(-12vw, -22vh) scale(1.08); }
          100% { transform: translate(0, 0) scale(1); }
        }
        @keyframes float-c {
          0%   { transform: translate(0, 0) scale(1); }
          35%  { transform: translate(22vw, -20vh) scale(1.12); }
          60%  { transform: translate(-8vw, -30vh) scale(0.94); }
          85%  { transform: translate(-18vw, -8vh) scale(1.06); }
          100% { transform: translate(0, 0) scale(1); }
        }
        .orb-a { animation: float-a 28s ease-in-out infinite; }
        .orb-b { animation: float-b 35s ease-in-out infinite; }
        .orb-c { animation: float-c 31s ease-in-out infinite; }

        @media (prefers-reduced-motion: reduce) {
          .orb-a, .orb-b, .orb-c { animation: none; }
        }
      `}</style>

      {/* Three distinct floating orbs */}
      <div
        className="orb-a pointer-events-none absolute left-[5%] top-[10%] h-[28rem] w-[28rem] rounded-full blur-[70px]"
        style={{
          background:
            "radial-gradient(circle at 35% 35%, rgba(56,189,248,0.85), rgba(37,99,235,0.35) 55%, transparent 72%)",
        }}
      />
      <div
        className="orb-b pointer-events-none absolute right-[8%] top-[35%] h-[26rem] w-[26rem] rounded-full blur-[70px]"
        style={{
          background:
            "radial-gradient(circle at 40% 30%, rgba(168,85,247,0.8), rgba(109,40,217,0.35) 55%, transparent 72%)",
        }}
      />
      <div
        className="orb-c pointer-events-none absolute bottom-[8%] left-[35%] h-[24rem] w-[24rem] rounded-full blur-[70px]"
        style={{
          background:
            "radial-gradient(circle at 45% 40%, rgba(244,114,182,0.75), rgba(219,39,119,0.3) 55%, transparent 72%)",
        }}
      />

      <div className="relative mx-auto max-w-3xl px-6 py-28">
        <p className="text-xs uppercase tracking-[0.2em] text-white/40">
          Reference library
        </p>
        <h1 className="mt-4 text-5xl font-semibold tracking-tight">
          Humanoid Robots
        </h1>
        <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/55">
          Specifications and capabilities for Atlas, Optimus, Figure 01, ASIMO,
          Ameca, and Unitree H1. Ask the assistant in the corner anything about
          them.
        </p>
      </div>

      <ChatWidget />
    </main>
  );
}