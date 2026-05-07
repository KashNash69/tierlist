import { User, Session, Personne, ResultEntry } from "./models";
import path from "path";
import fs from "fs";
import Database from "better-sqlite3";

// ─── Professors List (Static) ────────────────────────────────────
const imagesBasePath = path.join(__dirname, "..", "Prof_subtitles");
export const people: Personne[] = [
  { name: "Agnès Arnould",            image: { id: "agnes_arnould",      image_local_path: path.join(imagesBasePath, "Agnes_Arnould.png") } },
  { name: "Alex Defayes",             image: { id: "alex_defayes",       image_local_path: path.join(imagesBasePath, "Alex Defayes.png") } },
  { name: "Ali Hariri",               image: { id: "ali_hariri",         image_local_path: path.join(imagesBasePath, "Ali Hariri.png") } },
  { name: "Alicia Morris",            image: { id: "alicia_morris",      image_local_path: path.join(imagesBasePath, "Alicia Morris.png") } },
  { name: "Antoine",                  image: { id: "antoine",            image_local_path: path.join(imagesBasePath, "Antoine.jpg") } },
  { name: "Benoit Loisel",            image: { id: "benoit_loisel",      image_local_path: path.join(imagesBasePath, "Benoit Loisel.png") } },
  { name: "Boris Pasquier",           image: { id: "boris_pasquier",     image_local_path: path.join(imagesBasePath, "Boris Pasquier.png") } },
  { name: "Botman (Saidi Boumediene)",image: { id: "botman_saidi",       image_local_path: path.join(imagesBasePath, "Botman (saidi boumediene).png") } },
  { name: "Charles Lepaire",          image: { id: "charles_lepaire",    image_local_path: path.join(imagesBasePath, "Charles Lepaire.png") } },
  { name: "David Helbert",            image: { id: "david_helbert",      image_local_path: path.join(imagesBasePath, "David_Helbert.png") } },
  { name: "Emmanuelle Darles",        image: { id: "emmanuelle_darles",  image_local_path: path.join(imagesBasePath, "Emmanuelle_Darles.png") } },
  { name: "Eric Andres",              image: { id: "eric_andres",        image_local_path: path.join(imagesBasePath, "Eric_Andres.png") } },
  { name: "Frédéric Bosio",           image: { id: "frederic_bosio",     image_local_path: path.join(imagesBasePath, "Frederic_Bosio.png") } },
  { name: "Gaëlle Largeteau Skapin", image: { id: "gaelle_largeteau",   image_local_path: path.join(imagesBasePath, "Gaelle Largeteau Skapin.png") } },
  { name: "Gilles Subrenat",          image: { id: "gilles_subrenat",    image_local_path: path.join(imagesBasePath, "Gilles_Subrenat.png") } },
  { name: "Hakim",                    image: { id: "hakim",              image_local_path: path.join(imagesBasePath, "Hakim.png") } },
  { name: "Lancelot Pecquet",         image: { id: "lancelot_pecquet",   image_local_path: path.join(imagesBasePath, "Lancelot_Pecquet.png") } },
  { name: "Laurent Fuchs",            image: { id: "laurent_fuchs",      image_local_path: path.join(imagesBasePath, "Laurent_Fuchs.png") } },
  { name: "Lilian Aveneau",           image: { id: "lilian_aveneau",     image_local_path: path.join(imagesBasePath, "Lilian_Aveneau.png") } },
  { name: "Marcus VanLeuwen",         image: { id: "marcus_vanleuwen",   image_local_path: path.join(imagesBasePath, "Marcus VanLeuwen.png") } },
  { name: "Nicolas James",            image: { id: "nicolas_james",      image_local_path: path.join(imagesBasePath, "Nicolas James.png") } },
  { name: "Nicolas Courrilleau",      image: { id: "nicolas_courrilleau",image_local_path: path.join(imagesBasePath, "Nicolas_Courrilleau.png") } },
  { name: "Noël Richard",             image: { id: "noel_richard",       image_local_path: path.join(imagesBasePath, "Noel_Richard.png") } },
  { name: "Pascal Lienhardt",         image: { id: "pascal_lienhardt",   image_local_path: path.join(imagesBasePath, "Pascal_Lienhardt.png") } },
  { name: "Philippe Meseure",         image: { id: "philippe_meseure",   image_local_path: path.join(imagesBasePath, "Philippe_Meseure.png") } },
  { name: "Pol Vanhaecke",            image: { id: "pol_vanhaecke",      image_local_path: path.join(imagesBasePath, "Pol_Vanhaecke.png") } },
  { name: "Rita Zrour",               image: { id: "rita_zrour",         image_local_path: path.join(imagesBasePath, "Rita_Zrour.png") } },
  { name: "Samuel Peltier",           image: { id: "samuel_peltier",     image_local_path: path.join(imagesBasePath, "Samuel_Peltier.png") } },
  { name: "Stéphane Jean",            image: { id: "stephane_jean",      image_local_path: path.join(imagesBasePath, "Stephane_Jean.png") } },
  { name: "Sylvie Allayrangue",       image: { id: "sylvie_allayrangue", image_local_path: path.join(imagesBasePath, "Sylvie_Allayrangue.png") } },
  { name: "Sylvie Girard",            image: { id: "sylvie_girard",      image_local_path: path.join(imagesBasePath, "Sylvie_Girard.png") } },
  { name: "Xavier Skapin",            image: { id: "xavier_skapin",      image_local_path: path.join(imagesBasePath, "Xavier_Skapin.png") } },
  { name: "Yanis Pousset",            image: { id: "yanis_pousset",      image_local_path: path.join(imagesBasePath, "Yanis_Pousset.png") } },
  { name: "Yannick Degardin",         image: { id: "yannick_degardin",   image_local_path: path.join(imagesBasePath, "Yannick_Degardin.png") } },
  { name: "Yves Bertrand",            image: { id: "yves_bertrand",      image_local_path: path.join(imagesBasePath, "Yves_Bertrand.png") } },
  { name: "Larbi Belchicha",          image: { id: "larbi_belchicha",    image_local_path: path.join(imagesBasePath, "larbi Belchicha.png") } },
];

// ─── DB Initialization ───────────────────────────────────────────
let db: Database.Database;

export const ADMIN_DISCORD_IDS = new Set<string>(
  (process.env.ADMIN_DISCORD_IDS ?? "").split(",").map(s => s.trim()).filter(Boolean)
);

export function initDb() {
  const dbPath = process.env.DB_PATH || path.join(__dirname, "database.sqlite");
  db = new Database(dbPath);
  db.pragma("journal_mode = WAL");

  // Create Users table
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      discord_id TEXT UNIQUE NOT NULL,
      username   TEXT NOT NULL,
      avatar     TEXT
    )
  `);

  // Create Sessions table
  db.exec(`
    CREATE TABLE IF NOT EXISTS sessions (
      token      TEXT PRIMARY KEY,
      user_id    INTEGER NOT NULL,
      expires_at TEXT NOT NULL,
      FOREIGN KEY(user_id) REFERENCES users(id)
    )
  `);

  // Create Results table (stores the whole entry array as JSON)
  db.exec(`
    CREATE TABLE IF NOT EXISTS results (
      id           INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id      INTEGER NOT NULL,
      discord_id   TEXT NOT NULL,
      username     TEXT NOT NULL,
      entries_json TEXT NOT NULL,
      submitted_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(user_id) REFERENCES users(id)
    )
  `);

  const jsonPath = path.join(__dirname, "results.json");
  if (fs.existsSync(jsonPath) && fs.statSync(jsonPath).size > 2) {
    try {
      const raw = fs.readFileSync(jsonPath, "utf-8");
      const data = JSON.parse(raw);
      
      const insertUser = db.prepare("INSERT OR IGNORE INTO users (discord_id, username) VALUES (?, ?)");
      const getUser = db.prepare("SELECT id FROM users WHERE discord_id = ?");
      const insertResult = db.prepare(
        "INSERT INTO results (user_id, discord_id, username, entries_json, submitted_at) VALUES (?, ?, ?, ?, ?)"
      );

      const insertMany = db.transaction((results: any[]) => {
        for (const res of results) {
          insertUser.run(res.discordId, res.username);
          const user = getUser.get(res.discordId) as { id: number };
          insertResult.run(user.id, res.discordId, res.username, JSON.stringify(res.entries), res.submittedAt);
        }
      });

      insertMany(data.results || []);
      
      // Rename to avoid re-migration
      fs.renameSync(jsonPath, jsonPath + ".old");
      console.log("✅ Migrated results.json to SQLite.");
    } catch (err) {
      console.error("Failed to migrate JSON:", err);
    }
  }
}

// ─── DB Accessors ────────────────────────────────────────────────

export function getUserByDiscordId(discordId: string): User | undefined {
  const u = db.prepare("SELECT * FROM users WHERE discord_id = ?").get(discordId) as { id: number; discord_id: string; username: string; avatar: string | null } | undefined;
  if (!u) return undefined;
  return { id: u.id, discord_id: u.discord_id, username: u.username, avatar: u.avatar };
}

export function createUser(discordId: string, username: string, avatar: string | null): User {
  const res = db.prepare(
    "INSERT INTO users (discord_id, username, avatar) VALUES (?, ?, ?)"
  ).run(discordId, username, avatar);
  return { id: res.lastInsertRowid as number, discord_id: discordId, username, avatar };
}

export function updateUser(id: number, username: string, avatar: string | null) {
  db.prepare("UPDATE users SET username = ?, avatar = ? WHERE id = ?").run(username, avatar, id);
}

export function saveSession(token: string, userId: number, expiresAt: Date) {
  db.prepare(
    "INSERT INTO sessions (token, user_id, expires_at) VALUES (?, ?, ?)"
  ).run(token, userId, expiresAt.toISOString());
}

export function deleteSession(token: string) {
  db.prepare("DELETE FROM sessions WHERE token = ?").run(token);
}

export function getSession(token: string): Session | undefined {
  const s = db.prepare("SELECT * FROM sessions WHERE token = ?").get(token) as { user_id: number; token: string; expires_at: string } | undefined;
  if (!s) return undefined;
  // Check expiry
  const expiry = new Date(s.expires_at);
  if (expiry < new Date()) {
    deleteSession(token);
    return undefined;
  }
  return { userId: s.user_id, token: s.token, expiresAt: expiry };
}

export function getUserById(id: number): User | undefined {
  return db.prepare("SELECT * FROM users WHERE id = ?").get(id) as User | undefined;
}

export function hasUserSubmitted(discordId: string): boolean {
  const res = db.prepare("SELECT id FROM results WHERE discord_id = ?").get(discordId);
  return !!res;
}

export function saveResult(user: User, entries: ResultEntry[]) {
  db.prepare(
    "INSERT INTO results (user_id, discord_id, username, entries_json) VALUES (?, ?, ?, ?)"
  ).run(user.id, user.discord_id, user.username, JSON.stringify(entries));
}

export function getAllResults() {
  const rows = db.prepare("SELECT * FROM results").all() as { user_id: number; discord_id: string; username: string; entries_json: string; submitted_at: string }[];
  return rows.map(r => ({
    userId: r.user_id,
    discordId: r.discord_id,
    username: r.username,
    entries: JSON.parse(r.entries_json) as ResultEntry[],
    submittedAt: new Date(r.submitted_at)
  }));
}
