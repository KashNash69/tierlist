import { User, Session, Personne, ResultEntry } from "./models";
import path from "path";
import fs from "fs";
import sqlite3 from "sqlite3";
import { open, Database } from "sqlite";

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
let db: Database<sqlite3.Database, sqlite3.Statement>;

export const ADMIN_DISCORD_IDS = new Set<string>(
  (process.env.ADMIN_DISCORD_IDS ?? "").split(",").map(s => s.trim()).filter(Boolean)
);

export async function initDb() {
  db = await open({
    filename: path.join(__dirname, "database.sqlite"),
    driver: sqlite3.Database,
  });

  // Create Users table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      discord_id TEXT UNIQUE NOT NULL,
      username   TEXT NOT NULL,
      avatar     TEXT
    )
  `);

  // Create Sessions table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS sessions (
      token      TEXT PRIMARY KEY,
      user_id    INTEGER NOT NULL,
      expires_at DATETIME NOT NULL,
      FOREIGN KEY(user_id) REFERENCES users(id)
    )
  `);

  // Create Results table (stores the whole entry array as JSON)
  await db.exec(`
    CREATE TABLE IF NOT EXISTS results (
      id           INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id      INTEGER NOT NULL,
      discord_id   TEXT NOT NULL,
      username     TEXT NOT NULL,
      entries_json TEXT NOT NULL,
      submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(user_id) REFERENCES users(id)
    )
  `);

  const jsonPath = path.join(__dirname, "results.json");
  if (fs.existsSync(jsonPath) && fs.statSync(jsonPath).size > 2) {
    try {
      const raw = fs.readFileSync(jsonPath, "utf-8");
      const data = JSON.parse(raw);
      
      for (const res of (data.results || [])) {
        // Create user placeholder if needed (simplified since we don't have discord avatars in JSON)
        await db.run(
          "INSERT OR IGNORE INTO users (discord_id, username) VALUES (?, ?)",
          res.discordId, res.username
        );
        const user = await db.get("SELECT id FROM users WHERE discord_id = ?", res.discordId);
        
        await db.run(
          "INSERT INTO results (user_id, discord_id, username, entries_json, submitted_at) VALUES (?, ?, ?, ?, ?)",
          user.id, res.discordId, res.username, JSON.stringify(res.entries), res.submittedAt
        );
      }
      
      // Rename to avoid re-migration
      fs.renameSync(jsonPath, jsonPath + ".old");
      console.log("✅ Migrated results.json to SQLite.");
    } catch (err) {
      console.error("Failed to migrate JSON:", err);
    }
  }
}

// ─── DB Accessors ────────────────────────────────────────────────

export async function getUserByDiscordId(discordId: string): Promise<User | undefined> {
  const u = await db.get("SELECT * FROM users WHERE discord_id = ?", discordId);
  if (!u) return undefined;
  return { id: u.id, discord_id: u.discord_id, username: u.username, avatar: u.avatar };
}

export async function createUser(discordId: string, username: string, avatar: string | null): Promise<User> {
  const res = await db.run(
    "INSERT INTO users (discord_id, username, avatar) VALUES (?, ?, ?)",
    discordId, username, avatar
  );
  return { id: res.lastID!, discord_id: discordId, username, avatar };
}

export async function updateUser(id: number, username: string, avatar: string | null) {
  await db.run("UPDATE users SET username = ?, avatar = ? WHERE id = ?", username, avatar, id);
}

export async function saveSession(token: string, userId: number, expiresAt: Date) {
  await db.run(
    "INSERT INTO sessions (token, user_id, expires_at) VALUES (?, ?, ?)",
    token, userId, expiresAt.toISOString()
  );
}

export async function deleteSession(token: string) {
  await db.run("DELETE FROM sessions WHERE token = ?", token);
}

export async function getSession(token: string): Promise<Session | undefined> {
  const s = await db.get("SELECT * FROM sessions WHERE token = ?", token);
  if (!s) return undefined;
  // Check expiry
  const expiry = new Date(s.expires_at);
  if (expiry < new Date()) {
    await deleteSession(token);
    return undefined;
  }
  return { userId: s.user_id, token: s.token, expiresAt: expiry };
}

export async function getUserById(id: number): Promise<User | undefined> {
  return db.get("SELECT * FROM users WHERE id = ?", id);
}

export async function hasUserSubmitted(discordId: string): Promise<boolean> {
  const res = await db.get("SELECT id FROM results WHERE discord_id = ?", discordId);
  return !!res;
}

export async function saveResult(user: User, entries: ResultEntry[]) {
  await db.run(
    "INSERT INTO results (user_id, discord_id, username, entries_json) VALUES (?, ?, ?, ?)",
    user.id, user.discord_id, user.username, JSON.stringify(entries)
  );
}

export async function getAllResults() {
  const rows = await db.all("SELECT * FROM results");
  return rows.map(r => ({
    userId: r.user_id,
    discordId: r.discord_id,
    username: r.username,
    entries: JSON.parse(r.entries_json) as ResultEntry[],
    submittedAt: new Date(r.submitted_at)
  }));
}
