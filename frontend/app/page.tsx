"use client";

import { useState, useEffect, useRef } from "react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

// ─── Types ───────────────────────────────────────────────────────
interface Personne {
  name: string;
  image: { id: string };
}

interface PlacedProf {
  personne: Personne;
  CoolValue: number;    // -50 (désagréable) → +50 (cool)
  QualityValue: number; // -50 (mauvais)     → +50 (bon prof)
}

interface Me {
  id: number;
  discord_id: string;
  username: string;
  avatar: string | null;
  isAdmin: boolean;
}

interface ProfStat {
  id: string;
  name: string;
  avgQuality: number;
  avgCool: number;
  count: number;
}

// ─── Constants ───────────────────────────────────────────────────
const CHART_SIZE = 600;
const IMG_SIZE   = 52;

// ─── Helpers ─────────────────────────────────────────────────────
function pxToVal(px: number, total: number): number {
  return parseFloat(((px / total) * 100 - 50).toFixed(1));
}
function valToPx(val: number, total: number): number {
  return ((val + 50) / 100) * total;
}

// ─── Spinner ─────────────────────────────────────────────────────
function Spinner({ size = 18 }: { size?: number }) {
  return (
    <div style={{
      width:          size,
      height:         size,
      border:         `2px solid rgba(255,255,255,0.2)`,
      borderTopColor: "white",
      borderRadius:   "50%",
      animation:      "spin 0.7s linear infinite",
      display:        "inline-block",
      flexShrink:     0,
    }} />
  );
}

// ─── Discord Icon ─────────────────────────────────────────────────
function DiscordIcon({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size * 0.75} viewBox="0 0 22 16" fill="none">
      <path
        d="M18.59 1.34A18.18 18.18 0 0 0 14.18 0c-.19.33-.4.77-.55 1.12a16.77
           16.77 0 0 0-5.26 0A11.8 11.8 0 0 0 7.82 0a18.2 18.2 0 0 0-4.4
           1.34A19.27 19.27 0 0 0 .16 13.4a18.3 18.3 0 0 0 5.63
           2.86c.46-.62.86-1.28 1.21-1.98a11.9 11.9 0 0 1-1.9-.91c.16-.12.32-.24.46-.37a13
           13 0 0 0 11.3 0c.15.13.3.25.47.37a11.9 11.9 0 0
           1-1.9.92c.35.7.75 1.36 1.2 1.97a18.25 18.25 0 0 0
           5.64-2.86A19.23 19.23 0 0 0 18.59 1.34ZM7.35
           10.97c-1.14 0-2.08-1.05-2.08-2.34 0-1.28.91-2.34 2.08-2.34
           1.17 0 2.1 1.06 2.07 2.34 0 1.29-.91 2.34-2.07 2.34Zm7.3
           0c-1.14 0-2.07-1.05-2.07-2.34 0-1.28.91-2.34 2.07-2.34 1.17
           0 2.1 1.06 2.07 2.34 0 1.29-.9 2.34-2.07 2.34Z"
        fill="currentColor"
      />
    </svg>
  );
}

// ─── Login Screen ─────────────────────────────────────────────────
function LoginScreen({ errorParam }: { errorParam: string | null }) {
  const errorMessages: Record<string, string> = {
    discord_denied: "Tu as refusé l'accès Discord. Réessaie pour continuer.",
    oauth_failed:   "Une erreur est survenue lors de la connexion Discord. Réessaie.",
  };

  return (
    <div style={{
      minHeight:      "100vh",
      display:        "flex",
      alignItems:     "center",
      justifyContent: "center",
      background:     "var(--bg-primary)",
      position:       "relative",
      overflow:       "hidden",
    }}>
      {/* Ambient glows */}
      <div style={{
        position:     "absolute",
        top:          "15%",
        left:         "50%",
        transform:    "translateX(-50%)",
        width:        700,
        height:       700,
        borderRadius: "50%",
        background:   "radial-gradient(circle, rgba(88,101,242,0.13) 0%, transparent 65%)",
        pointerEvents:"none",
      }} />
      <div style={{
        position:     "absolute",
        bottom:       "5%",
        right:        "10%",
        width:        400,
        height:       400,
        borderRadius: "50%",
        background:   "radial-gradient(circle, rgba(124,58,237,0.1) 0%, transparent 65%)",
        pointerEvents:"none",
      }} />

      <div className="animate-slideUp" style={{
        width:    "100%",
        maxWidth: 420,
        padding:  "0 24px",
        position: "relative",
        zIndex:   1,
      }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{
            display:        "inline-flex",
            alignItems:     "center",
            justifyContent: "center",
            width:          72,
            height:         72,
            borderRadius:   20,
            background:     "linear-gradient(135deg, #5865f2, #7c3aed)",
            marginBottom:   20,
            boxShadow:      "0 8px 32px rgba(88,101,242,0.45)",
          }}>
            <DiscordIcon size={32} />
          </div>
          <h1 style={{
            fontSize:      28,
            fontWeight:    800,
            color:         "var(--text-primary)",
            letterSpacing: "-0.5px",
            marginBottom:  8,
          }}>
            Prof Alignment Chart
          </h1>
          <p style={{ fontSize: 15, color: "var(--text-secondary)", fontWeight: 400 }}>
            Connecte-toi pour noter tes profs
          </p>
        </div>

        {/* Card */}
        <div style={{
          background:   "var(--bg-card)",
          borderRadius: "var(--radius-xl)",
          border:       "1px solid var(--border)",
          padding:      36,
          boxShadow:    "var(--shadow-lg)",
          textAlign:    "center",
        }}>
          {errorParam && (
            <div style={{
              padding:      "10px 14px",
              borderRadius: 8,
              background:   "rgba(239,68,68,0.1)",
              border:       "1px solid rgba(239,68,68,0.3)",
              color:        "#f87171",
              fontSize:     14,
              marginBottom: 24,
              textAlign:    "left",
            }}>
              {errorMessages[errorParam] ?? "Une erreur inconnue s'est produite."}
            </div>
          )}

          <p style={{
            fontSize:     14,
            color:        "var(--text-secondary)",
            lineHeight:   1.6,
            marginBottom: 28,
          }}>
            Une connexion Discord est requise pour participer.
            <br />Aucun mot de passe, c&apos;est rapide et sécurisé.
          </p>

          <a
            href={`${API}/auth/discord`}
            id="discord-login-btn"
            style={{
              display:        "flex",
              alignItems:     "center",
              justifyContent: "center",
              gap:            12,
              padding:        "14px 24px",
              borderRadius:   12,
              background:     "#5865f2",
              color:          "white",
              fontSize:       16,
              fontWeight:     700,
              textDecoration: "none",
              fontFamily:     "inherit",
              boxShadow:      "0 4px 24px rgba(88,101,242,0.4)",
              transition:     "transform 0.15s ease, box-shadow 0.15s ease, background 0.15s ease",
              letterSpacing:  "0.2px",
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLAnchorElement).style.background   = "#4752c4";
              (e.currentTarget as HTMLAnchorElement).style.transform    = "translateY(-2px)";
              (e.currentTarget as HTMLAnchorElement).style.boxShadow    = "0 8px 32px rgba(88,101,242,0.5)";
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLAnchorElement).style.background   = "#5865f2";
              (e.currentTarget as HTMLAnchorElement).style.transform    = "translateY(0)";
              (e.currentTarget as HTMLAnchorElement).style.boxShadow    = "0 4px 24px rgba(88,101,242,0.4)";
            }}
          >
            <DiscordIcon size={22} />
            Connexion avec Discord
          </a>

          <p style={{
            marginTop:  18,
            fontSize:   12,
            color:      "var(--text-muted)",
            lineHeight: 1.5,
          }}>
            Seule la permission <code style={{ color: "var(--text-secondary)" }}>identify</code> est demandée.
            <br />Nous n&apos;accédons pas à tes messages ni tes serveurs.
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Prof Token ───────────────────────────────────────────────────
function ProfToken({
  personne,
  size = IMG_SIZE,
  style: extraStyle = {},
  isReadOnly = false,
}: {
  personne: Personne;
  size?: number;
  style?: React.CSSProperties;
  isReadOnly?: boolean;
}) {
  const initials = personne.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div
      title={personne.name}
      style={{
        width:       size,
        height:      size,
        borderRadius:"50%",
        overflow:    "hidden",
        border:      "2px solid rgba(255,255,255,0.25)",
        background:  "var(--bg-card)",
        flexShrink:  0,
        position:    "relative",
        boxShadow:   "0 4px 12px rgba(0,0,0,0.5)",
        cursor:      isReadOnly ? "default" : "grab",
        userSelect:  "none",
        ...extraStyle,
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`${API}/image/${personne.image.id}`}
        alt={personne.name}
        draggable={false}
        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
      />
      {/* Fallback initials */}
      <div style={{
        position:       "absolute",
        inset:          0,
        display:        "flex",
        alignItems:     "center",
        justifyContent: "center",
        fontSize:       size * 0.3,
        fontWeight:     700,
        color:          "var(--text-secondary)",
        pointerEvents:  "none",
      }}>
        {initials}
      </div>
    </div>
  );
}

// ─── Bench ────────────────────────────────────────────────────────
function Bench({
  profs,
  onDragStart,
}: {
  profs: Personne[];
  onDragStart: (p: Personne) => void;
}) {
  return (
    <div style={{
      background:   "var(--bg-card)",
      borderRadius: "var(--radius-lg)",
      border:       "1px solid var(--border)",
      padding:      16,
      height:       "100%",
    }}>
      <div style={{
        fontSize:        12,
        fontWeight:      700,
        color:           "var(--text-muted)",
        textTransform:   "uppercase",
        letterSpacing:   1,
        marginBottom:    12,
        display:         "flex",
        alignItems:      "center",
        gap:             8,
      }}>
        <span>Banc</span>
        <span style={{
          background: "var(--bg-secondary)",
          color:      "var(--text-secondary)",
          borderRadius: 5,
          padding:    "2px 7px",
          fontSize:   11,
        }}>
          {profs.length}
        </span>
      </div>

      <div style={{
        display:    "flex",
        flexWrap:   "wrap",
        gap:        8,
        maxHeight:  "calc(100vh - 200px)",
        overflowY:  "auto",
      }}>
        {profs.length === 0 && (
          <p style={{ color: "var(--text-muted)", fontSize: 13, fontStyle: "italic" }}>
            Tous placés !
          </p>
        )}
        {profs.map((p) => (
          <div
            key={p.image.id}
            draggable
            onDragStart={(e) => {
              e.dataTransfer.setData("profId",  p.image.id);
              e.dataTransfer.setData("source",  "bench");
              onDragStart(p);
            }}
            style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, cursor: "grab" }}
          >
            <ProfToken personne={p} size={44} />
            <span style={{
              fontSize:     9,
              color:        "var(--text-secondary)",
              maxWidth:     52,
              textAlign:    "center",
              lineHeight:   1.3,
              overflow:     "hidden",
              textOverflow: "ellipsis",
              whiteSpace:   "nowrap",
            }}>
              {p.name.split(" ")[0]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Alignment Chart ──────────────────────────────────────────────
function AlignmentChart({
  placed,
  onDrop,
  onDragStart,
  onRemove,
  isReadOnly = false,
}: {
  placed:      PlacedProf[];
  onDrop?:      (profId: string, source: string, x: number, y: number) => void;
  onDragStart?: (p: Personne, source: "chart") => void;
  onRemove?:    (profId: string) => void;
  isReadOnly?: boolean;
}) {
  const chartRef = useRef<HTMLDivElement>(null);
  const [tooltip,   setTooltip]   = useState<{ name: string; px: number; py: number; count?: number } | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [dragOver,  setDragOver]  = useState(false);

  function getChartCoords(clientX: number, clientY: number) {
    if (isReadOnly) return { x: 0, y: 0 };
    const rect = chartRef.current!.getBoundingClientRect();
    const pxX  = Math.max(0, Math.min(clientX - rect.left,  rect.width));
    const pxY  = Math.max(0, Math.min(clientY - rect.top,   rect.height));
    return {
      x: pxToVal(pxX,                rect.width),
      y: pxToVal(rect.height - pxY,  rect.height), // invert Y axis
    };
  }

  function handleDrop(e: React.DragEvent) {
    if (isReadOnly) return;
    e.preventDefault();
    setDragOver(false);
    const profId = e.dataTransfer.getData("profId");
    const source = e.dataTransfer.getData("source");
    const { x, y } = getChartCoords(e.clientX, e.clientY);
    onDrop?.(profId, source, x, y);
  }

  const gridTicks = [-40, -30, -20, -10, 10, 20, 30, 40];

  return (
    <div style={{ position: "relative" }}>
      {/* Y-axis: Qualité Prof (rotated) */}
      <div style={{
        position:      "absolute",
        left:          -72,
        top:           "50%",
        transform:     "translateY(-50%) rotate(-90deg)",
        fontSize:      11,
        fontWeight:    700,
        color:         "var(--text-muted)",
        textTransform: "uppercase",
        letterSpacing: 1.5,
        whiteSpace:    "nowrap",
      }}>Qualité Prof</div>

      <div style={{ position: "absolute", left: -52, top: 0,    fontSize: 10, color: "var(--accent-green)", fontWeight: 700 }}>Bon</div>
      <div style={{ position: "absolute", left: -64, bottom: 0, fontSize: 10, color: "#ef4444",             fontWeight: 700 }}>Mauvais</div>

      {/* X-axis labels */}
      <div style={{ position: "absolute", bottom: -26, left: 0,                      fontSize: 10, color: "#ef4444",             fontWeight: 700 }}>Désagréable</div>
      <div style={{ position: "absolute", bottom: -26, right: 0,                     fontSize: 10, color: "var(--accent-green)", fontWeight: 700 }}>Cool</div>
      <div style={{ position: "absolute", bottom: -26, left: "50%", transform: "translateX(-50%)", fontSize: 11, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: 1.5 }}>
        Attitude
      </div>

      {/* Chart box */}
      <div
        ref={chartRef}
        onDragOver={(e)  => { if (!isReadOnly) { e.preventDefault(); setDragOver(true); } }}
        onDragLeave={()  => setDragOver(false)}
        onDrop={handleDrop}
        style={{
          width:       CHART_SIZE,
          height:      CHART_SIZE,
          maxWidth:    "100%",
          aspectRatio: "1",
          position:    "relative",
          background:  isReadOnly ? "rgba(0,0,0,0.4)" : "var(--chart-bg)",
          borderRadius:"var(--radius-lg)",
          border:      `1px solid ${dragOver ? "rgba(88,101,242,0.6)" : "var(--border)"}`,
          overflow:    "hidden",
          transition:  "border-color 0.2s, box-shadow 0.2s",
          boxShadow:   dragOver ? "0 0 0 2px rgba(88,101,242,0.25), var(--shadow-lg)" : "var(--shadow-lg)",
        }}
      >
        {/* Quadrant tints */}
        {[
          { l: 0,     t: 0,     w: "50%", h: "50%", bg: "rgba(239,68,68,0.04)"  },
          { l: "50%", t: 0,     w: "50%", h: "50%", bg: "rgba(245,158,11,0.04)" },
          { l: 0,     t: "50%", w: "50%", h: "50%", bg: "rgba(99,102,241,0.04)" },
          { l: "50%", t: "50%", w: "50%", h: "50%", bg: "rgba(34,197,94,0.04)"  },
        ].map((q, i) => (
          <div key={i} style={{ position: "absolute", left: q.l, top: q.t, width: q.w, height: q.h, background: q.bg }} />
        ))}

        {/* Grid */}
        {gridTicks.map((v) => {
          const pctV = ((v + 50) / 100) * 100;
          const pctH = 100 - pctV;
          return (
            <div key={`grid-${v}`}>
              <div key={`v${v}`} style={{ position: "absolute", left: `${pctV}%`, top: 0, bottom: 0, width: 1, background: "var(--chart-grid)" }} />
              <div key={`h${v}`} style={{ position: "absolute", top: `${pctH}%`, left: 0, right: 0, height: 1, background: "var(--chart-grid)" }} />
            </div>
          );
        })}

        {/* Main axes */}
        <div style={{ position: "absolute", top: 0, bottom: 0, left: "50%", width: 1, background: "rgba(255,255,255,0.18)", transform: "translateX(-50%)" }} />
        <div style={{ position: "absolute", left: 0, right: 0, top: "50%", height: 1, background: "rgba(255,255,255,0.18)", transform: "translateY(-50%)" }} />

        {/* Origin dot */}
        <div style={{ position: "absolute", left: "50%", top: "50%", width: 6, height: 6, borderRadius: "50%", background: "rgba(255,255,255,0.35)", transform: "translate(-50%,-50%)" }} />

        {/* Empty hint */}
        {!isReadOnly && placed.length === 0 && (
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
            <div style={{ textAlign: "center", color: "var(--text-muted)", fontSize: 13 }}>
              <div style={{ fontSize: 40, marginBottom: 10, opacity: 0.4 }}>🎯</div>
              <p>Glisse les profs ici depuis le banc</p>
            </div>
          </div>
        )}

        {/* Placed professors */}
        {placed.map((pp) => {
          const pxX = valToPx(pp.CoolValue,    CHART_SIZE);
          const pxY = CHART_SIZE - valToPx(pp.QualityValue, CHART_SIZE);
          const isHovered = hoveredId === pp.personne.image.id;

          return (
            <div
              key={pp.personne.image.id}
              draggable={!isReadOnly}
              onDragStart={(e) => {
                if (isReadOnly) return;
                e.dataTransfer.setData("profId", pp.personne.image.id);
                e.dataTransfer.setData("source", "chart");
                onDragStart?.(pp.personne, "chart");
              }}
              onMouseEnter={() => { 
                setHoveredId(pp.personne.image.id); 
                setTooltip({ name: pp.personne.name, px: pxX, py: pxY, count: (pp as any).count }); 
              }}
              onMouseLeave={() => { setHoveredId(null); setTooltip(null); }}
              onDoubleClick={() => !isReadOnly && onRemove?.(pp.personne.image.id)}
              style={{
                position:  "absolute",
                left:      pxX,
                top:       pxY,
                transform: "translate(-50%, -50%)",
                zIndex:    isHovered ? 10 : 1,
                cursor:    isReadOnly ? "default" : "grab",
              }}
            >
              <ProfToken
                personne={pp.personne}
                size={isReadOnly ? 32 : IMG_SIZE}
                isReadOnly={isReadOnly}
                style={{
                  border:     isHovered ? "2px solid rgba(88,101,242,0.9)" : "2px solid rgba(255,255,255,0.2)",
                  transform:  isHovered ? "scale(1.2)" : "scale(1)",
                  transition: "transform 0.15s ease, border-color 0.15s ease",
                  opacity:    isReadOnly ? 0.9 : 1
                }}
              />
            </div>
          );
        })}

        {/* Hover tooltip */}
        {tooltip && (
          <div style={{
            position:     "absolute",
            left:         tooltip.px,
            top:          tooltip.py - (isReadOnly ? 20 : IMG_SIZE / 2) - 36,
            transform:    "translateX(-50%)",
            background:   "rgba(0,0,0,0.88)",
            color:        "white",
            padding:      "5px 10px",
            borderRadius: 6,
            fontSize:     12,
            fontWeight:   600,
            whiteSpace:   "nowrap",
            pointerEvents:"none",
            zIndex:       20,
            border:       "1px solid var(--border)",
            backdropFilter: "blur(4px)",
          }}>
            {tooltip.name} {tooltip.count ? `(${tooltip.count} votes)` : ""}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Chart Page ───────────────────────────────────────────────────
function ChartPage({ me, onLogout }: { me: Me; onLogout: () => void }) {
  const [allProfs,  setAllProfs]  = useState<Personne[]>([]);
  const [placed,    setPlaced]    = useState<PlacedProf[]>([]);
  const [stats,     setStats]     = useState<ProfStat[]>([]);
  const [viewMode,  setViewMode]  = useState<"personal" | "global">("personal");
  const [loading,   setLoading]   = useState(true);
  const [submitting,setSubmitting]= useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error,     setError]     = useState("");

  useEffect(() => {
    Promise.all([
      fetch(`${API}/new`, { credentials: "include" }).then(r => r.json()),
      fetch(`${API}/stats`, { credentials: "include" }).then(r => r.json())
    ]).then(([profsData, statsData]) => {
      setAllProfs(profsData);
      setStats(statsData);
      setLoading(false);
    }).catch(() => {
      setError("Impossible de charger les données.");
      setLoading(false);
    });
  }, []);

  const benchProfs = allProfs.filter(
    (p) => !placed.find((pp) => pp.personne.image.id === p.image.id),
  );

  const globalPlaced: PlacedProf[] = stats.map(s => ({
    personne: { name: s.name, image: { id: s.id } },
    CoolValue: s.avgCool,
    QualityValue: s.avgQuality,
    count: s.count
  } as any));

  function handleDrop(profId: string, _source: string, x: number, y: number) {
    const personne = allProfs.find((p) => p.image.id === profId);
    if (!personne) return;
    setPlaced((prev) => [
      ...prev.filter((pp) => pp.personne.image.id !== profId),
      { personne, CoolValue: x, QualityValue: y },
    ]);
  }

  function handleRemove(profId: string) {
    setPlaced((prev) => prev.filter((pp) => pp.personne.image.id !== profId));
  }

  async function handleSubmit() {
    if (placed.length === 0) { setError("Place au moins un prof sur le chart !"); return; }
    setError("");
    setSubmitting(true);
    try {
      const r = await fetch(`${API}/send`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          results: placed.map((pp) => ({
            personne:     pp.personne,
            QualityValue: pp.QualityValue,
            CoolValue:    pp.CoolValue,
          })),
        }),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error || "Erreur lors de l'envoi");
      setSubmitted(true);
      // Refresh stats after submit
      fetch(`${API}/stats`).then(r => r.json()).then(setStats);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleLogout() {
    await fetch(`${API}/auth/logout`, { method: "POST", credentials: "include" });
    onLogout();
  }

  if (submitted && viewMode === "personal") {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg-primary)" }}>
        <div className="animate-slideUp" style={{
          textAlign: "center", padding: 48,
          background: "var(--bg-card)", borderRadius: "var(--radius-xl)",
          border: "1px solid var(--border)", maxWidth: 480, width: "90%",
        }}>
          <div style={{ fontSize: 64, marginBottom: 20 }}>✅</div>
          <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 12, color: "var(--accent-green)" }}>
            Réponses envoyées !
          </h2>
          <p style={{ color: "var(--text-secondary)", fontSize: 16, lineHeight: 1.6, marginBottom: 32 }}>
            Tu as placé <strong style={{ color: "var(--text-primary)" }}>{placed.length} profs</strong>.
            Merci, <strong style={{ color: "var(--text-primary)" }}>{me.username}</strong> !
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
            <button
              onClick={() => setViewMode("global")}
              style={{ padding: "12px 24px", borderRadius: 10, border: "none", background: "var(--accent-blue)", color: "white", fontSize: 14, fontWeight: 700, cursor: "pointer" }}
            >
              Voir le Graph Global
            </button>
            <button
              onClick={handleLogout}
              style={{ padding: "12px 24px", borderRadius: 10, border: "1px solid var(--border)", background: "transparent", color: "var(--text-secondary)", fontSize: 14, fontWeight: 600, cursor: "pointer" }}
            >
              Déconnexion
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <header style={{
        padding: "0 24px", height: 60,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: "var(--bg-secondary)", borderBottom: "1px solid var(--border)",
        position: "sticky", top: 0, zIndex: 100,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: "linear-gradient(135deg,#5865f2,#7c3aed)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <DiscordIcon size={18} />
          </div>
          <span style={{ fontWeight: 800, fontSize: 16, color: "var(--text-primary)" }}>
            Prof Alignment Chart
          </span>
        </div>

        {/* Desktop View Switcher */}
        <div style={{ display: "flex", background: "rgba(0,0,0,0.2)", borderRadius: 10, padding: 3 }}>
          <button 
            onClick={() => setViewMode("personal")}
            style={{ 
              padding: "6px 16px", borderRadius: 8, border: "none", 
              background: viewMode === "personal" ? "var(--bg-card)" : "transparent",
              color: viewMode === "personal" ? "var(--text-primary)" : "var(--text-secondary)",
              fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "all 0.2s"
            }}
          >
            Ton Chart
          </button>
          <button 
            onClick={() => setViewMode("global")}
            style={{ 
              padding: "6px 16px", borderRadius: 8, border: "none", 
              background: viewMode === "global" ? "var(--bg-card)" : "transparent",
              color: viewMode === "global" ? "var(--text-primary)" : "var(--text-secondary)",
              fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "all 0.2s"
            }}
          >
            Moyenne Globale
          </button>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          {/* Discord avatar */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {me.avatar ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img src={me.avatar} alt={me.username} style={{ width: 28, height: 28, borderRadius: "50%", border: "2px solid var(--border)" }} />
            ) : (
              <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#5865f2", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "white" }}>
                {me.username[0].toUpperCase()}
              </div>
            )}
            <span style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)" }}>{me.username}</span>
          </div>

          <button
            onClick={handleLogout}
            style={{ padding: "7px 14px", borderRadius: 8, border: "1px solid var(--border)", background: "transparent", color: "var(--text-secondary)", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s" }}
            onMouseEnter={(e) => { (e.target as HTMLElement).style.borderColor = "var(--border-hover)"; (e.target as HTMLElement).style.color = "var(--text-primary)"; }}
            onMouseLeave={(e) => { (e.target as HTMLElement).style.borderColor = "var(--border)";       (e.target as HTMLElement).style.color = "var(--text-secondary)"; }}
          >
            Déconnexion
          </button>
        </div>
      </header>

      {/* Body */}
      <main style={{ flex: 1, display: "flex", gap: 24, padding: 24, maxWidth: 1280, margin: "0 auto", width: "100%" }}>
        {/* Bench - only show in personal mode */}
        {viewMode === "personal" && (
          <aside style={{ width: 190, flexShrink: 0 }}>
            {loading
              ? <div style={{ background: "var(--bg-card)", borderRadius: "var(--radius-lg)", border: "1px solid var(--border)", padding: 24, display: "flex", alignItems: "center", justifyContent: "center", gap: 10, color: "var(--text-secondary)", fontSize: 14 }}>
                  <Spinner /> Chargement…
                </div>
              : <Bench profs={benchProfs} onDragStart={() => {}} />
            }
          </aside>
        )}

        {/* Chart + controls */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Instruction banner */}
          <div style={{ background: "var(--bg-card)", borderRadius: "var(--radius)", border: "1px solid var(--border)", padding: "12px 20px" }}>
            {viewMode === "personal" ? (
              <span style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6 }}>
                🖱️ <strong style={{ color: "var(--text-primary)" }}>Glisse</strong> les profs depuis le banc.
                &nbsp;<strong style={{ color: "var(--text-primary)" }}>Repositionne</strong>-les en les redraggant sur le chart.
                &nbsp;<strong style={{ color: "var(--text-primary)" }}>Double-clique</strong> pour remettre sur le banc.
              </span>
            ) : (
              <span style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6 }}>
                📊 Voici la <strong style={{ color: "var(--text-primary)" }}>moyenne collective</strong> de tous les participants. 
                Passe ta souris sur un prof pour voir le nombre de votes.
              </span>
            )}
          </div>

          {/* Chart */}
          <div style={{ display: "flex", justifyContent: "center", flex: 1 }}>
            <div style={{ padding: "16px 80px 48px 80px", position: "relative" }}>
              <AlignmentChart
                placed={viewMode === "personal" ? placed : globalPlaced}
                onDrop={handleDrop}
                onDragStart={() => {}}
                onRemove={handleRemove}
                isReadOnly={viewMode === "global"}
              />
            </div>
          </div>

          {/* Error */}
          {error && (
            <div style={{ padding: "12px 16px", borderRadius: 8, background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", color: "#f87171", fontSize: 14 }}>
              {error}
            </div>
          )}

          {/* Submit - only in personal mode */}
          {viewMode === "personal" && !submitted && (
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button
                id="submit-chart-btn"
                onClick={handleSubmit}
                disabled={submitting || placed.length === 0}
                style={{
                  padding:      "13px 32px",
                  borderRadius: 12,
                  border:       "none",
                  background:   placed.length === 0 ? "var(--bg-card)" : "linear-gradient(135deg, var(--accent-blue), var(--accent-purple))",
                  color:        placed.length === 0 ? "var(--text-muted)" : "white",
                  fontSize:     15,
                  fontWeight:   700,
                  fontFamily:   "inherit",
                  cursor:       placed.length === 0 || submitting ? "not-allowed" : "pointer",
                  display:      "flex",
                  alignItems:   "center",
                  gap:          10,
                  transition:   "all 0.2s",
                  boxShadow:    placed.length > 0 ? "0 4px 20px rgba(88,101,242,0.3)" : "none",
                }}
                onMouseEnter={(e) => { if (placed.length > 0 && !submitting) (e.target as HTMLElement).style.transform = "translateY(-2px)"; }}
                onMouseLeave={(e) => { (e.target as HTMLElement).style.transform = "translateY(0)"; }}
              >
                {submitting && <Spinner />}
                {submitting ? "Envoi en cours…" : `Soumettre (${placed.length} prof${placed.length !== 1 ? "s" : ""})`}
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

// ─── App Root ─────────────────────────────────────────────────────
export default function Home() {
  const [authChecked, setAuthChecked] = useState(false);
  const [me,          setMe]          = useState<Me | null>(null);
  const [errorParam,  setErrorParam]  = useState<string | null>(null);

  useEffect(() => {
    // Read ?error= from URL
    const params = new URLSearchParams(window.location.search);
    const err = params.get("error");
    if (err) {
      setErrorParam(err);
      window.history.replaceState({}, "", window.location.pathname);
    }

    // Check session
    fetch(`${API}/auth/me`, { credentials: "include" })
      .then((r) => (r.ok ? r.json() : null))
      .then((data: Me | null) => { setMe(data); setAuthChecked(true); })
      .catch(() => setAuthChecked(true));
  }, []);

  if (!authChecked) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg-primary)", gap: 12, color: "var(--text-secondary)", fontSize: 15 }}>
        <Spinner /> Chargement…
      </div>
    );
  }

  if (!me) {
    return <LoginScreen errorParam={errorParam} />;
  }

  return <ChartPage me={me} onLogout={() => setMe(null)} />;
}
