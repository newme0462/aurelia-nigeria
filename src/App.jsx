import React, { useEffect, useRef, useState } from "react";
import { ArrowRight, Play, X, Menu } from "lucide-react";
import {
  DEBUG, VIDEO_URL, CONTENT, MODELS, NIGERIA_UPDATES, NAV_ITEMS, TESTIMONIALS,
} from "./data.js";

const logger = {
  app: (m, ...a) => DEBUG && console.log(`[APP] ${m}`, ...a),
  video: (m, ...a) => DEBUG && console.log(`[VIDEO] ${m}`, ...a),
  error: (m, ...a) => DEBUG && console.error(`[VIDEO ERROR] ${m}`, ...a),
};

const isAbortError = (e) => typeof e === "object" && e !== null && e.name === "AbortError";

/* ---------------- DEBUG PANEL ---------------- */

const DebugPanel = ({ status }) => {
  if (!DEBUG) return null;
  let color = "bg-amber-300";
  if (status === "PLAYING") color = "bg-emerald-400";
  if (status.includes("ERROR") || status === "AUTOPLAY_BLOCKED") color = "bg-red-400";
  if (["CONNECTING", "LOADING", "STALLED"].includes(status)) color = "bg-blue-400 animate-pulse";
  return (
    <div className="pointer-events-none fixed bottom-4 left-4 z-[9999] flex items-center gap-2 rounded-full border border-white/10 bg-black/70 px-3.5 py-2 font-mono text-[10px] text-white/90 shadow-2xl backdrop-blur-xl">
      <span className={`h-1.5 w-1.5 rounded-full ${color}`} />
      <span>VIDEO: {status}</span>
    </div>
  );
};

/* ---------------- VIDEO BACKGROUND ---------------- */

const VideoBackground = ({ setStatus }) => {
  const videoRef = useRef(null);
  const [isHidden, setIsHidden] = useState(false);
  const [tapToPlay, setTapToPlay] = useState(false);

  const handleTapToPlay = (event) => {
    event.stopPropagation();
    const video = videoRef.current;
    if (!video) return;
    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;
    setIsHidden(false);
    video.play()
      .then(() => { setTapToPlay(false); setStatus("PLAYING"); })
      .catch((e) => { setStatus("AUTOPLAY_BLOCKED"); logger.error("Tap-to-play failed.", e); });
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) { setStatus("ERROR"); return; }

    video.defaultMuted = true;
    video.muted = true;
    video.playsInline = true;
    video.autoplay = true;
    video.loop = true;
    logger.app("Initializing background video", VIDEO_URL);

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    const onEvent = (event) => {
      switch (event.type) {
        case "loadstart": setStatus("CONNECTING"); break;
        case "loadeddata": setStatus("LOADING"); break;
        case "canplay": setTapToPlay(true); setStatus("READY"); break;
        case "playing": setTapToPlay(false); setStatus("PLAYING"); break;
        case "pause":
          if (!reducedMotion.matches) { setTapToPlay(true); setStatus("PAUSED"); }
          break;
        case "waiting": setStatus("LOADING"); break;
        case "stalled": setStatus("STALLED"); logger.error("Video download stalled."); break;
        case "error":
          setTapToPlay(true);
          setStatus("ERROR");
          logger.error("Video failed to load", { error: video.error, source: video.currentSrc || VIDEO_URL });
          break;
        default: break;
      }
    };

    const events = ["loadstart", "loadeddata", "canplay", "playing", "pause", "waiting", "stalled", "error"];
    events.forEach((n) => video.addEventListener(n, onEvent));

    const handleReducedMotion = () => {
      if (reducedMotion.matches) {
        video.pause();
        setIsHidden(true);
        setTapToPlay(false);
        setStatus("PAUSED (REDUCED MOTION)");
      } else {
        setIsHidden(false);
        video.play().catch((e) => { if (!isAbortError(e)) logger.error("Resume failed.", e); });
      }
    };

    const attemptAutoplay = async () => {
      if (reducedMotion.matches) return;
      try {
        video.muted = true;
        await video.play();
        setTapToPlay(false);
        setStatus("PLAYING");
      } catch (e) {
        if (isAbortError(e)) return;
        setTapToPlay(true);
        setStatus("AUTOPLAY_BLOCKED");
        logger.error("Browser prevented autoplay.", e);
      }
    };

    video.load();
    if (reducedMotion.matches) handleReducedMotion();
    const playTimeout = window.setTimeout(() => void attemptAutoplay(), 250);
    reducedMotion.addEventListener("change", handleReducedMotion);

    return () => {
      window.clearTimeout(playTimeout);
      events.forEach((n) => video.removeEventListener(n, onEvent));
      reducedMotion.removeEventListener("change", handleReducedMotion);
    };
  }, [setStatus]);

  return (
    <>
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden="true"
        className={`absolute inset-0 z-0 h-full w-full object-cover object-center transition-opacity duration-700 ${isHidden ? "opacity-0" : "opacity-100"}`}
      >
        <source src={VIDEO_URL} type="video/mp4" />
      </video>

      {tapToPlay && !isHidden && (
        <button
          type="button"
          onClick={handleTapToPlay}
          className="absolute bottom-24 left-1/2 z-40 flex -translate-x-1/2 items-center gap-2 rounded-full border border-white/20 bg-black/35 px-5 py-3 text-[10px] font-medium uppercase tracking-[0.22em] text-white shadow-2xl backdrop-blur-2xl transition-all duration-300 hover:border-white/40 hover:bg-black/55 active:scale-95"
        >
          Tap to play <Play size={12} fill="currentColor" />
        </button>
      )}
    </>
  );
};

/* ---------------- NAVBAR ---------------- */

const Navbar = ({ activeSection, onNavigate }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = (section) => { onNavigate(section); setMobileOpen(false); };

  return (
    <nav className="absolute left-4 right-4 top-4 z-50 rounded-2xl border border-white/[0.14] bg-black/[0.22] px-4 py-3 text-white shadow-2xl backdrop-blur-2xl sm:left-6 sm:right-6 sm:top-5 sm:px-5 sm:py-3.5 lg:left-8 lg:right-8 lg:top-6 lg:px-6">
      <div className="flex items-center justify-between">
        <button type="button" onClick={() => navigate("home")} className="group flex items-center gap-3 text-left">
          <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/40 transition duration-300 group-hover:border-white">
            <span className="h-1.5 w-1.5 rounded-full bg-white" />
          </span>
          <span className="text-[11px] font-semibold uppercase tracking-[0.28em] sm:text-xs">Aurelia</span>
        </button>

        <div className="hidden items-center gap-7 lg:flex xl:gap-10">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => navigate(item.key)}
              className={`group relative py-2 text-[10px] font-medium uppercase tracking-[0.17em] transition duration-300 xl:text-[11px] ${activeSection === item.key ? "text-white" : "text-white/50 hover:text-white"}`}
            >
              {item.label}
              <span className={`absolute bottom-0 left-0 h-px bg-white transition-all duration-300 ${activeSection === item.key ? "w-full" : "w-0 group-hover:w-full"}`} />
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => navigate("contact")}
          className="hidden rounded-full border border-white/20 bg-white/10 px-5 py-2.5 text-[9px] font-semibold uppercase tracking-[0.16em] text-white backdrop-blur-xl transition-all duration-300 hover:border-white/40 hover:bg-white hover:text-black lg:block"
        >
          Private drive
        </button>

        <button
          type="button"
          onClick={() => setMobileOpen((p) => !p)}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/5 lg:hidden"
          aria-label="Toggle navigation"
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X size={16} /> : <Menu size={16} />}
        </button>
      </div>

      <div className={`overflow-hidden transition-all duration-500 lg:hidden ${mobileOpen ? "max-h-[420px] opacity-100" : "max-h-0 opacity-0"}`}>
        <div className="mt-4 border-t border-white/10 pt-4">
          <div className="flex flex-col gap-1">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() => navigate(item.key)}
                className="flex items-center justify-between rounded-xl px-4 py-3.5 text-left text-[10px] font-medium uppercase tracking-[0.18em] text-white/65 transition hover:bg-white/10 hover:text-white"
              >
                <span>{item.label}</span>
                <ArrowRight size={12} className="text-white/30" />
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => navigate("contact")}
            className="mt-3 w-full rounded-xl bg-white px-4 py-3.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-black"
          >
            Book a private drive
          </button>
        </div>
      </div>
    </nav>
  );
};

/* ---------------- HERO ---------------- */

const Hero = ({ setStatus, activeSection, onNavigate }) => {
  const [tapIndex, setTapIndex] = useState(0);
  const [selectedModel, setSelectedModel] = useState(0);
  const [updateIndex, setUpdateIndex] = useState(0);
  const [reviewIndex, setReviewIndex] = useState(0);

  const current = CONTENT[activeSection];
  const selectedVehicle = MODELS[selectedModel];
  const currentReview = TESTIMONIALS[reviewIndex];
  const nextReview = () => setReviewIndex((p) => (p + 1) % TESTIMONIALS.length);

  useEffect(() => {
    const t = window.setInterval(() => setUpdateIndex((p) => (p + 1) % NIGERIA_UPDATES.length), 4800);
    return () => window.clearInterval(t);
  }, []);

  useEffect(() => {
    if (activeSection !== "reviews") return;
    const t = window.setInterval(nextReview, 6500);
    return () => window.clearInterval(t);
  }, [activeSection]);

  const handleCanvasTap = () => {
    if (activeSection === "home") setTapIndex((p) => (p + 1) % 3);
  };

  const activeMetrics =
    activeSection === "home"
      ? [
          [selectedVehicle.name, selectedVehicle.price],
          ["Spec", selectedVehicle.detail],
          ["Market", current.availability],
        ]
      : current.metrics;

  return (
    <section className="relative isolate h-full w-full overflow-hidden bg-black text-white" onClick={handleCanvasTap}>
      <VideoBackground setStatus={setStatus} />

      <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-b from-black/65 via-black/15 to-black/70" />
      <div className="pointer-events-none absolute inset-0 z-10 bg-[radial-gradient(circle_at_center,transparent_20%,rgba(0,0,0,0.18)_100%)]" />

      {/* CENTER CONTENT */}
      <div
        key={`${activeSection}-${tapIndex}-${reviewIndex}`}
        className="relative z-20 flex h-full w-full items-center justify-center overflow-y-auto px-5 pb-28 pt-32 sm:px-8 sm:pb-28 sm:pt-36 lg:px-12"
      >
        <div className="my-auto flex w-full max-w-4xl flex-col items-center text-center">
          <div className="animate-fade-in-up mb-6 flex items-center gap-3">
            <span className="h-px w-7 bg-white/40" />
            <span className="text-[9px] font-medium uppercase tracking-[0.32em] text-white/65 sm:text-[10px]">{current.eyebrow}</span>
            <span className="h-px w-7 bg-white/40" />
          </div>

          <h1 className="animate-fade-in-up animation-delay-100 max-w-4xl text-[3.5rem] font-medium leading-[0.9] tracking-[-0.055em] sm:text-6xl md:text-7xl lg:text-[6.8rem] xl:text-[7.5rem]">
            {current.title}
          </h1>

          <p className="animate-fade-in-up animation-delay-200 mt-7 max-w-xl text-sm font-light leading-7 text-white/65 sm:text-base md:text-lg">
            {current.description}
          </p>

          {activeSection === "reviews" && (
            <div className="pointer-events-auto animate-fade-in-up mt-8 w-full max-w-2xl rounded-2xl border border-white/[0.16] bg-black/25 p-5 text-left shadow-2xl backdrop-blur-2xl sm:p-7">
              <div className="mb-5 flex items-center justify-between gap-4 border-b border-white/10 pb-4">
                <span className="text-[8px] uppercase tracking-[0.2em] text-white/45">Early-access community</span>
                <span className="text-[8px] uppercase tracking-[0.2em] text-white/35">
                  {String(reviewIndex + 1).padStart(2, "0")} / 03
                </span>
              </div>
              <blockquote className="text-base font-light leading-7 text-white/90 sm:text-lg sm:leading-8">
                “{currentReview.quote}”
              </blockquote>
              <div className="mt-6 flex items-end justify-between gap-5">
                <div>
                  <p className="text-[10px] font-medium uppercase tracking-[0.14em]">
                    {currentReview.name} · {currentReview.city}
                  </p>
                  <p className="mt-1.5 text-[8px] uppercase tracking-[0.16em] text-white/40">{currentReview.role}</p>
                </div>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); nextReview(); }}
                  className="shrink-0 rounded-full border border-white/20 bg-white/5 px-4 py-2.5 text-[8px] uppercase tracking-[0.16em] text-white/70 backdrop-blur-xl transition hover:border-white/40 hover:bg-white/10 hover:text-white"
                >
                  Next review
                </button>
              </div>
            </div>
          )}

          <div className="pointer-events-auto animate-fade-in-up animation-delay-300 mt-9 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (activeSection === "reviews") nextReview();
                else onNavigate(activeSection === "home" ? "models" : "contact");
              }}
              className="group flex items-center gap-4 rounded-full bg-white px-6 py-3.5 text-[9px] font-semibold uppercase tracking-[0.18em] text-black shadow-2xl transition-all duration-300 hover:gap-5 hover:bg-white/90 active:scale-95 sm:px-7 sm:py-4"
            >
              {current.primary}
              <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
            </button>

            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onNavigate(activeSection === "contact" ? "home" : "contact"); }}
              className="rounded-full border border-white/25 bg-white/[0.08] px-6 py-3.5 text-[9px] font-semibold uppercase tracking-[0.18em] text-white shadow-xl backdrop-blur-xl transition-all duration-300 hover:border-white/45 hover:bg-white/[0.15] active:scale-95 sm:px-7 sm:py-4"
            >
              {current.secondary}
            </button>
          </div>

          {activeSection !== "reviews" && (
            <div className="pointer-events-auto animate-fade-in-up mt-7 flex flex-wrap justify-center gap-2">
              {MODELS.map((model, index) => (
                <button
                  key={model.name}
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setSelectedModel(index); }}
                  className={`rounded-full border px-3.5 py-2 text-[8px] uppercase tracking-[0.15em] transition-all duration-300 ${
                    selectedModel === index
                      ? "border-white bg-white text-black"
                      : "border-white/15 bg-black/20 text-white/50 hover:border-white/40 hover:text-white"
                  }`}
                >
                  {model.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* LEFT PERFORMANCE PANEL */}
      <div
        key={`metrics-${activeSection}-${tapIndex}`}
        className="animate-fade-in-up absolute bottom-7 left-5 z-20 hidden md:block lg:left-8 xl:left-10"
      >
        <div className="border-l border-white/25 pl-5">
          <p className="mb-4 text-[8px] uppercase tracking-[0.25em] text-white/40">Aurelia Nigeria / Performance division</p>
          <div className="flex items-start gap-7 xl:gap-10">
            {activeMetrics.map(([label, value]) => (
              <div key={label} className="min-w-[70px]">
                <p className="text-sm font-medium tracking-wide text-white">{value}</p>
                <p className="mt-1.5 text-[8px] uppercase tracking-[0.18em] text-white/40">{label}</p>
              </div>
            ))}
          </div>
          <div className="mt-5 flex items-center gap-2 text-[8px] uppercase tracking-[0.14em] text-emerald-200/70">
            <span className="h-1 w-1 rounded-full bg-emerald-300" />
            {NIGERIA_UPDATES[updateIndex]}
          </div>
        </div>
      </div>

      {/* RIGHT SPECIFICATION CARD */}
      <div className="animate-fade-in-up absolute right-5 top-1/2 z-20 hidden w-56 -translate-y-1/2 rounded-2xl border border-white/[0.14] bg-black/[0.18] p-5 text-white shadow-2xl backdrop-blur-2xl lg:block xl:right-8 xl:w-60 xl:p-6">
        <div className="mb-6 flex items-center justify-between border-b border-white/10 pb-4">
          <div>
            <p className="text-[9px] font-medium uppercase tracking-[0.2em]">{selectedVehicle.name}</p>
            <p className="mt-1 text-[7px] uppercase tracking-[0.15em] text-white/35">{selectedVehicle.type}</p>
          </div>
          <span className="text-[8px] uppercase tracking-[0.2em] text-white/40">2026</span>
        </div>

        <div className="space-y-4 text-[9px] uppercase tracking-[0.14em]">
          <div className="flex items-center justify-between gap-4">
            <span className="text-white/40">Starting</span>
            <span className="text-right">{selectedVehicle.price}</span>
          </div>
          <div className="h-px bg-white/10" />
          <div className="flex items-center justify-between gap-4">
            <span className="text-white/40">Location</span>
            <span className="text-right">{current.availability}</span>
          </div>
          <div className="h-px bg-white/10" />
          <div className="flex items-center justify-between gap-4">
            <span className="text-white/40">Spec</span>
            <span className="text-right text-emerald-200/90">{selectedVehicle.detail}</span>
          </div>
        </div>

        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onNavigate("contact"); }}
          className="mt-6 w-full rounded-xl border border-white/15 bg-white/5 px-3 py-3 text-[8px] font-medium uppercase tracking-[0.16em] text-white/75 transition hover:border-white/30 hover:bg-white/10 hover:text-white"
        >
          Configure →
        </button>
      </div>

      {/* BOTTOM CENTER TICKER */}
      <div className="pointer-events-none absolute bottom-7 left-1/2 z-20 flex w-[calc(100%-40px)] max-w-xl -translate-x-1/2 items-center justify-center gap-3 text-center text-[8px] uppercase tracking-[0.2em] text-white/45 sm:w-auto">
        <span className="hidden h-px w-8 bg-white/20 sm:block" />
        <span>{NIGERIA_UPDATES[updateIndex]}</span>
        <span className="hidden h-px w-8 bg-white/20 sm:block" />
      </div>
    </section>
  );
};

/* ---------------- APP ---------------- */

export default function App() {
  const [videoStatus, setVideoStatus] = useState("INITIALIZING");
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    logger.app("Application starting...");
  }, []);

  return (
    <div className="fixed inset-0 h-[100svh] w-full overflow-hidden bg-black font-sans antialiased">
      <DebugPanel status={videoStatus} />
      <Navbar activeSection={activeSection} onNavigate={setActiveSection} />
      <main className="h-full w-full">
        <Hero setStatus={setVideoStatus} activeSection={activeSection} onNavigate={setActiveSection} />
      </main>
    </div>
  );
}
