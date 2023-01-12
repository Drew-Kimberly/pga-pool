export function outputJson(json: unknown) {
  console.dir(json, { depth: null, colors: true, maxArrayLength: null });
}
