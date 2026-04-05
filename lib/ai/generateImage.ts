function escapeXml(unsafe: string) {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export async function generateImage(platform: string, prompt?: string) {
  const sizes: Record<string, { w: number; h: number; label: string }> = {
    x: { w: 1200, h: 630, label: 'X Post' },
    facebook: { w: 1200, h: 630, label: 'Facebook Post' },
    instagram: { w: 1080, h: 1080, label: 'Instagram Post' },
    linkedin: { w: 1200, h: 627, label: 'LinkedIn Post' },
  };

  const selected = sizes[platform] || sizes.x;
  const title = escapeXml((prompt || 'Teos AI Engine').slice(0, 90));
  const svg = `
  <svg xmlns="http://www.w3.org/2000/svg" width="${selected.w}" height="${selected.h}" viewBox="0 0 ${selected.w} ${selected.h}">
    <defs>
      <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
        <stop offset="0%" stop-color="#0a0a0f" />
        <stop offset="100%" stop-color="#4f46e5" />
      </linearGradient>
    </defs>
    <rect width="100%" height="100%" fill="url(#g)" />
    <text x="60" y="120" fill="#c7d2fe" font-size="42" font-family="Arial, Helvetica, sans-serif">Teos AI Engine</text>
    <text x="60" y="180" fill="#ffffff" font-size="64" font-weight="700" font-family="Arial, Helvetica, sans-serif">${selected.label}</text>
    <foreignObject x="60" y="240" width="${selected.w - 120}" height="${selected.h - 340}">
      <div xmlns="http://www.w3.org/1999/xhtml" style="color:white;font-family:Arial,Helvetica,sans-serif;font-size:42px;line-height:1.25;display:flex;align-items:center;height:100%;">${title}</div>
    </foreignObject>
    <text x="60" y="${selected.h - 40}" fill="#e5e7eb" font-size="26" font-family="Arial, Helvetica, sans-serif">Built with Love from Egypt · Elmahrosa</text>
  </svg>`;

  return { url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}` };
}
