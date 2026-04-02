import crypto from "crypto";
import { 
  getUserByDiscordId, createUser, updateUser, 
  saveSession, getSession, deleteSession, getUserById 
} from "./db";
import { User, Session } from "./models";
import { Request, Response, NextFunction } from "express";

// ─── Types ────────────────────────────────────────────────────────
export interface AuthenticatedRequest extends Request {
  user?: User;
  sessionToken?: string;
}

// ─── Discord OAuth2 config (from .env) ───────────────────────────
export const DISCORD_CLIENT_ID     = process.env.DISCORD_CLIENT_ID     ?? "";
export const DISCORD_CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET ?? "";
export const DISCORD_REDIRECT_URI  = process.env.DISCORD_REDIRECT_URI  ?? "";

export const DISCORD_OAUTH_URL = "https://discord.com/oauth2/authorize";
export const DISCORD_TOKEN_URL = "https://discord.com/api/oauth2/token";
export const DISCORD_API_URL   = "https://discord.com/api/v10";

// ─── Session helpers ──────────────────────────────────────────────
export async function createSession(userId: number): Promise<Session> {
  const token      = crypto.randomUUID();
  const expiresAt  = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7); // 7-day sessions

  const session: Session = { userId, token, expiresAt };
  await saveSession(token, userId, expiresAt);
  return session;
}

export async function logout(token: string): Promise<void> {
  await deleteSession(token);
}

// ─── Discord OAuth2 ───────────────────────────────────────────────

/** Step 1 — Exchange the authorisation code for a Discord access token */
export async function exchangeCode(code: string): Promise<string> {
  const body = new URLSearchParams({
    client_id:     DISCORD_CLIENT_ID,
    client_secret: DISCORD_CLIENT_SECRET,
    grant_type:    "authorization_code",
    code,
    redirect_uri:  DISCORD_REDIRECT_URI,
  });

  const res = await fetch(DISCORD_TOKEN_URL, {
    method:  "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body:    body.toString(),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Discord token exchange failed: ${err}`);
  }

  const data = (await res.json()) as { access_token: string };
  return data.access_token;
}

/** Step 2 — Fetch the Discord user profile with the access token */
export async function fetchDiscordUser(accessToken: string): Promise<{
  id: string;
  username: string;
  global_name: string | null;
  avatar: string | null;
}> {
  const res = await fetch(`${DISCORD_API_URL}/users/@me`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!res.ok) throw new Error("Failed to fetch Discord user profile");

  return res.json();
}

/** Step 3 — Find or create our local user from a Discord profile */
export async function findOrCreateUser(discordUser: {
  id: string;
  username: string;
  global_name: string | null;
  avatar: string | null;
}): Promise<User> {
  let user = await getUserByDiscordId(discordUser.id);
  const displayName = discordUser.global_name ?? discordUser.username;

  if (!user) {
    user = await createUser(discordUser.id, displayName, discordUser.avatar);
  } else {
    // Refresh display name / avatar on every login
    await updateUser(user.id, displayName, discordUser.avatar);
    user.username = displayName;
    user.avatar   = discordUser.avatar;
  }

  return user;
}

// ─── Auth middleware ──────────────────────────────────────────────
export async function checkAuthenticatedUser(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) {
  const token = req.cookies["session"];
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  const session = await getSession(token);
  if (!session) {
    return res.status(401).json({ error: "Session expired" });
  }

  const user = await getUserById(session.userId);
  if (!user) return res.status(401).json({ error: "Unauthorized" });

  req.user         = user;
  req.sessionToken = token;
  next();
}
