/**
 * Resilient, zero-network, local SVG monogram avatar generator for Creda.
 * Eliminates external dependencies on ui-avatars.com to guarantee 0ms latency,
 * complete privacy (no candidate names leaked over HTTP), and 100% offline resilience.
 */

export function getMonogramDataUrl(
  name?: string | null,
  bg = "4F46E5",
  size = 128
): string {
  const clean = (name && name.trim()) || "Talent";
  const words = clean.split(/\s+/).filter(Boolean);
  
  let initials = "CR";
  if (words.length >= 2) {
    initials = (words[0][0] + words[words.length - 1][0]).toUpperCase();
  } else if (clean.length > 0) {
    initials = clean.slice(0, Math.min(2, clean.length)).toUpperCase();
  }

  const hex = bg.startsWith("#") ? bg : `#${bg}`;
  const fontSize = Math.round(size * 0.4);
  const radius = Math.round(size * 0.22);

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">
    <defs>
      <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${hex}" stop-opacity="1" />
        <stop offset="100%" stop-color="${hex}" stop-opacity="0.88" />
      </linearGradient>
    </defs>
    <rect width="${size}" height="${size}" rx="${radius}" fill="url(#grad)" />
    <rect width="${size}" height="${size}" rx="${radius}" fill="none" stroke="rgba(255,255,255,0.12)" stroke-width="1.5" />
    <text 
      x="50%" 
      y="53%" 
      text-anchor="middle" 
      dominant-baseline="central" 
      fill="#FFFFFF" 
      font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" 
      font-weight="700" 
      font-size="${fontSize}px" 
      letter-spacing="0.5px"
    >${initials}</text>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}
