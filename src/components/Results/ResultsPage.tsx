import type { NeighbourhoodResult } from '@/hooks/useQuizResults';
import PolaroidCard from './PolaroidCard';
import RoostLogo from '@/components/RoostLogo';

interface ResultsPageProps {
  results: NeighbourhoodResult[];
  onExplore: () => void;
  onRetake: () => void;
}

export default function ResultsPage({ results, onExplore, onRetake }: ResultsPageProps) {
  if (results.length === 0) {
    return (
      <div className="fixed inset-0 bg-sidebar flex flex-col items-center justify-center">
        <p className="text-text-primary text-xl mb-4">No matching areas found</p>
        <p className="text-text-secondary text-sm mb-8">
          Try being more flexible with your answers
        </p>
        <button
          onClick={onRetake}
          className="bg-accent text-cta-text font-bold px-8 py-3 rounded-xl hover:opacity-90 transition-opacity"
        >
          Retake Quiz
        </button>
      </div>
    );
  }

  const hero = results[0];
  const runners = results.slice(1);

  return (
    <div className="fixed inset-0 bg-sidebar flex flex-col items-center overflow-y-auto">
      {/* Header */}
      <div className="w-full max-w-2xl pt-10 pb-2 px-6 text-center">
        <div className="mb-6 flex justify-center">
          <RoostLogo size={48} className="text-accent" />
        </div>
        <h1 className="text-text-primary text-3xl font-bold mb-2">
          Your perfect neighbourhood
        </h1>
        <p className="text-text-secondary text-sm">
          Based on what matters to you, here's where you belong in Wandsworth
        </p>
      </div>

      {/* Hero result */}
      <div className="mt-10 mb-8 flex justify-center px-4">
        <PolaroidCard result={hero} rank={1} />
      </div>

      {/* Runner-ups */}
      {runners.length > 0 && (
        <>
          <p className="text-text-tertiary text-xs uppercase tracking-widest mb-5">
            Also great for you
          </p>
          <div className="flex gap-6 px-4 mb-10 flex-wrap justify-center">
            {runners.map((r, i) => (
              <PolaroidCard key={r.name} result={r} rank={i + 2} />
            ))}
          </div>
        </>
      )}

      {/* Actions */}
      <div className="flex flex-col items-center gap-3 pb-12 mt-4">
        <button
          onClick={onExplore}
          className="bg-accent text-cta-text font-bold px-10 py-3.5 rounded-xl hover:opacity-90 transition-opacity text-sm"
        >
          Explore the map →
        </button>
        <button
          onClick={onRetake}
          className="text-text-secondary hover:text-text-primary text-sm transition-colors"
        >
          Retake quiz
        </button>
      </div>
    </div>
  );
}
