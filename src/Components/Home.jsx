import { useEffect, useState, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import "@fontsource/cormorant-garamond/300.css";
import "@fontsource/cormorant-garamond/400.css";
import "@fontsource/cormorant-garamond/600.css";
import "@fontsource/cormorant-garamond/300-italic.css";
import "@fontsource/cormorant-garamond/400-italic.css";
import "@fontsource/dm-sans/300.css";
import "@fontsource/dm-sans/400.css";

// ── CONFIG ──────────────────────────────────────────────────
const WA_NUMBER = "919961770279";
const NASHEED_SRC = "/wedding-nasheed.mp3";
// ────────────────────────────────────────────────────────────

function useIsMobile() {
    const [isMobile, setIsMobile] = useState(() => window.innerWidth < 640);
    useEffect(() => {
        const handler = () => setIsMobile(window.innerWidth < 640);
        window.addEventListener("resize", handler);
        return () => window.removeEventListener("resize", handler);
    }, []);
    return isMobile;
}

function useCountdown(targetDate) {
    const [time, setTime] = useState({ d: "--", h: "--", m: "--", s: "--" });
    const [tick, setTick] = useState(false);
    useEffect(() => {
        const update = () => {
            const diff = new Date(targetDate) - new Date();
            if (diff <= 0) return setTime({ d: "00", h: "00", m: "00", s: "00" });
            const newS = String(Math.floor((diff % 60000) / 1000)).padStart(2, "0");
            setTime(prev => {
                if (prev.s !== newS) setTick(t => !t);
                return {
                    d: String(Math.floor(diff / 86400000)).padStart(2, "0"),
                    h: String(Math.floor((diff % 86400000) / 3600000)).padStart(2, "0"),
                    m: String(Math.floor((diff % 3600000) / 60000)).padStart(2, "0"),
                    s: newS,
                };
            });
        };
        update();
        const id = setInterval(update, 1000);
        return () => clearInterval(id);
    }, [targetDate]);
    return { time, tick };
}

function Divider({ width = 48 }) {
    return (
        <div style={{ display: "flex", alignItems: "center", gap: "10px", justifyContent: "center" }}>
            <div style={{ height: "0.5px", width, background: "linear-gradient(to right, transparent, #c9a87a)" }} />
            <span style={{ color: "#c9a87a", fontSize: "9px", letterSpacing: "4px" }}>✦</span>
            <div style={{ height: "0.5px", width, background: "linear-gradient(to left, transparent, #c9a87a)" }} />
        </div>
    );
}

function RevealBlock({ children, delay = 0 }) {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: "-40px" });
    return (
        <motion.div ref={ref}
            initial={{ opacity: 0, y: 22 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1], delay }}>
            {children}
        </motion.div>
    );
}

function FloatingParticles() {
    const canvasRef = useRef(null);
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        let animId, W, H, particles = [];
        function resize() { W = canvas.width = canvas.offsetWidth; H = canvas.height = canvas.offsetHeight; }
        resize();
        window.addEventListener("resize", resize);
        function Particle() {
            this.reset = function () {
                this.x = Math.random() * W; this.y = -10;
                this.size = 1.5 + Math.random() * 2.5;
                this.speedY = 0.35 + Math.random() * 0.6;
                this.speedX = (Math.random() - 0.5) * 0.35;
                this.opacity = 0.07 + Math.random() * 0.16;
                this.angle = Math.random() * Math.PI * 2;
                this.spin = (Math.random() - 0.5) * 0.025;
                this.shape = Math.random() > 0.5 ? "petal" : "dot";
            };
            this.reset(); this.y = Math.random() * H;
        }
        for (let i = 0; i < 55; i++) particles.push(new Particle());
        function loop() {
            ctx.clearRect(0, 0, W, H);
            for (let p of particles) {
                p.y += p.speedY; p.x += p.speedX; p.angle += p.spin;
                if (p.y > H + 10) p.reset();
                ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.angle);
                ctx.globalAlpha = p.opacity; ctx.strokeStyle = "#c9a87a"; ctx.lineWidth = 0.5;
                if (p.shape === "petal") { ctx.beginPath(); ctx.ellipse(0, 0, p.size * 0.6, p.size * 1.5, 0, 0, Math.PI * 2); ctx.stroke(); }
                else { ctx.beginPath(); ctx.arc(0, 0, p.size * 0.5, 0, Math.PI * 2); ctx.stroke(); }
                ctx.restore();
            }
            animId = requestAnimationFrame(loop);
        }
        loop();
        return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", resize); };
    }, []);
    return <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 0 }} />;
}

function EventBox({ tag, date, time, venue }) {
    const [hovered, setHovered] = useState(false);
    const isMobile = useIsMobile();
    return (
        <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
            style={{
                flex: 1,
                border: `0.5px solid ${hovered ? "#c9a87a" : "#e0d0be"}`,
                padding: isMobile ? "20px 12px" : "16px",
                position: "relative",
                background: "#fdfaf6",
                transition: "border-color 0.3s",
                cursor: "default",
            }}>
            {[{ top: -3, left: -3 }, { top: -3, right: -3 }, { bottom: -3, left: -3 }, { bottom: -3, right: -3 }].map((p, i) => (
                <div key={i} style={{ position: "absolute", width: "6px", height: "6px", background: "#fdfaf6", border: "0.5px solid #c9a87a", ...p }} />
            ))}
            <div style={{ fontSize: "9px", letterSpacing: "0.3em", textTransform: "uppercase", color: "#c9a87a", marginBottom: "8px" }}>{tag}</div>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: isMobile ? "16px" : "17px", color: "#2c1f14", marginBottom: "3px" }}>{date}</div>
            <div style={{ fontSize: "10px", letterSpacing: "0.2em", color: "#a89880", textTransform: "uppercase", marginBottom: "6px" }}>{time}</div>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: isMobile ? "13px" : "14px", color: "#2c1f14", fontStyle: "italic" }}>{venue}</div>
        </div>
    );
}

// ── NASHEED PLAYER ───────────────────────────────────────────
function NasheedPlayer() {
    const audioRef = useRef(null);
    const [status, setStatus] = useState("idle");
    const [prompted, setPrompted] = useState(false);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;
        audio.volume = 0.55;
        const playPromise = audio.play();
        if (playPromise !== undefined) {
            playPromise
                .then(() => setStatus("playing"))
                .catch(() => {
                    setStatus("idle");
                    setPrompted(true);
                });
        }
        return () => { audio.pause(); };
    }, []);

    const toggle = () => {
        const audio = audioRef.current;
        if (!audio) return;
        if (status === "playing") {
            audio.pause();
            setStatus("paused");
        } else {
            audio.play().then(() => setStatus("playing")).catch(() => setStatus("unavailable"));
        }
        setPrompted(false);
    };

    if (status === "unavailable") return null;

    return (
        <>
            <audio ref={audioRef} src={NASHEED_SRC} loop preload="auto" style={{ display: "none" }} />
        </>
    );
}

// ── THANK YOU PAGE ───────────────────────────────────────────
function ThankYouPage({ onBack }) {
    const isMobile = useIsMobile();
    return (
        <motion.div
            initial={{ opacity: 0, x: 80 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 80 }}
            transition={{ duration: 0.65, ease: [0.25, 0.1, 0.25, 1] }}
            style={{
                minHeight: "100vh",
                background: "#f0ebe0",
                backgroundImage: "radial-gradient(ellipse at 30% 30%, rgba(201,168,122,0.14) 0%, transparent 55%), radial-gradient(ellipse at 70% 70%, rgba(201,168,122,0.08) 0%, transparent 55%)",
                display: "flex", alignItems: "center", justifyContent: "center",
                padding: isMobile ? "24px 12px 80px" : "48px 16px 100px",
                fontFamily: "'DM Sans', sans-serif", color: "#2c1f14",
                position: "relative", overflow: "hidden",
            }}
        >
            <FloatingParticles />
            <NasheedPlayer />

            <div style={{ width: "100%", maxWidth: "560px", position: "relative", zIndex: 1 }}>
                <motion.div
                    initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15, duration: 0.8 }}
                    style={{
                        background: "#ffffff", border: "1px solid #ddd0bc",
                        boxShadow: "0 20px 80px rgba(44,31,20,0.14)",
                        position: "relative",
                        padding: isMobile ? "40px 24px 36px" : "56px 48px 48px",
                        textAlign: "center",
                    }}
                >
                    <div style={{ position: "absolute", inset: "12px", border: "0.5px solid #ede4d4", pointerEvents: "none" }} />

                    {[
                        { top: 6, left: 6, d: "M2 14 L2 2 L14 2" },
                        { top: 6, right: 6, d: "M10 2 L22 2 L22 14" },
                        { bottom: 6, left: 6, d: "M2 10 L2 22 L14 22" },
                        { bottom: 6, right: 6, d: "M10 22 L22 22 L22 10" },
                    ].map(({ d: path, ...pos }, i) => (
                        <div key={i} style={{ position: "absolute", ...pos }}>
                            <svg width="20" height="20" viewBox="0 0 24 24"><path d={path} stroke="#c9a87a" strokeWidth="0.8" fill="none" /></svg>
                        </div>
                    ))}

                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                        <div style={{ fontSize: "9px", letterSpacing: "0.44em", textTransform: "uppercase", color: "#a89880", marginBottom: "14px" }}>
                            Jazakallahu Khairan
                        </div>
                        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: isMobile ? "38px" : "44px", color: "#2c1f14", lineHeight: 1.05, marginBottom: "4px" }}>
                            We can't wait
                        </div>
                        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: isMobile ? "38px" : "44px", color: "#2c1f14", lineHeight: 1.05, marginBottom: "24px" }}>
                            to see you!
                        </div>
                    </motion.div>

                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.65 }} style={{ marginBottom: "24px" }}>
                        <Divider width={48} />
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.75 }}>
                        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: isMobile ? "18px" : "18px", color: "#7a6858", lineHeight: 1.9, marginBottom: "28px" }}>
                            Your presence at the Walima of<br />
                            <span style={{ color: "#2c1f14", fontStyle: "italic" }}>Muhammed Hinan &amp; Safa Sherin</span><br />
                            means the world to us.
                        </p>
                    </motion.div>

                    {/* Info cards — stack on mobile */}
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.85 }}
                        style={{
                            display: "flex",
                            flexDirection: isMobile ? "column" : "row",
                            gap: "10px",
                            marginBottom: "28px",
                        }}>
                        {[
                            { icon: "🕛", label: "Walima", val: "20 May · 12 PM", sub: "Aurea Auditorium" },
                            { icon: "🕌", label: "Nikkah", val: "19 May · 10 AM", sub: "Huda Masjid, Thalassery" },
                            { icon: "📍", label: "Directions", val: "Open Maps", link: "https://maps.google.com/?q=Aurea+Auditorium+Thalassery" },
                        ].map((c, i) => (
                            <a key={i} href={c.link || undefined} target={c.link ? "_blank" : undefined} rel="noopener noreferrer"
                                style={{
                                    flex: 1,
                                    padding: "14px 10px",
                                    border: "0.5px solid #e0d0be", background: "#fdfaf6",
                                    textDecoration: "none", color: "#2c1f14",
                                    display: "block",
                                    textAlign: "center",
                                    transition: "border-color 0.25s",
                                    cursor: c.link ? "pointer" : "default",
                                }}
                                onMouseEnter={e => e.currentTarget.style.borderColor = "#c9a87a"}
                                onMouseLeave={e => e.currentTarget.style.borderColor = "#e0d0be"}
                            >
                                {!isMobile && <div style={{ fontSize: "20px", marginBottom: "6px" }}>{c.icon}</div>}
                                <div>
                                    <div style={{ fontSize: "9px", letterSpacing: "0.28em", textTransform: "uppercase", color: "#c9a87a", marginBottom: "2px" }}>{c.label}</div>
                                    <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "14px", color: "#2c1f14", lineHeight: 1.4 }}>{c.val}</div>
                                    {c.sub && <div style={{ fontSize: "10px", color: "#a89880", marginTop: "2px" }}>{c.sub}</div>}
                                </div>
                            </a>
                        ))}
                    </motion.div>

                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.0 }} style={{ marginBottom: "22px" }}>
                        <Divider width={36} />
                    </motion.div>

                    <motion.button
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.3 }}
                        whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                        onClick={onBack}
                        style={{
                            padding: "10px 24px", fontSize: "9px", letterSpacing: "0.22em",
                            textTransform: "uppercase", border: "0.5px solid #d4c4ae",
                            color: "#a89880", background: "transparent", cursor: "pointer",
                            fontFamily: "'DM Sans', sans-serif", transition: "all 0.3s",
                        }}
                    >
                        ← Back to Invitation
                    </motion.button>
                </motion.div>
            </div>
        </motion.div>
    );
}

// ── UNABLE TO ATTEND PAGE ─────────────────────────────────────
function UnablePage({ onBack }) {
    const isMobile = useIsMobile();
    return (
        <motion.div
            initial={{ opacity: 0, x: 80 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 80 }}
            transition={{ duration: 0.65, ease: [0.25, 0.1, 0.25, 1] }}
            style={{
                minHeight: "100vh",
                background: "#f0ebe0",
                backgroundImage: "radial-gradient(ellipse at 30% 30%, rgba(201,168,122,0.10) 0%, transparent 55%)",
                display: "flex", alignItems: "center", justifyContent: "center",
                padding: isMobile ? "24px 12px 60px" : "48px 16px 72px",
                fontFamily: "'DM Sans', sans-serif", color: "#2c1f14",
                position: "relative", overflow: "hidden",
            }}
        >
            <FloatingParticles />

            <div style={{ width: "100%", maxWidth: "480px", position: "relative", zIndex: 1 }}>
                <motion.div
                    initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15, duration: 0.8 }}
                    style={{
                        background: "#ffffff", border: "1px solid #ddd0bc",
                        boxShadow: "0 20px 80px rgba(44,31,20,0.10)",
                        position: "relative",
                        padding: isMobile ? "40px 24px 36px" : "56px 44px 44px",
                        textAlign: "center",
                    }}
                >
                    <div style={{ position: "absolute", inset: "12px", border: "0.5px solid #ede4d4", pointerEvents: "none" }} />

                    {[{ top: 6, left: 6, d: "M2 14 L2 2 L14 2" }, { top: 6, right: 6, d: "M10 2 L22 2 L22 14" }, { bottom: 6, left: 6, d: "M2 10 L2 22 L14 22" }, { bottom: 6, right: 6, d: "M10 22 L22 22 L22 10" }].map(({ d: path, ...pos }, i) => (
                        <div key={i} style={{ position: "absolute", ...pos }}>
                            <svg width="20" height="20" viewBox="0 0 24 24"><path d={path} stroke="#c9a87a" strokeWidth="0.8" fill="none" /></svg>
                        </div>
                    ))}

                    <motion.div
                        initial={{ scale: 0 }} animate={{ scale: [0, 1.2, 1] }}
                        transition={{ delay: 0.4, duration: 0.6, ease: "backOut" }}
                        style={{ fontSize: "40px", marginBottom: "20px" }}
                    >🤲</motion.div>

                    <div style={{ fontSize: "9px", letterSpacing: "0.44em", textTransform: "uppercase", color: "#a89880", marginBottom: "14px" }}>
                        Jazakallahu Khairan
                    </div>
                    <div style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: isMobile ? "34px" : "38px", color: "#2c1f14", lineHeight: 1.1, marginBottom: "20px" }}>
                        We understand,<br />
                        <span style={{ fontStyle: "italic" }}>may Allah bless you.</span>
                    </div>

                    <Divider width={44} />

                    <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: isMobile ? "18px" : "18px", color: "#7a6858", lineHeight: 1.9, margin: "22px 0 28px" }}>
                        Your prayers and good wishes<br />
                        for <span style={{ fontStyle: "italic", color: "#2c1f14" }}>Muhammed Hinan &amp; Safa Sherin</span><br />
                        are deeply cherished. 🤍
                    </p>

                    <Divider width={36} />

                    <motion.button
                        whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                        onClick={onBack}
                        style={{
                            padding: "10px 24px", fontSize: "9px", letterSpacing: "0.22em",
                            textTransform: "uppercase", border: "0.5px solid #d4c4ae",
                            color: "#a89880", background: "transparent", cursor: "pointer",
                            fontFamily: "'DM Sans', sans-serif", marginTop: "24px",
                        }}
                    >
                        ← Back to Invitation
                    </motion.button>
                </motion.div>
            </div>
        </motion.div>
    );
}

// ── RSVP SECTION ─────────────────────────────────────────────
function RsvpSection({ onAttending, onUnable }) {
    const [rsvp, setRsvp] = useState(null);
    const isMobile = useIsMobile();

    const handleConfirm = () => {
        if (!rsvp) return;
        const msg = rsvp === "yes"
            ? "Assalamualaikum! I will be attending the Walima of Muhammed Hinan & Safa Sherin on 20 May 2026, In Sha Allah"
            : "Assalamualaikum, I'm unable to attend the Walima of Muhammed Hinan & Safa Sherin on 20 May 2026. May Allah bless you";
        window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`, "_blank");
        setTimeout(() => {
            if (rsvp === "yes") onAttending();
            else onUnable();
        }, 600);
    };

    return (
        <div style={{ textAlign: "center" }}>
            <Divider width={40} />
            <div style={{ fontSize: "10px", letterSpacing: "0.4em", textTransform: "uppercase", color: "#a89880", margin: "18px 0 6px" }}>
                Will you attend?
            </div>
            <div style={{ fontSize: "12px", color: "#b8a898", marginBottom: "16px", fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic" }}>
                Select your response and confirm via WhatsApp
            </div>

            <div style={{
                display: "flex",
                flexDirection: isMobile ? "column" : "row",
                gap: "10px",
                justifyContent: "center",
                marginBottom: "14px",
            }}>
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                    onClick={() => setRsvp("yes")}
                    style={{
                        padding: "13px 26px", fontSize: "10px", letterSpacing: "0.22em", textTransform: "uppercase",
                        border: `1px solid ${rsvp === "yes" ? "#b8956a" : "#e0d0be"}`,
                        cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
                        color: rsvp === "yes" ? "#fff" : "#b8956a",
                        background: rsvp === "yes" ? "#b8956a" : "transparent",
                        transition: "all 0.3s ease",
                        width: isMobile ? "100%" : "auto",
                    }}>
                    Yes, In Sha Allah
                </motion.button>
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                    onClick={() => setRsvp("no")}
                    style={{
                        padding: "13px 26px", fontSize: "10px", letterSpacing: "0.22em", textTransform: "uppercase",
                        border: `1px solid ${rsvp === "no" ? "#9a8878" : "#e0d0be"}`,
                        color: rsvp === "no" ? "#fff" : "#9a8878",
                        background: rsvp === "no" ? "#9a8878" : "transparent",
                        cursor: "pointer", fontFamily: "'DM Sans', sans-serif", transition: "all 0.3s ease",
                        width: isMobile ? "100%" : "auto",
                    }}>
                    Unable to attend
                </motion.button>
            </div>

            <AnimatePresence>
                {rsvp && (
                    <motion.div key="wa"
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        transition={{ duration: 0.35 }}>
                        <motion.button
                            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                            onClick={handleConfirm}
                            style={{
                                display: "inline-flex", alignItems: "center", gap: "10px",
                                padding: "13px 28px", fontSize: "10px", letterSpacing: "0.22em",
                                textTransform: "uppercase", border: "none", borderRadius: "2px",
                                background: "linear-gradient(135deg, #25D366, #128C7E)",
                                color: "#fff", cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
                                boxShadow: "0 4px 20px rgba(37,211,102,0.28)",
                                width: isMobile ? "100%" : "auto",
                                justifyContent: "center",
                            }}>
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="white">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                            </svg>
                            Confirm on WhatsApp
                        </motion.button>
                        <div style={{ marginTop: "8px", fontSize: "15px", color: "#b8a898", fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic" }}>
                            {rsvp === "yes"
                                ? "WhatsApp will open — then you'll be taken to a special page"
                                : "WhatsApp will open with your message — we'll miss you"}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div style={{ marginTop: "22px" }}><Divider width={36} /></div>
            <p style={{ marginTop: "14px", fontSize: "11px", letterSpacing: "0.28em", textTransform: "uppercase", color: "#c0b0a0" }}>
                Muhammed Hinan &amp; Safa Sherin · May 2026
            </p>
        </div>
    );
}

// ── INVITATION PAGE ───────────────────────────────────────────
function InvitationPage({ onAttending, onUnable }) {
    const { time: { d, h, m, s }, tick } = useCountdown("2026-05-20T12:00:00");
    const isMobile = useIsMobile();

    return (
        <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, x: -80 }}
            transition={{ duration: 0.65, ease: [0.25, 0.1, 0.25, 1] }}
            style={{
                minHeight: "100vh", background: "#f0ebe0",
                backgroundImage: "radial-gradient(ellipse at 20% 20%, rgba(201,168,122,0.12) 0%, transparent 55%), radial-gradient(ellipse at 80% 80%, rgba(201,168,122,0.08) 0%, transparent 55%)",
                display: "flex", alignItems: "flex-start", justifyContent: "center",
                padding: isMobile ? "20px 12px 60px" : "48px 16px 72px",
                fontFamily: "'DM Sans', sans-serif", color: "#2c1f14",
                position: "relative", overflow: "hidden",
            }}>
            <FloatingParticles />

            <motion.div
                initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.0, ease: [0.25, 0.1, 0.25, 1] }}
                style={{
                    width: "100%",
                    maxWidth: "780px",
                    display: "flex",
                    flexDirection: isMobile ? "column" : "row",
                    boxShadow: "0 20px 80px rgba(44,31,20,0.18)",
                    position: "relative",
                    zIndex: 1,
                }}>

                {/* TOP BAR on mobile / LEFT SIDEBAR on desktop */}
                {isMobile ? (
                    <div style={{
                        background: "#2c1f14",
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "16px 24px",
                        position: "relative",
                        overflow: "hidden",
                    }}>
                        <div style={{ position: "absolute", inset: 0, backgroundImage: "repeating-linear-gradient(45deg, rgba(201,168,122,0.04) 0, rgba(201,168,122,0.04) 1px, transparent 1px, transparent 8px)" }} />
                        <span style={{ fontSize: "10px", letterSpacing: "0.38em", color: "#6a5440", textTransform: "uppercase", position: "relative", zIndex: 1 }}>Walima</span>
                        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: "44px", color: "#3d2a1a", lineHeight: 1, position: "relative", zIndex: 1 }}>20</div>
                        <span style={{ fontSize: "10px", letterSpacing: "0.38em", color: "#6a5440", textTransform: "uppercase", position: "relative", zIndex: 1 }}>May 2026</span>
                    </div>
                ) : (
                    <div style={{ width: "110px", background: "#2c1f14", flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-between", padding: "36px 0", position: "relative", overflow: "hidden" }}>
                        <div style={{ position: "absolute", inset: 0, backgroundImage: "repeating-linear-gradient(45deg, rgba(201,168,122,0.04) 0, rgba(201,168,122,0.04) 1px, transparent 1px, transparent 8px)" }} />
                        <span style={{ writingMode: "vertical-rl", transform: "rotate(180deg)", fontSize: "11px", letterSpacing: "0.38em", color: "#6a5440", textTransform: "uppercase", position: "relative", zIndex: 1, fontFamily: "'DM Sans', sans-serif" }}>Walima</span>
                        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: "80px", color: "#3d2a1a", lineHeight: 1, letterSpacing: "-0.03em", textAlign: "center", position: "relative", zIndex: 1 }}>20</div>
                        <span style={{ writingMode: "vertical-rl", transform: "rotate(180deg)", fontSize: "11px", letterSpacing: "0.38em", color: "#6a5440", textTransform: "uppercase", position: "relative", zIndex: 1, fontFamily: "'DM Sans', sans-serif" }}>May 2026</span>
                    </div>
                )}

                {/* MAIN CONTENT */}
                <div style={{ flex: 1, background: "#ffffff", position: "relative", overflow: "hidden" }}>
                    <div style={{ position: "absolute", inset: "14px", border: "0.5px solid #ede4d4", pointerEvents: "none", zIndex: 1 }} />
                    <div style={{ padding: isMobile ? "28px 35px 28px" : "44px 44px 40px", position: "relative", zIndex: 2 }}>

                        <RevealBlock delay={0}>
                            <div style={{ marginBottom: "28px" }}>
                                <div style={{ fontSize: "26px", color: "#b8956a", marginBottom: "5px" }}>﷽</div>
                                <div style={{ fontSize: isMobile ? "11px" : "11px", letterSpacing: "0.32em", textTransform: "uppercase", color: "#a89880", marginBottom: "24px" }}>In the Name of Allah, the Most Gracious</div>
                                <div style={{ height: "0.5px", width: "80%", background: "linear-gradient(to right, #c9a87a, transparent)", marginBottom: "22px" }} />
                                <div style={{ fontSize: isMobile ? "11px" : "11px", letterSpacing: "0.32em", textTransform: "uppercase", color: "#a89880" }}>Together with their families, joyfully invite you to</div>
                            </div>
                        </RevealBlock>

                        {/* NAMES */}
                        <RevealBlock delay={0.1}>
                            <div style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                marginBottom: "6px",
                                textAlign: "center",
                            }}>
                                <div style={{
                                    flex: 1,
                                    fontFamily: "italliano",
                                    fontWeight: 300,
                                    lineHeight: 1.0,
                                    color: "#2c1f14",
                                    textAlign: "center",
                                }}>
                                    <div style={{ fontSize: isMobile ? "40px" : "52px" }}>Muhammed</div>
                                    <div style={{ fontSize: isMobile ? "40px" : "52px", fontStyle: "italic" }}>Hinan</div>
                                </div>

                                <div style={{
                                    fontFamily: "'Cormorant Garamond', serif",
                                    fontStyle: "italic",
                                    fontSize: isMobile ? "20px" : "26px",
                                    color: "#c9a87a",
                                    padding: isMobile ? "0 10px" : "0 20px",
                                }}>
                                    &
                                </div>

                                <div style={{
                                    flex: 1,
                                    fontFamily: "italliano",
                                    fontWeight: 300,
                                    lineHeight: 1.0,
                                    color: "#2c1f14",
                                    textAlign: "center",
                                }}>
                                    <div style={{ fontSize: isMobile ? "40px" : "52px" }}>Safa</div>
                                    <div style={{ fontSize: isMobile ? "40px" : "52px", fontStyle: "italic" }}>Sherin</div>
                                </div>
                            </div>
                        </RevealBlock>

                        <RevealBlock delay={0.15}>
                            <div style={{ height: "0.5px", width: "50%", background: "linear-gradient(to right, #c9a87a, transparent)", margin: "22px 0" }} />
                        </RevealBlock>

                        {/* FAMILIES */}
                        <RevealBlock delay={0.2}>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1px 1fr", gap: 0, marginBottom: "24px" }}>
                                <div style={{ textAlign: "center", padding: isMobile ? "0 10px 0 0" : "0 16px 0 0" }}>
                                    <div style={{ fontSize: isMobile ? "12px" : "13px", letterSpacing: "0.3em", textTransform: "uppercase", color: "#c9a87a", marginBottom: "10px" }}>Groom's Family</div>
                                    <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: isMobile ? "18px" : "20px", color: "#2c1f14", lineHeight: 1.9 }}>
                                        <span style={{ fontSize: isMobile ? "13px" : "14px", letterSpacing: "0.16em", color: "#a89880", textTransform: "uppercase" }}>Mr.</span> Mashood<br />
                                        <span style={{ fontSize: isMobile ? "18px" : "20px", color: "#c9a87a" }}>&</span><br />
                                        <span style={{ fontSize: isMobile ? "13px" : "14px", letterSpacing: "0.16em", color: "#a89880", textTransform: "uppercase" }}>Mrs.</span> Shabana
                                    </div>
                                </div>
                                <div style={{ background: "linear-gradient(to bottom, transparent, #ddd0bc, transparent)" }} />
                                <div style={{ textAlign: "center", padding: isMobile ? "0 0 0 10px" : "0 0 0 16px" }}>
                                    <div style={{ fontSize: isMobile ? "12px" : "13px", letterSpacing: "0.3em", textTransform: "uppercase", color: "#c9a87a", marginBottom: "10px" }}>Bride's Family</div>
                                    <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: isMobile ? "18px" : "20px", color: "#2c1f14", lineHeight: 1.9 }}>
                                        <span style={{ fontSize: isMobile ? "13px" : "14px", letterSpacing: "0.16em", color: "#a89880", textTransform: "uppercase" }}>Mr.</span> Sadik<br />
                                        <span style={{ fontSize: isMobile ? "18px" : "20px", color: "#c9a87a" }}>&</span><br />
                                        <span style={{ fontSize: isMobile ? "13px" : "14px", letterSpacing: "0.16em", color: "#a89880", textTransform: "uppercase" }}>Mrs.</span> Fousiya
                                    </div>
                                </div>
                            </div>
                        </RevealBlock>

                        {/* EVENT BOXES — stack on mobile */}
                        <RevealBlock delay={0.25}>
                            <div style={{
                                display: "flex",
                                flexDirection: isMobile ? "column" : "row",
                                gap: "14px",
                                marginBottom: "22px",
                            }}>
                                <EventBox tag="Nikkah" date="Tuesday, 19 May 2026" time="10:00 AM" venue="Huda Masjid, Chettamcoonn, Thalassery" />
                                <EventBox tag="Walima Reception" date="Wednesday, 20 May 2026" time="12:00 PM Onwards" venue="Aurea Auditorium, Thalassery" />
                            </div>
                        </RevealBlock>

                        {/* DATE GRID */}
                        <RevealBlock delay={0.3}>
                            {isMobile ? (
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1px 1fr 1px 1fr", border: "0.5px solid #e0d0be", marginBottom: "22px" }}>
                                    <div style={{ textAlign: "center", padding: "16px 4px", borderRight: "0.5px solid #e0d0be" }}>
                                        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "16px", color: "#c9a87a", lineHeight: 1.4 }}>
                                            May 2026,<br />Wednesday
                                        </div>
                                    </div>
                                    <div style={{ background: "linear-gradient(to bottom, transparent, #ddd0bc, transparent)" }} />
                                    <div style={{ textAlign: "center", padding: "10px 4px", background: "#fdfaf6", borderRight: "0.5px solid #e0d0be" }}>
                                        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "50px", color: "#c9a87a", lineHeight: 1 }}>20</div>
                                    </div>
                                    <div style={{ background: "linear-gradient(to bottom, transparent, #ddd0bc, transparent)" }} />
                                    <div style={{ textAlign: "center", padding: "20px 4px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "24px", color: "#c9a87a", lineHeight: 1 }}>12 pm</div>
                                    </div>
                                </div>
                            ) : (
                                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", border: "0.5px solid #e0d0be", marginBottom: "22px" }}>
                                    <div style={{ textAlign: "center", padding: "30px 4px 20px", borderRight: "0.5px solid #e0d0be" }}>
                                        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "20px", color: "#c9a87a", lineHeight: 1.2 }}>
                                            May 2026, Wednesday
                                        </div>
                                    </div>
                                    <div style={{ textAlign: "center", padding: "14px 4px 25px", borderRight: "0.5px solid #e0d0be", background: "#fdfaf6" }}>
                                        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "70px", color: "#c9a87a", lineHeight: 1 }}>20</div>
                                    </div>
                                    <div style={{ textAlign: "center", padding: "35px 4px 20px" }}>
                                        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "30px", color: "#c9a87a", lineHeight: 1 }}>12 pm</div>
                                    </div>
                                </div>
                            )}
                        </RevealBlock>

                        {/* COUNTDOWN */}
                        <RevealBlock delay={0.3}>
                            <div style={{ marginBottom: "22px" }}>
                                <div style={{ fontSize: "10px", letterSpacing: "0.4em", textTransform: "uppercase", color: "#a89880", textAlign: "center", marginBottom: "12px" }}>Countdown To Reception</div>
                                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", border: "0.5px solid #e0d0be" }}>
                                    {[["Days", d, false], ["Hours", h, false], ["Mins", m, false], ["Secs", s, true]].map(([label, val, isS], i) => (
                                        <div key={i} style={{ textAlign: "center", padding: isMobile ? "10px 2px 8px" : "14px 4px 10px", borderRight: i < 3 ? "0.5px solid #e0d0be" : "none", background: i % 2 === 0 ? "#ffffff" : "#fdfaf6" }}>
                                            <motion.span
                                                key={isS ? String(tick) : val}
                                                initial={isS ? { scale: 1.08 } : {}}
                                                animate={{ scale: 1 }}
                                                transition={{ duration: 0.15 }}
                                                style={{ display: "block", fontFamily: "'Cormorant Garamond', serif", fontSize: isMobile ? "28px" : "32px", fontWeight: 300, color: "#2c1f14", lineHeight: 1, marginBottom: "4px" }}>
                                                {val}
                                            </motion.span>
                                            <span style={{ fontSize: "9px", letterSpacing: "0.2em", textTransform: "uppercase", color: "#c9a87a" }}>{label}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </RevealBlock>

                        <RevealBlock delay={0.35}>
                            <RsvpSection onAttending={onAttending} onUnable={onUnable} />
                        </RevealBlock>

                    </div>
                </div>

                {/* RIGHT SIDEBAR — hidden on mobile */}
                {!isMobile && (
                    <div style={{ width: "88px", background: "#f5ede0", flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                        {[{ type: "line" }, { type: "dot" }, { type: "text", val: "Calicut" }, { type: "dot" }, { type: "line" }, { type: "dot" }, { type: "text", val: "Kerala" }, { type: "dot" }, { type: "line" }].map((el, i) => {
                            if (el.type === "line") return <div key={i} style={{ width: "0.5px", height: "56px", background: "linear-gradient(to bottom, transparent, #c9a87a, transparent)" }} />;
                            if (el.type === "dot") return <div key={i} style={{ width: "5px", height: "5px", borderRadius: "50%", background: "#c9a87a", opacity: 0.5, margin: "10px 0" }} />;
                            return <div key={i} style={{ writingMode: "vertical-rl", fontSize: "11px", letterSpacing: "0.4em", color: "#c9b090", textTransform: "uppercase", margin: "10px 0", fontFamily: "'DM Sans', sans-serif" }}>{el.val}</div>;
                        })}
                    </div>
                )}

            </motion.div>
        </motion.div>
    );
}

// ── ROOT ─────────────────────────────────────────────────────
export default function Home() {
    const [page, setPage] = useState("invitation");

    return (
        <AnimatePresence mode="wait">
            {page === "invitation" && (
                <InvitationPage key="inv"
                    onAttending={() => setPage("thankyou")}
                    onUnable={() => setPage("unable")} />
            )}
            {page === "thankyou" && (
                <ThankYouPage key="ty" onBack={() => setPage("invitation")} />
            )}
            {page === "unable" && (
                <UnablePage key="un" onBack={() => setPage("invitation")} />
            )}
        </AnimatePresence>
    );
}