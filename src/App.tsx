import { useRef, useState, useCallback } from 'react';
import { HeatmapProvider, useHeatmap } from '@/context/HeatmapContext';
import Sidebar from '@/components/Sidebar/Sidebar';
import MapContainer, { type MapHandle } from '@/components/Map/MapContainer';
import { useMapLayers } from '@/hooks/useMapLayers';
import { useScoring } from '@/hooks/useScoring';
import { useBoundary } from '@/hooks/useBoundary';
import { useQuizResults, quizAnswersToLayers } from '@/hooks/useQuizResults';
import MapOverlays from '@/components/Map/MapOverlays';
import QuizShell from '@/components/Quiz/QuizShell';
import ResultsPage from '@/components/Results/ResultsPage';
import MenuButton from '@/components/MenuButton';
import MethodologyPage from '@/components/MethodologyPage';
import type { QuizAnswers } from '@/data/quizQuestions';
import type { LayerState } from '@/types';

type Screen = 'quiz' | 'results' | 'explore' | 'methodology';

function ExploreView({ menuButton }: { menuButton?: React.ReactNode }) {
  const mapRef = useRef<MapHandle>(null);
  const { state } = useHeatmap();
  const { boundary } = useBoundary();

  const { geojson, hexCount } = useScoring({
    layers: state.layers,
    boundary,
  });

  useMapLayers(mapRef, geojson);

  const activeLayers = state.layers.filter((l: LayerState) => l.enabled);

  // Calculate coverage: hexes above threshold / total hexes
  let coveragePct = 0;
  if (hexCount > 0 && geojson && geojson.features.length > 0) {
    const thresholdVal = state.threshold / 100;
    const aboveThreshold = geojson.features.filter(
      (f: GeoJSON.Feature) => (f.properties?.score ?? 0) >= thresholdVal
    ).length;
    coveragePct = Math.round((aboveThreshold / hexCount) * 100);
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      <Sidebar coveragePct={coveragePct} menuButton={menuButton} />
      <div className="flex-1 relative" style={{ minWidth: 0 }}>
        <MapContainer ref={mapRef} boundary={boundary} />
        <MapOverlays
          hasActiveLayers={activeLayers.length > 0}
          coveragePct={coveragePct}
        />
      </div>
    </div>
  );
}

function AppContent() {
  const [screen, setScreen] = useState<Screen>('quiz');
  const [prevScreen, setPrevScreen] = useState<Screen>('quiz');
  const [quizAnswers, setQuizAnswers] = useState<QuizAnswers | null>(null);
  const { boundary } = useBoundary();
  const { dispatch } = useHeatmap();

  const results = useQuizResults(quizAnswers, boundary);

  const handleQuizComplete = useCallback((answers: QuizAnswers) => {
    setQuizAnswers(answers);
    setScreen('results');
  }, []);

  const handleExplore = useCallback(() => {
    if (quizAnswers) {
      dispatch({ type: 'SET_LAYERS', layers: quizAnswersToLayers(quizAnswers) });
    }
    setScreen('explore');
  }, [quizAnswers, dispatch]);

  const handleRetake = useCallback(() => {
    setQuizAnswers(null);
    setScreen('quiz');
  }, []);

  const goToMethodology = useCallback(() => {
    setPrevScreen(screen);
    setScreen('methodology');
  }, [screen]);

  const leaveMethodology = useCallback(() => {
    setScreen(prevScreen === 'methodology' ? 'explore' : prevScreen);
  }, [prevScreen]);

  if (screen === 'methodology') {
    return <MethodologyPage onBack={leaveMethodology} />;
  }

  if (screen === 'quiz') {
    return (
      <>
        <MenuButton onMethodology={goToMethodology} />
        <QuizShell onComplete={handleQuizComplete} onSkip={() => setScreen('explore')} />
      </>
    );
  }

  if (screen === 'results') {
    return (
      <>
        <MenuButton onMethodology={goToMethodology} />
        <ResultsPage
          results={results}
          onExplore={handleExplore}
          onRetake={handleRetake}
        />
      </>
    );
  }

  return (
    <ExploreView
      menuButton={<MenuButton onMethodology={goToMethodology} inline />}
    />
  );
}

export default function App() {
  return (
    <HeatmapProvider>
      <AppContent />
    </HeatmapProvider>
  );
}
