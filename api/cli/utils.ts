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
