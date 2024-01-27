export function outputJson(json: unknown) {
  console.dir(json, { depth: null, colors: true, maxArrayLength: null });
}

export function envAware(value: string): string {
  const envTokenPrefix = 'env.';

  if (value.startsWith(envTokenPrefix)) {
    return process.env[value.substring(envTokenPrefix.length)] ?? '';
  }

  return value;
}

export function parseOptionalBool(value?: string): boolean | undefined {
  if (!value) {
    return undefined;
  }

  return value.toLowerCase() === 'true';
}

export class Maths {
  static sum(...nums: number[]): number {
    return nums.reduce((total, curr) => total + curr, 0);
  }

  static mean(...nums: number[]): number {
    return Maths.sum(...nums) / nums.length;
  }

  static variance(mean: number, nums: number[]): number {
    const squared = nums.map((n) => Math.pow(n - mean, 2));
    return Maths.sum(...squared) / squared.length;
  }

  static stdDev(mean: number, nums: number[]): number {
    return Math.sqrt(Maths.variance(mean, nums));
  }

  static zScores(...nums: number[]): number[] {
    const mean = Maths.mean(...nums);
    const stdDev = Maths.stdDev(mean, nums);

    return nums.map((n) => {
      const diff = n - mean;
      return diff / stdDev;
    });
  }
}
