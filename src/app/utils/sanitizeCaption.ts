const namedEntityMap: Record<string, string> = {
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  apos: "'",
  nbsp: ' ',
};

const decodeHtmlEntities = (value: string): string => {
  return value
    .replace(/&#(\d+);/g, (_, dec) => {
      const code = Number(dec);
      return Number.isFinite(code) ? String.fromCodePoint(code) : _;
    })
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => {
      const code = Number.parseInt(hex, 16);
      return Number.isFinite(code) ? String.fromCodePoint(code) : _;
    })
    .replace(/&([a-zA-Z]+);/g, (match, name: string) => namedEntityMap[name] ?? match);
};

export const sanitizeCaptionText = (input?: string): string => {
  if (!input) return '';

  let value = input;

  // Remove common content pipeline artifacts.
  value = value.replace(/:contentReference\[[^\]]*]\{[^}]*}/g, '');

  // Remove code fences and inline code marks.
  value = value.replace(/```[\s\S]*?```/g, '');
  value = value.replace(/`([^`]+)`/g, '$1');

  // Remove HTML/JSX-like tags.
  value = value.replace(/<\/?[\w-]+[^>]*>/g, '');

  // Remove obvious template placeholders and debug tokens.
  value = value.replace(/\$\{[^}]+\}/g, '');
  value = value.replace(/\b(?:undefined|null|NaN)\b/g, '');

  // Normalize escaped chars but keep visible line breaks.
  value = value
    .replace(/\\n/g, '\n')
    .replace(/\\r/g, '\n')
    .replace(/\\t/g, ' ')
    .replace(/\\+/g, '');

  value = decodeHtmlEntities(value);

  // Clean whitespace while preserving multi-line captions.
  value = value
    .split('\n')
    .map((line) => line.trim())
    .filter((line, index, all) => line.length > 0 || (index > 0 && all[index - 1].length > 0))
    .join('\n')
    .trim();

  return value;
};

