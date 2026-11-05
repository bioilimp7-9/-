export type GradeLevel = '7' | '8' | '9' | 'all';

export type SubjectCategory =
  | 'cytology'
  | 'botany'
  | 'zoology'
  | 'anatomy'
  | 'genetics'
  | 'methodology';

export interface TheoryTopic {
  id: string;
  category: SubjectCategory;
  categoryNameKz: string;
  grades: ('7' | '8' | '9')[];
  title: string;
  titleEn: string;
  subtitle: string;
  summary: string;
  campbellReference: string;
  keyConcepts: {
    term: string;
    latinOrEn?: string;
    definition: string;
    importance: string;
  }[];
  detailedSections: {
    heading: string;
    paragraphs: string[];
    callout?: {
      title: string;
      text: string;
      type: 'tip' | 'warning' | 'formula' | 'olympiad-pitfall';
    };
    table?: {
      headers: string[];
      rows: string[][];
    };
  }[];
  olympiadNotes: string[];
}

export interface DiagramPoint {
  id: string;
  nameKz: string;
  nameLatEn: string;
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  functionKz: string;
  olympiadSignificance: string;
  structure: string;
}

export interface InteractiveDiagram {
  id: string;
  title: string;
  category: SubjectCategory;
  grade: string;
  imageSrc: string;
  description: string;
  points: DiagramPoint[];
  comparisonPoints?: {
    feature: string;
    systemA: string;
    systemB: string;
  }[];
}

export type QuestionType = 'single' | 'multiple' | 'matching' | 'sequence' | 'problem';

export interface BaseQuestion {
  id: string;
  grade: '7' | '8' | '9';
  category: SubjectCategory;
  type: QuestionType;
  difficulty: 'Аудандық' | 'Облыстық' | 'Республикалық';
  question: string;
  contextText?: string;
  diagramUrl?: string;
  explanation: string;
  campbellReference: string;
}

export interface SingleChoiceQuestion extends BaseQuestion {
  type: 'single';
  options: { id: string; text: string }[];
  correctAnswerId: string;
}

export interface MatchingQuestion extends BaseQuestion {
  type: 'matching';
  leftItems: { id: string; text: string }[];
  rightItems: { id: string; text: string }[];
  correctPairs: { leftId: string; rightId: string }[];
}

export interface SequenceQuestion extends BaseQuestion {
  type: 'sequence';
  steps: { id: string; text: string }[];
  correctOrder: string[]; // array of step IDs
}

export interface ProblemQuestion extends BaseQuestion {
  type: 'problem';
  options?: { id: string; text: string }[];
  correctAnswerId?: string;
  modelAnswer: string;
  calculationSteps: string[];
}

export type OlympiadQuestion =
  | SingleChoiceQuestion
  | MatchingQuestion
  | SequenceQuestion
  | ProblemQuestion;

export interface StrategyGuide {
  id: string;
  title: string;
  iconName: string;
  description: string;
  tips: string[];
  methodologyExample?: {
    scenario: string;
    independentVar: string;
    dependentVar: string;
    controlGroup: string;
    conclusion: string;
  };
}

export interface LeaderboardEntry {
  id: string;
  name: string;
  school: string;
  city: string;
  grade: '7' | '8' | '9';
  totalScore: number;
  accuracy: number; // percentage
  modulesCompleted: number; // e.g. 5/6
  favoriteTopic: string;
  rankBadge: string;
  streakDays: number;
  lastActive: string;
  isCurrentUser?: boolean;
}

export interface UserProgress {
  userName: string;
  school: string;
  city: string;
  grade: '7' | '8' | '9';
  totalCorrect: number;
  totalAnswered: number;
  streakDays: number;
}
