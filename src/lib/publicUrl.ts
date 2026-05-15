/**
 * Prefix paths to files in `public/` with Vite `base` so assets resolve when the app is
 * served from a subpath (e.g. GitHub Pages `https://user.github.io/repo/`).
 * External `http(s)://` URLs are returned unchanged.
 */
export function publicUrl(path: string | undefined | null): string | undefined {
  if (path == null) return undefined;
  const p = path.trim();
  if (p === "") return undefined;
  if (/^https?:\/\//i.test(p)) return p;
  const base = import.meta.env.BASE_URL;
  const tail = p.startsWith("/") ? p.slice(1) : p;
  return `${base}${tail}`;
}
