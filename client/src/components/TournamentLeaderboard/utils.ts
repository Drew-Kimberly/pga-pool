export function toScoreString(score: number | string | null | undefined): string {
  const numScore = Number(score);

  if (isNaN(numScore)) {
    return '--';
  }

  if (numScore === 0) {
    return 'E';
  }

  if (numScore > 0) {
    return `+${numScore}`;
  }

  return `${numScore}`;
}
