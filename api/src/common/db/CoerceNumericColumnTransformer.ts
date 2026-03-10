export class CoerceNumericColumnTransformer {
  private readonly nullable: boolean;

  constructor(opts: { nullable: boolean } = { nullable: false }) {
    this.nullable = opts.nullable;
  }

  to(data: number | null): number | null {
    return data;
  }

  from(data: string | null): number | null {
    if (this.nullable && data === null) {
      return null;
    }
    return Number(data);
  }
}
