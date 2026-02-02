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

export function toFedexCupPointsString(points: number | null | undefined): string {
  const numPoints = Number(points);

  if (isNaN(numPoints)) {
    return '--';
  }

  return `${Math.round(numPoints * 10) / 10}`;
}

export function getEffectiveFedexCupPoints<
  T extends {
    official_fedex_cup_points?: number | null;
    projected_fedex_cup_points?: number | null;
  },
>(value: T): number | null | undefined {
  return value.official_fedex_cup_points ?? value.projected_fedex_cup_points;
}
