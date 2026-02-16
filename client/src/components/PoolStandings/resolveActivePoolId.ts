import { pgaPoolApi } from '../../api/pga-pool';

export async function resolveActivePoolId(): Promise<string | null> {
  const poolsResponse = await pgaPoolApi.pools.listPools({
    page: { number: 1, size: 200 },
  });
  const pools = poolsResponse.data.data;

  if (!pools.length) {
    return null;
  }

  const [activePool] = [...pools].sort((a, b) => {
    if (a.year !== b.year) {
      return b.year - a.year;
    }

    const nameOrder = a.name.localeCompare(b.name);
    if (nameOrder !== 0) {
      return nameOrder;
    }

    return a.id.localeCompare(b.id);
  });

  return activePool.id;
}
