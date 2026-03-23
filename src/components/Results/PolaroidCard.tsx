import type { NeighbourhoodResult } from '@/hooks/useQuizResults';
import type { Category } from '@/types';
import { CATEGORIES } from '@/data/categories';
import MiniMap from './MiniMap';

interface PolaroidCardProps {
  result: NeighbourhoodResult;
  rank: number;
}

const ROTATIONS = [-2.5, 0, 2.5];

export default function PolaroidCard({ result, rank }: PolaroidCardProps) {
  const rotation = ROTATIONS[rank - 1] ?? 0;
  const isHero = rank === 1;

  return (
    <div
      className={`
        bg-white rounded-sm shadow-2xl
        transition-all duration-500 hover:scale-105 hover:rotate-0
        ${isHero ? 'p-3 pb-5' : 'p-2.5 pb-4'}
      `}
      style={{
        transform: `rotate(${rotation}deg)`,
        maxWidth: isHero ? 340 : 280,
        width: '100%',
      }}
    >
      {/* Map snapshot */}
      <div className="relative overflow-hidden rounded-sm bg-gray-900">
        <MiniMap
          lat={result.lat}
          lng={result.lng}
          className={`w-full ${isHero ? 'h-52' : 'h-40'}`}
        />
        {/* Score badge */}
        <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm rounded-lg px-3 py-1.5 z-10">
          <span className="text-white font-bold text-lg">{result.score}</span>
          <span className="text-white/60 text-xs">/100</span>
        </div>
        {/* Rank badge */}
        {rank === 1 && (
          <div className="absolute top-3 left-3 bg-accent text-cta-text rounded-lg px-2.5 py-1 text-xs font-bold z-10">
            #1 Match
          </div>
        )}
      </div>

      {/* Info below the image — Polaroid style */}
      <div className="mt-3 px-1">
        <h3
          className={`text-gray-900 font-bold ${
            isHero ? 'text-xl' : 'text-lg'
          }`}
        >
          {result.name}
        </h3>

        {/* Amenity dots */}
        <div className="flex gap-1.5 mt-2 flex-wrap">
          {result.topAmenities.map((catId: string) => {
            const cat = CATEGORIES.find((c: Category) => c.id === catId);
            if (!cat) return null;
            return (
              <span
                key={catId}
                className="inline-flex items-center gap-1 text-xs text-gray-500 bg-gray-100 rounded-full px-2 py-0.5"
              >
                <span
                  className="w-2 h-2 rounded-full inline-block"
                  style={{ backgroundColor: cat.color }}
                />
                {cat.label}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}
