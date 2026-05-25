import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Sonic — Music that gets you';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  // Load logo from public folder
  const logoData = await fetch(new URL('/logo.png', process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000')).then(
    (res) => res.arrayBuffer()
  );

  return new ImageResponse(
    (
      <div
        style={{
          background: '#0a0a0a',
          width: '100%',
          height: '100%',
          display: 'flex',
          position: 'relative',
          overflow: 'hidden',
          fontFamily: 'serif',
        }}
      >
        {/* ── Ambient radial glow – amber, centred-left ── */}
        <div
          style={{
            position: 'absolute',
            top: -160,
            left: -80,
            width: 700,
            height: 700,
            borderRadius: '50%',
            background:
              'radial-gradient(circle, rgba(251,191,36,0.18) 0%, rgba(251,191,36,0.06) 45%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        {/* ── Secondary cool-toned glow – bottom-right balance ── */}
        <div
          style={{
            position: 'absolute',
            bottom: -200,
            right: -100,
            width: 600,
            height: 600,
            borderRadius: '50%',
            background:
              'radial-gradient(circle, rgba(120,80,255,0.10) 0%, transparent 65%)',
            pointerEvents: 'none',
          }}
        />

        {/* ── Subtle horizontal scan-line grid ── */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'repeating-linear-gradient(0deg, transparent, transparent 39px, rgba(255,255,255,0.025) 40px)',
            pointerEvents: 'none',
          }}
        />

        {/* ── Waveform bars – right side decorative ── */}
        <div
          style={{
            position: 'absolute',
            right: 72,
            top: '50%',
            display: 'flex',
            alignItems: 'center',
            gap: 7,
            transform: 'translateY(-50%)',
          }}
        >
          {[44, 88, 130, 72, 108, 56, 96, 140, 64, 100, 48, 84].map(
            (h, i) => (
              <div
                key={i}
                style={{
                  width: 6,
                  height: h,
                  borderRadius: 4,
                  background:
                    i % 3 === 0
                      ? 'rgba(251,191,36,0.55)'
                      : 'rgba(255,255,255,0.10)',
                }}
              />
            )
          )}
        </div>

        {/* ── Main content block ── */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: '0 96px',
            flex: 1,
          }}
        >
          {/* Logo + wordmark row */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 20,
              marginBottom: 36,
            }}
          >
            {/* Logo image */}
            <img
              // @ts-ignore – ArrayBuffer accepted by next/og
              src={logoData}
              width={56}
              height={56}
              style={{ borderRadius: 14, objectFit: 'cover' }}
            />
            {/* Amber pill badge */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 7,
                padding: '6px 14px',
                borderRadius: 100,
                border: '1px solid rgba(251,191,36,0.35)',
                background: 'rgba(251,191,36,0.08)',
              }}
            >
              <div
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  background: '#fbbf24',
                }}
              />
              <span
                style={{
                  fontSize: 13,
                  color: '#fbbf24',
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                  fontFamily: 'monospace',
                  fontWeight: 600,
                }}
              >
                Now in Beta
              </span>
            </div>
          </div>

          {/* App name */}
          <div
            style={{
              fontSize: 120,
              fontWeight: 900,
              color: '#fafaf9',
              letterSpacing: '-6px',
              lineHeight: 0.9,
              marginBottom: 28,
              fontFamily: 'serif',
            }}
          >
            Sonic
          </div>

          {/* Divider */}
          <div
            style={{
              width: 56,
              height: 2,
              background: 'linear-gradient(90deg, #fbbf24, transparent)',
              marginBottom: 28,
              borderRadius: 2,
            }}
          />

          {/* Tagline */}
          <div
            style={{
              fontSize: 26,
              color: '#a3a3a3',
              letterSpacing: '-0.2px',
              lineHeight: 1.4,
              maxWidth: 520,
              fontFamily: 'monospace',
            }}
          >
            Music that actually{' '}
            <span style={{ color: '#fafaf9', fontStyle: 'italic' }}>
              gets you.
            </span>
          </div>

          {/* Developer credit */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              marginTop: 44,
            }}
          >
            {/* Avatar ring */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 32,
                height: 32,
                borderRadius: '50%',
                border: '1px solid rgba(251,191,36,0.4)',
                background: 'rgba(251,191,36,0.08)',
                fontSize: 14,
                color: '#fbbf24',
                fontFamily: 'monospace',
                fontWeight: 700,
              }}
            >
              I
            </div>
            <span
              style={{
                fontSize: 14,
                color: '#525252',
                fontFamily: 'monospace',
                letterSpacing: '0.5px',
              }}
            >
              built by{' '}
              <span
                style={{
                  color: '#a3a3a3',
                  fontWeight: 600,
                }}
              >
                Ishan
              </span>
            </span>
          </div>
        </div>

        {/* ── Bottom edge strip ── */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 2,
            background:
              'linear-gradient(90deg, transparent 0%, #fbbf24 40%, rgba(251,191,36,0.3) 70%, transparent 100%)',
          }}
        />
      </div>
    ),
    { ...size }
  );
}