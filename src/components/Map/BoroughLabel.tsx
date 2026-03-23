export default function BoroughLabel() {
  return (
    <div
      className="absolute top-5 left-6 flex items-center gap-2.5"
      style={{
        background: 'rgba(22, 22, 24, 0.85)',
        backdropFilter: 'blur(8px)',
        border: '1px solid #2E2E33',
        borderRadius: 10,
        padding: '8px 14px',
        zIndex: 10,
      }}
    >
      <span
        className="rounded-full"
        style={{
          width: 8,
          height: 8,
          background: '#D4F53C',
          boxShadow: '0 0 8px rgba(212, 245, 60, 0.4)',
        }}
      />
      <div>
        <div
          className="font-sans"
          style={{ fontWeight: 600, fontSize: '12px', color: '#F2F0EB' }}
        >
          Wandsworth Borough
        </div>
        <div
          className="font-sans"
          style={{ fontWeight: 400, fontSize: '10px', color: '#4A4A50' }}
        >
          LB Wandsworth
        </div>
      </div>
    </div>
  );
}
