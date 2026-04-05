import { sectors } from '@/data/content'

export default function SectorMarquee() {
  // Duplicate for seamless loop
  const items = [...sectors, ...sectors]

  return (
    <div
      style={{
        background:   'var(--dark)',
        padding:      '22px 0',
        overflow:     'hidden',
        position:     'relative',
        borderTop:    '1px solid rgba(255,255,255,0.04)',
        borderBottom: '1px solid rgba(255,255,255,0.04)',
      }}
    >
      {/* Fade masks on edges */}
      <div style={{
        position:   'absolute', left: 0, top: 0, bottom: 0, width: 120,
        background: 'linear-gradient(to right, var(--dark), transparent)',
        zIndex:     2, pointerEvents: 'none',
      }} />
      <div style={{
        position:   'absolute', right: 0, top: 0, bottom: 0, width: 120,
        background: 'linear-gradient(to left, var(--dark), transparent)',
        zIndex:     2, pointerEvents: 'none',
      }} />

      <div
        className="marquee-track"
        style={{ display: 'flex', alignItems: 'center', width: 'max-content' }}
      >
        {items.map((s, i) => (
          <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
            <span
              style={{
                fontSize:      13,
                fontWeight:    300,
                color:         'rgba(255,255,255,0.45)',
                whiteSpace:    'nowrap',
                padding:       '0 28px',
                letterSpacing: '0.2px',
              }}
            >
              {s}
            </span>
            {/* Separator dot */}
            <span
              style={{
                width:      4,
                height:     4,
                borderRadius: '50%',
                background: 'rgba(232,99,42,0.45)',
                flexShrink:  0,
              }}
            />
          </span>
        ))}
      </div>
    </div>
  )
}
