// Starred and recently used tools. Only tool codes (like "qr") are stored, in this browser.
const FAVORITES_KEY = 'app-hub-favorites';
const RECENTS_KEY = 'app-hub-recents';
const MAX_RECENTS = 4;

function read(key: string): string[] {
  try {
    const value = JSON.parse(localStorage.getItem(key) ?? '[]');
    return Array.isArray(value) ? value.filter((item) => typeof item === 'string') : [];
  } catch {
    return [];
  }
}

function write(key: string, value: string[]) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* Works without storage. */ }
}

class Prefs {
  favorites = $state<string[]>([]);
  recents = $state<string[]>([]);
  /** False during prerender and before the browser has read storage. */
  loaded = $state(false);

  load() {
    this.favorites = read(FAVORITES_KEY);
    this.recents = read(RECENTS_KEY);
    this.loaded = true;
  }

  isFavorite(code: string) {
    return this.favorites.includes(code);
  }

  toggleFavorite(code: string) {
    this.favorites = this.isFavorite(code) ? this.favorites.filter((c) => c !== code) : [...this.favorites, code];
    write(FAVORITES_KEY, this.favorites);
  }

  visit(code: string) {
    this.recents = [code, ...this.recents.filter((c) => c !== code)].slice(0, MAX_RECENTS);
    write(RECENTS_KEY, this.recents);
  }

  clearRecents() {
    this.recents = [];
    write(RECENTS_KEY, []);
  }
}

export const prefs = new Prefs();

/** Shared open state for the search palette, so the navbar and keyboard shortcut can both open it. */
export const palette = $state({ open: false });
