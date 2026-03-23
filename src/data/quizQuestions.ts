export interface QuizQuestion {
  id: string;
  emoji: string;
  title: string;
  subtitle: string;
  /** Maps to one or more category IDs from categories.ts */
  categoryIds: string[];
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'pastry',
    emoji: '🥐',
    title: 'Fresh pastries within walking distance?',
    subtitle: 'Gail\'s Bakery on your doorstep',
    categoryIds: ['gails'],
  },
  {
    id: 'gym',
    emoji: '💪',
    title: 'A serious gym nearby?',
    subtitle: 'Third Space, PureGym, Virgin Active…',
    categoryIds: ['gyms'],
  },
  {
    id: 'grocery',
    emoji: '🛒',
    title: 'Premium grocery on your street?',
    subtitle: 'Waitrose, M&S, Sainsbury\'s, and more',
    categoryIds: ['mands', 'waitrose', 'sainsburys'],
  },
  {
    id: 'commute',
    emoji: '🚂',
    title: 'Easy train commute?',
    subtitle: 'National Rail & Underground stations',
    categoryIds: ['stations'],
  },
  {
    id: 'green',
    emoji: '🌳',
    title: 'Green space for walks?',
    subtitle: 'Parks, commons & open spaces',
    categoryIds: ['parks'],
  },
  {
    id: 'coffee',
    emoji: '☕',
    title: 'A great independent coffee shop?',
    subtitle: 'Proper flat whites, not chains',
    categoryIds: ['coffee'],
  },
  {
    id: 'pub',
    emoji: '🍺',
    title: 'A good pub for Sunday lunch?',
    subtitle: 'Quality gastropubs within reach',
    categoryIds: ['gastropubs'],
  },
  {
    id: 'allround',
    emoji: '✨',
    title: 'A bit of everything?',
    subtitle: 'Walkable neighbourhood with variety',
    categoryIds: ['gails', 'mands', 'waitrose', 'sainsburys', 'coffee', 'gastropubs'],
  },
];

/** Answer: 0 = skipped/not interested, 1-5 = importance */
export type QuizAnswer = 0 | 1 | 2 | 3 | 4 | 5;

export type QuizAnswers = Record<string, QuizAnswer>;
