'use server';

import qs from 'query-string';

const BASE_URL = process.env.COINGECKO_BASE_URL;
const API_KEY = process.env.COINGECKO_API_KEY;

if (!BASE_URL) throw new Error('Could not get base url');
if (!API_KEY) throw new Error('Could not get api key');

export async function fetcher<T>(
  endpoint: string,
  params?: QueryParams,
  revalidate = 60,
): Promise<T> {
  const url = qs.stringifyUrl(
    {
      url: `${BASE_URL}/${endpoint}`,
      query: params,
    },
    { skipEmptyString: true, skipNull: true },
  );

  const response = await fetch(url, {
    headers: {
      'x-cg-demo-api-key': API_KEY,
      'Content-Type': 'application/json',
    } as Record<string, string>,
    next: { revalidate },
  });

  if (!response.ok) {
    const errorBody: CoinGeckoErrorBody = await response.json().catch(() => ({}));

    throw new Error(`API Error: ${response.status}: ${errorBody.error || response.statusText} `);
  }

  return response.json();
}

export async function getPools(
  id: string,
  network?: string | null,
  contractAddress?: string | null,
): Promise<PoolData> {
  const fallback: PoolData = {
    id: '',
    address: '',
    name: '',
    network: '',
  };

  if (network && contractAddress) {
    try {
      const poolData = await fetcher<{ data: PoolData[] }>(
        `/onchain/networks/${network}/tokens/${contractAddress}/pools`,
      );

      return poolData.data?.[0] ?? fallback;
    } catch (error) {
      console.log(error);
      return fallback;
    }
  }

  try {
    const poolData = await fetcher<{ data: PoolData[] }>('/onchain/search/pools', { query: id });

    return poolData.data?.[0] ?? fallback;
  } catch {
    return fallback;
  }
}

export async function searchCoins(query: string): Promise<SearchCoin[]> {
  try {
    // Step 1: Fetch search results from /search endpoint
    const searchData = await fetcher<{ coins: SearchResult[] }>('search', { query });

    // Extract top 10 coin IDs
    const coinIds = searchData.coins
      .slice(0, 10)
      .map((coin) => coin.id)
      .join(',');

    if (!coinIds) {
      return [];
    }

    // Step 2: Fetch market data for those specific coins
    const marketData = await fetcher<MarketData[]>('coins/markets', {
      vs_currency: 'usd',
      ids: coinIds,
      order: 'market_cap_desc',
      per_page: 10,
      page: 1,
      sparkline: false,
      price_change_percentage: '24h',
    });

    // Step 3: Merge the two datasets
    const mergedResults: SearchCoin[] = searchData.coins
      .slice(0, 10)
      .map((searchCoin) => {
        const marketInfo = marketData.find((m) => m.id === searchCoin.id);

        return {
          id: searchCoin.id,
          name: searchCoin.name,
          symbol: searchCoin.symbol,
          thumb: searchCoin.thumb,
          large: searchCoin.thumb, // Use thumb as fallback for large
          market_cap_rank: searchCoin.market_cap_rank,
          data: {
            price: marketInfo?.current_price ?? 0,
            price_change_percentage_24h:
              marketInfo?.price_change_percentage_24h ?? 0,
            market_cap: marketInfo?.market_cap ?? 0,
            total_volume: marketInfo?.total_volume ?? 0,
          },
        };
      })
      .filter((coin) => coin.data.price > 0); // Only return coins with valid price data

    return mergedResults;
  } catch (error) {
    console.error('Error fetching coin search results:', error);
    return [];
  }
}