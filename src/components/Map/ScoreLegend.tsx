export default function ScoreLegend() {
  return (
    <div
      className="absolute bottom-6 right-6"
      style={{
        background: 'rgba(22, 22, 24, 0.92)',
        backdropFilter: 'blur(8px)',
        border: '1px solid #2E2E33',
        borderRadius: 12,
        padding: '12px 14px',
        zIndex: 10,
      }}
    >
      <div
        className="font-sans font-bold uppercase mb-2"
        style={{
          fontSize: '9px',
          letterSpacing: '0.12em',
          color: '#4A4A50',
        }}
      >
        Liveability Score
      </div>
      <div
        style={{
          width: 120,
          height: 6,
          borderRadius: 3,
          background: 'linear-gradient(to right, #BFDBFE, #FDE68A, #F97316, #EF4444)',
        }}
      />
      <div className="flex justify-between mt-1">
        <span className="font-mono" style={{ fontSize: '9px', color: '#4A4A50' }}>
          Low
        </span>
        <span className="font-mono" style={{ fontSize: '9px', color: '#4A4A50' }}>
          High
        </span>
      </div>
    </div>
  );
}
