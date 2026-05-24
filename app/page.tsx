import Image from "next/image";
import { REMOTE_CONFIG_URL, STORE_URLS } from "@/lib/constants";
import type { AppConfig } from "@/types/app-config";

async function getDownloadUrl(): Promise<string> {
  try {
    const res = await fetch(REMOTE_CONFIG_URL, { next: { revalidate: 300 } });
    if (!res.ok) throw new Error("config fetch failed");
    const data: AppConfig = await res.json();
    if (data?.native?.updateUrl) return data.native.updateUrl;
  } catch {}
  return STORE_URLS.playStore;
}

export default async function Home() {
  const downloadUrl = await getDownloadUrl();

  return (
    <div className="min-h-screen bg-[#0a0a0a] font-sans overflow-x-hidden">

      {/* ── Nav ── */}
      <nav
        className="
          sticky top-0 z-20 flex items-center justify-between
          border-b border-white/[0.04] bg-[#0a0a0a]
          px-5 py-4 sm:px-10 sm:py-5
          animate-fade-down
        "
      >
        <div className="flex items-center gap-2">
          <Image
            src="/logo.png"
            alt="Sonic logo"
            width={28}
            height={28}
            className="rounded-md"
            priority
          />
          <span className="font-mono text-[17px] font-bold tracking-[-1px] text-stone-100">
            Sonic
          </span>
        </div>

        <div className="hidden items-center gap-8 md:flex">
          <a href="#features" className="text-[13px] font-medium text-neutral-500 transition-colors hover:text-neutral-300">Features</a>
          <a href="#about"    className="text-[13px] font-medium text-neutral-500 transition-colors hover:text-neutral-300">About</a>
          <a href="#download" className="text-[13px] font-medium text-neutral-500 transition-colors hover:text-neutral-300">Download</a>
        </div>

        <a
          href={downloadUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-xl bg-amber-300 px-4 py-2 text-[13px] font-bold text-[#0a0a0a] transition-opacity hover:opacity-90 sm:px-5 sm:py-2.5"
        >
          Get the app
        </a>
      </nav>

      <div className="mx-auto max-w-4xl px-5 sm:px-10">

        {/* ── Hero ── */}
        <section className="flex flex-col items-center gap-10 py-16 md:flex-row md:items-center md:gap-12 md:py-24">

          {/* Text — slides in from left */}
          <div
            className="
              flex flex-col items-center text-center md:items-start md:text-left
              animate-fade-right
            "
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-amber-300/20 bg-amber-300/[0.06] px-4 py-1.5">
              <div className="h-[5px] w-[5px] rounded-full bg-amber-300" />
              <span className="text-[10px] font-bold uppercase tracking-[2px] text-amber-300">
                Now in Beta
              </span>
            </div>

            <h1 className="mb-5 text-[40px] font-black leading-[1.08] tracking-[-2px] text-stone-100 sm:text-[52px]">
              Music that{" "}
              <br className="hidden sm:block" />
              actually{" "}
              <span className="text-amber-300">gets you.</span>
            </h1>

            <p className="mb-8 max-w-[380px] text-[15px] leading-[1.75] text-neutral-500">
              Sonic learns what you love and keeps the good stuff coming.
              No ads, no noise — just your music.
            </p>

            <div className="flex flex-col items-center gap-3 sm:flex-row md:items-start">
              <a
                href={downloadUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full rounded-xl bg-amber-300 px-7 py-3.5 text-center text-[14px] font-extrabold text-[#0a0a0a] transition-opacity hover:opacity-90 sm:w-auto"
              >
                Download the app
              </a>
              <a
                href="#features"
                className="w-full rounded-xl border border-white/[0.06] px-6 py-3.5 text-center text-[14px] font-semibold text-neutral-500 transition-colors hover:text-neutral-300 sm:w-auto"
              >
                Learn more
              </a>
            </div>
          </div>

          {/* Illustration — slides in from right */}
          <div
            className="
              w-full max-w-[300px] flex-shrink-0 md:max-w-[340px]
              animate-fade-left
            "
          >
            <Image
              src="/Music.png"
              alt="Person dancing with headphones"
              width={340}
              height={340}
              priority
              className="w-full drop-shadow-2xl"
            />
          </div>
        </section>

        <div className="h-px w-full bg-white/[0.04]" />

        {/* ── Features ── */}
        <section id="features" className="py-16 sm:py-20">
          <p className="mb-3 text-[10px] font-bold uppercase tracking-[3px] text-amber-300">
            Features
          </p>
          <h2 className="mb-3 text-[28px] font-black leading-[1.15] tracking-[-1px] text-stone-100 sm:text-[32px]">
            Built different.
          </h2>
          <p className="mb-10 max-w-[380px] text-[14px] leading-[1.75] text-neutral-500">
            Everything you'd expect from a music app — and a few things you wouldn't.
          </p>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
            <div className="rounded-2xl border border-amber-300/15 bg-amber-300/[0.03] p-6 transition-colors hover:border-amber-300/25">
              <div className="mb-5 flex h-9 w-9 items-center justify-center rounded-xl border border-amber-300/20 bg-amber-300/[0.08]">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="1.6" strokeLinecap="round">
                  <path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" />
                </svg>
              </div>
              <p className="mb-2 text-[14px] font-bold text-amber-300">Smart recommendations</p>
              <p className="text-[13px] leading-[1.7] text-neutral-500">
                Learns from your history in real time. The more you listen, the better it gets.
              </p>
            </div>

            <div className="rounded-2xl border border-white/[0.04] bg-white/[0.03] p-6 transition-colors hover:border-white/[0.08]">
              <div className="mb-5 flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.06] bg-white/[0.03]">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#3d3d3d" strokeWidth="1.6" strokeLinecap="round">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                </svg>
              </div>
              <p className="mb-2 text-[14px] font-bold text-neutral-400">Fast playback</p>
              <p className="text-[13px] leading-[1.7] text-neutral-500">
                Instant streaming. No buffering, no waiting — just press play.
              </p>
            </div>

            <div className="rounded-2xl border border-white/[0.04] bg-white/[0.03] p-6 transition-colors hover:border-white/[0.08] sm:col-span-2 md:col-span-1">
              <div className="mb-5 flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.06] bg-white/[0.03]">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#3d3d3d" strokeWidth="1.6" strokeLinecap="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <p className="mb-2 text-[14px] font-bold text-neutral-400">No tracking</p>
              <p className="text-[13px] leading-[1.7] text-neutral-500">
                Your data stays yours. No ads, no selling your listening habits.
              </p>
            </div>
          </div>
        </section>

        <div className="h-px w-full bg-white/[0.04]" />

        {/* ── About ── */}
        <section id="about" className="py-16 sm:py-20">
          <p className="mb-3 text-[10px] font-bold uppercase tracking-[3px] text-amber-300">
            About
          </p>
          <h2 className="mb-8 text-[28px] font-black leading-[1.15] tracking-[-1px] text-stone-100 sm:text-[32px]">
            One dev. One obsession.
          </h2>

          <div className="flex w-full flex-col items-start gap-4 rounded-2xl border border-white/[0.04] bg-white/[0.03] p-6 sm:flex-row">
            <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full border border-white/[0.07] bg-[#111]">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="1.4" strokeLinecap="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
              </svg>
            </div>
            <div>
              <p className="mb-0.5 text-[14px] font-bold text-neutral-400">Ishan</p>
              <p className="mb-3 text-[12px] text-amber-300/70">@ishan-codes-code</p>
              <p className="text-[13px] leading-[1.75] text-neutral-500">
          I built Sonic because every music app started feeling soulless &mdash; built for algorithms, ads, and numbers instead of real people who truly live through music.  
          Spotify and the others never gave me the feeling I was searching for. They forgot that music is emotion, memories, energy, and escape.  
          
          So instead of waiting for someone else to change it, I decided to build the experience I always wanted &mdash; for myself, my friends, my family, and everyone who feels music deeply.  
          
          Sonic isn&apos;t just another music app.  
          It&apos;s my attempt to bring passion back into listening.  
          
          Built for late-night drives, heartbreaks, gym motivation, peaceful mornings, random dance moments, and the songs that stay with us forever.  
          
          This is for the people who don&apos;t just hear music &mdash; they feel it.  </p>
            </div>
          </div>
        </section>

        <div className="h-px w-full bg-white/[0.04]" />

        {/* ── Download CTA ── */}
        <section id="download" className="py-16 text-center sm:py-20">
          <h2 className="mb-3 text-[28px] font-black leading-tight tracking-[-1px] text-stone-100 sm:text-[32px]">
            Ready to listen?
          </h2>
          <p className="mb-8 text-[14px] text-neutral-500">It&apos;s free. Always will be.</p>

          <a
            href={downloadUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block rounded-2xl bg-amber-300 px-10 py-4 text-[15px] font-extrabold text-[#0a0a0a] transition-opacity hover:opacity-90"
          >
            Download Sonic
          </a>
        </section>

      </div>

      {/* ── Footer ── */}
      <footer className="flex flex-col items-center gap-3 border-t border-white/[0.04] px-5 py-6 sm:flex-row sm:justify-between sm:px-10 sm:py-7">
        <div className="flex items-center gap-2">
          <Image src="/logo.png" alt="Sonic" width={20} height={20} className="rounded-md" />
          <span className="font-mono text-[15px] font-bold tracking-[-1px] text-stone-100">Sonic</span>
        </div>
        <p className="text-[12px] text-neutral-500">© 2026 Sonic. Built by Ishan.</p>
      </footer>

    </div>
  );
}
