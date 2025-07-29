import dotenv from "dotenv";
dotenv.config();
export const GOOGLE_CLIENT_ID = process.env.CLIENT_ID!;
export const GOOGLE_CLIENT_SECRET = process.env.CLIENT_SECRET!;
export const GOOGLE_REDIRECT_URI = process.env.REDIRECT_URI || "http://localhost:5173";

export const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";
export const GOOGLE_USERINFO_URL = "https://www.googleapis.com/oauth2/v3/userinfo";

export type GoogleTokenResponse = {
  access_token: string;
  expires_in: number;
  refresh_token?: string;
  scope: string;
  token_type: string;
  id_token?: string;
};