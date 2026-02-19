export interface CommentInsight {
  text: string;
  usefulnessScore: number;
  question: boolean;
  experience: boolean;
  doubt: boolean;
  influencedCount: number;
}

const QUESTION_PATTERN = /[؟?]|چند|چطور|موجود|دارید|هست|میشه|می‌شه/u;
const EXPERIENCE_PATTERN = /خریدم|گرفتم|استفاده|تجربه|واقعا|کیفیت|راضی|جواب داد/u;
const DOUBT_PATTERN = /شک|مطمئن|واقعیه|فیک|خراب|می‌ترسم|جواب میده|جواب می‌ده/u;

export const buildCommentInsight = (text: string, baseLikes = 0): CommentInsight => {
  const question = QUESTION_PATTERN.test(text);
  const experience = EXPERIENCE_PATTERN.test(text);
  const doubt = DOUBT_PATTERN.test(text);

  const usefulnessScore =
    baseLikes +
    (question ? 28 : 0) +
    (experience ? 34 : 0) +
    (doubt ? 22 : 0) +
    Math.min(18, Math.floor(text.length / 10));

  return {
    text,
    usefulnessScore,
    question,
    experience,
    doubt,
    influencedCount: Math.max(3, Math.round(usefulnessScore / 11)),
  };
};

export const sortByUsefulness = <T extends { text: string; likes?: number }>(comments: T[]): T[] =>
  comments
    .slice()
    .sort(
      (a, b) =>
        buildCommentInsight(b.text, b.likes ?? 0).usefulnessScore -
        buildCommentInsight(a.text, a.likes ?? 0).usefulnessScore
    );

