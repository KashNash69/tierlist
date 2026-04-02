export interface User {
  id: number;
  discord_id: string;
  username: string;
  avatar: string | null;
}

export interface Image {
  id: string;
  image_local_path: string;
}

export interface Personne {
  name: string;
  image: Image;
}

export interface ResultEntry {
  personne: Personne;
  QualityValue: number;
  CoolValue: number;
}

export interface Result {
  entries: ResultEntry[];
}

export interface Session {
  userId: number;
  token: string;
  expiresAt: Date;
}
