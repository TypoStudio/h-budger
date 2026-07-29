export default function Logo({ size = 26 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-label="가계부 로고" role="img">
      <rect x="8" y="6" width="48" height="52" rx="8" fill="var(--accent)" />
      <rect x="8" y="6" width="11" height="52" rx="8" fill="#ffffff" opacity="0.22" />
      <path d="M42 6 h9 v17 l-4.5 -5 -4.5 5 z" fill="#fbbf24" />
      <text
        x="35"
        y="45"
        textAnchor="middle"
        fontSize="30"
        fontWeight="700"
        fill="#ffffff"
        fontFamily="system-ui, sans-serif"
      >
        ₩
      </text>
    </svg>
  )
}
