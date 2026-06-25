export const TOKEN_KEY = "worklife_token";

// Max-age for the auth cookie — 7 days in seconds
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7;

export const auth = {
  getToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(TOKEN_KEY);
  },

  setToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
    // Mirror to a cookie so Next.js middleware can read it (localStorage is
    // not accessible in the Edge runtime).
    document.cookie = `${TOKEN_KEY}=${token}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`;
  },

  removeToken(): void {
    localStorage.removeItem(TOKEN_KEY);
    document.cookie = `${TOKEN_KEY}=; path=/; max-age=0; SameSite=Lax`;
  },

  isAuthenticated(): boolean {
    return !!this.getToken();
  },
};
