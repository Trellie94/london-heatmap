interface ScoreToastProps {
  visible: boolean;
  coveragePct: number;
}

export default function ScoreToast({ visible, coveragePct }: ScoreToastProps) {
  if (!visible) return null;

  return (
    <div
      className="absolute top-5 right-6 text-right transition-all duration-300"
      style={{
        background: 'rgba(22, 22, 24, 0.92)',
        backdropFilter: 'blur(8px)',
        border: '1px solid rgba(212, 245, 60, 0.2)',
        borderRadius: 12,
        padding: '10px 16px',
        zIndex: 10,
        animation: 'fadeSlideIn 0.3s ease-out',
      }}
    >
      <div
        className="font-mono"
        style={{ fontSize: '22px', fontWeight: 500, color: '#D4F53C' }}
      >
        {coveragePct}%
      </div>
      <div
        className="font-sans"
        style={{ fontSize: '10px', fontWeight: 400, color: '#4A4A50' }}
      >
        areas above threshold
      </div>
    </div>
  );
}
