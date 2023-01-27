export class CoerceNumericColumnTransformer {
  to(data: number): number {
    return data;
  }

  from(data: string): number {
    return Number(data);
  }
}
