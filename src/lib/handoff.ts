// Passes text from one tool to another for a single page visit, via sessionStorage.
const KEY = 'app-hub-handoff';

export function sendText(to: string, text: string) {
  try { sessionStorage.setItem(KEY, JSON.stringify({ to, text })); } catch { /* Works without storage. */ }
}

/** Returns text sent to this tool, once. */
export function receiveText(code: string): string | undefined {
  try {
    const raw = sessionStorage.getItem(KEY);
    if (!raw) return undefined;
    const value = JSON.parse(raw);
    if (value?.to !== code || typeof value.text !== 'string') return undefined;
    sessionStorage.removeItem(KEY);
    return value.text;
  } catch {
    return undefined;
  }
}
