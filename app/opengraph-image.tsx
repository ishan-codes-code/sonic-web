import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Sonic — Music that gets you';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#0a0a0a',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'monospace',
        }}
      >
        {/* App name */}
        <div
          style={{
            fontSize: 80,
            fontWeight: 900,
            color: '#fafaf9',
            letterSpacing: '-4px',
            marginBottom: 16,
          }}
        >
          Sonic
        </div>
        {/* Tagline */}
        <div
          style={{
            fontSize: 28,
            color: '#737373',
            letterSpacing: '-0.5px',
          }}
        >
          Music that actually gets you.
        </div>
        {/* Amber accent line */}
        <div
          style={{
            position: 'absolute',
            bottom: 48,
            fontSize: 18,
            color: '#fbbf24',
            letterSpacing: '2px',
            textTransform: 'uppercase',
          }}
        >
          by Ishan
        </div>
      </div>
    ),
    { ...size }
  );
}