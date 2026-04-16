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
     
      {children}
    </div>
  )
}
