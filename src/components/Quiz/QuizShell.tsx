import { useState, useCallback } from 'react';
import { QUIZ_QUESTIONS, type QuizAnswer, type QuizAnswers } from '@/data/quizQuestions';
import QuestionCard from './QuestionCard';
import RoostLogo from '@/components/RoostLogo';

interface QuizShellProps {
  onComplete: (answers: QuizAnswers) => void;
  onSkip: () => void;
}

export default function QuizShell({ onComplete, onSkip }: QuizShellProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswers>({});
  const [transitioning, setTransitioning] = useState(false);

  const question = QUIZ_QUESTIONS[currentIndex];
  const isLast = currentIndex === QUIZ_QUESTIONS.length - 1;

  const handleAnswer = useCallback(
    (value: QuizAnswer) => {
      const newAnswers = { ...answers, [question.id]: value };
      setAnswers(newAnswers);

      // Auto-advance after a brief pause
      setTransitioning(true);
      setTimeout(() => {
        if (isLast) {
          onComplete(newAnswers);
        } else {
          setCurrentIndex((i) => i + 1);
        }
        setTransitioning(false);
      }, 350);
    },
    [answers, question.id, isLast, onComplete]
  );

  const handleBack = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1);
    }
  }, [currentIndex]);

  return (
    <div className="fixed inset-0 bg-sidebar flex flex-col items-center overflow-hidden">
      {/* Header */}
      <div className="w-full max-w-lg pt-10 pb-4 px-6 flex items-center justify-between">
        {currentIndex > 0 ? (
          <button
            onClick={handleBack}
            className="text-text-secondary hover:text-text-primary transition-colors text-sm"
          >
            ← Back
          </button>
        ) : (
          <div />
        )}
        <RoostLogo size={32} className="text-accent" />
        <div className="w-12" />
      </div>

      {/* Question card with fade transition */}
      <div
        className={`flex-1 flex flex-col w-full max-w-lg transition-all duration-300 ${
          transitioning ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
        }`}
      >
        <QuestionCard
          question={question}
          answer={answers[question.id]}
          onAnswer={handleAnswer}
          questionNumber={currentIndex + 1}
          totalQuestions={QUIZ_QUESTIONS.length}
        />
      </div>

      {/* Footer */}
      <div className="pb-8 flex flex-col items-center gap-3">
        <button
          onClick={onSkip}
          className="text-text-tertiary hover:text-text-secondary transition-colors text-xs underline underline-offset-2"
        >
          Go to map
        </button>
        <span className="text-text-tertiary text-xs">
          Find where you belong in Wandsworth
        </span>
      </div>
    </div>
  );
}
