import type { QuizQuestion, QuizAnswer } from '@/data/quizQuestions';

interface QuestionCardProps {
  question: QuizQuestion;
  answer?: QuizAnswer;
  onAnswer: (value: QuizAnswer) => void;
  questionNumber: number;
  totalQuestions: number;
}

const IMPORTANCE_LABELS = [
  { value: 1 as const, label: 'Nice to have' },
  { value: 2 as const, label: 'Somewhat important' },
  { value: 3 as const, label: 'Important' },
  { value: 4 as const, label: 'Very important' },
  { value: 5 as const, label: 'Essential' },
];

export default function QuestionCard({
  question,
  answer,
  onAnswer,
  questionNumber,
  totalQuestions,
}: QuestionCardProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-0 flex-1 px-6">
      {/* Progress */}
      <div className="text-text-secondary text-sm mb-2 font-medium">
        {questionNumber} of {totalQuestions}
      </div>

      {/* Progress bar */}
      <div className="w-full max-w-md h-1 bg-border rounded-full mb-10 overflow-hidden">
        <div
          className="h-full bg-accent rounded-full transition-all duration-500 ease-out"
          style={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
        />
      </div>

      {/* Emoji */}
      <div className="text-7xl mb-6 select-none">{question.emoji}</div>

      {/* Question */}
      <h2 className="text-text-primary text-2xl font-bold text-center mb-2 max-w-md">
        {question.title}
      </h2>
      <p className="text-text-secondary text-sm text-center mb-10 max-w-sm">
        {question.subtitle}
      </p>

      {/* Importance buttons */}
      <div className="flex flex-col gap-2.5 w-full max-w-sm">
        {IMPORTANCE_LABELS.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => onAnswer(value)}
            className={`
              w-full py-3.5 px-5 rounded-xl text-sm font-medium
              transition-all duration-200 text-left
              flex items-center justify-between
              ${
                answer === value
                  ? 'bg-accent text-cta-text ring-2 ring-accent'
                  : 'bg-card text-text-primary hover:bg-card-hover border border-border'
              }
            `}
          >
            <span>{label}</span>
            <span className="text-xs opacity-60">{value}/5</span>
          </button>
        ))}

        {/* Skip button */}
        <button
          onClick={() => onAnswer(0)}
          className={`
            w-full py-3 px-5 rounded-xl text-sm font-medium
            transition-all duration-200 text-center mt-1
            ${
              answer === 0
                ? 'text-accent bg-accent-dim'
                : 'text-text-tertiary hover:text-text-secondary'
            }
          `}
        >
          Not interested
        </button>
      </div>
    </div>
  );
}
