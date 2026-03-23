import BoroughLabel from './BoroughLabel';
import ScoreToast from './ScoreToast';
import ScoreLegend from './ScoreLegend';

interface MapOverlaysProps {
  hasActiveLayers: boolean;
  coveragePct: number;
}

export default function MapOverlays({ hasActiveLayers, coveragePct }: MapOverlaysProps) {
  return (
    <>
      <BoroughLabel />
      <ScoreToast visible={hasActiveLayers} coveragePct={coveragePct} />
      {hasActiveLayers && <ScoreLegend />}
    </>
  );
}
