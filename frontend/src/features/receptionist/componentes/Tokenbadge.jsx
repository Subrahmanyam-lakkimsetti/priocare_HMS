export default function TokenBadge({ token, onClick }) {
  return (
    <button
      onClick={() => onClick && onClick(token)}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        padding: '3px 10px',
        borderRadius: 6,
        background: '#eff6ff',
        border: '1px solid #bfdbfe',
        color: '#2563eb',
        fontSize: 12,
        fontWeight: 700,
        fontFamily: 'monospace',
        cursor: 'pointer',
        transition: 'background 0.15s, box-shadow 0.15s',
        letterSpacing: '0.04em',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = '#dbeafe';
        e.currentTarget.style.boxShadow = '0 2px 8px rgba(37,99,235,0.15)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = '#eff6ff';
        e.currentTarget.style.boxShadow = 'none';
      }}
      title={`View details for token ${token}`}
    >
      🏷 {token}
    </button>
  );
}