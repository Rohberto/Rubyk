interface SectionLabelProps {
  children: string
  light?: boolean
}

export default function SectionLabel({ children, light = false }: SectionLabelProps) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        fontSize: 11,
        fontWeight: 500,
        textTransform: 'uppercase',
        letterSpacing: '2px',
        color: light ? 'var(--orange-light)' : 'var(--orange)',
        marginBottom: 16,
      }}
    >
      <span
        style={{
          display: 'block',
          width: 24,
          height: 1.5,
          background: light ? 'var(--orange-light)' : 'var(--orange)',
          flexShrink: 0,
        }}
      />
      {children}
    </div>
  )
}
