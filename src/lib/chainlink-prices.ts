/**
 * Chainlink Price Feed Integration
 * Fetches real prices from Chainlink oracles on Ethereum Sepolia
 * Falls back to CoinGecko if RPC fails
 */

import { ethers } from "ethers";

export const CHAINLINK_PRICE_FEEDS = {
  ETH_USD: "0x694AA1769357215DE4FAC081bf1f309aDC325306",
  BTC_USD: "0x1b44F3514812d835EB1BDB0acB33d3fA3351Ee43",
  LINK_USD: "0xc59E3633BAAC79493d908e63626716e204A45EdF",
} as const;

const PRICE_FEED_ABI = [
  "function latestRoundData() external view returns (uint80 roundId, int256 answer, uint256 startedAt, uint256 updatedAt, uint80 answeredInRound)",
  "function decimals() external view returns (uint256)",
];

export interface PriceData {
  asset: string;
  price: number;
  decimals: number;
  updatedAt: number;
  confidence: number;
  source: "chainlink" | "coingecko";
}

/**
 * Fetch a single price feed — sequential calls to avoid batch limits
 */
async function fetchSingleFeed(
  provider: ethers.JsonRpcProvider,
  feedAddress: string,
  assetName: string
): Promise<PriceData> {
  const priceFeed = new ethers.Contract(feedAddress, PRICE_FEED_ABI, provider);

  // Sequential calls — avoids batching
  const roundData = await priceFeed.latestRoundData();
  const decimals = await priceFeed.decimals();

  const updatedAt = Number(roundData.updatedAt);
  const timeSinceUpdate = Date.now() / 1000 - updatedAt;

  if (timeSinceUpdate > 3600) {
    throw new Error(`STALE_PRICE: ${assetName} price is ${Math.floor(timeSinceUpdate / 60)}m old`);
  }

  if (roundData.answer <= 0n) {
    throw new Error(`INVALID_PRICE: ${assetName} returned non-positive price`);
  }

  const price = Number(roundData.answer) / Math.pow(10, Number(decimals));
  const confidence = Math.max(0.85, 1 - timeSinceUpdate / 7200);

  return { asset: assetName, price, decimals: Number(decimals), updatedAt, confidence, source: "chainlink" };
}

/**
 * Fetch prices from CoinGecko free API (no key required)
 */
async function fetchCoinGeckoPrices(): Promise<PriceData[]> {
  const url = "https://api.coingecko.com/api/v3/simple/price?ids=ethereum,bitcoin,chainlink&vs_currencies=usd&include_last_updated_at=true";
  const res = await fetch(url);
  if (!res.ok) throw new Error(`CoinGecko error: ${res.status}`);
  const data = await res.json();

  const now = Math.floor(Date.now() / 1000);
  return [
    {
      asset: "ETH",
      price: data.ethereum.usd,
      decimals: 8,
      updatedAt: data.ethereum.last_updated_at ?? now,
      confidence: 0.97,
      source: "coingecko",
    },
    {
      asset: "BTC",
      price: data.bitcoin.usd,
      decimals: 8,
      updatedAt: data.bitcoin.last_updated_at ?? now,
      confidence: 0.97,
      source: "coingecko",
    },
    {
      asset: "LINK",
      price: data.chainlink.usd,
      decimals: 8,
      updatedAt: data.chainlink.last_updated_at ?? now,
      confidence: 0.97,
      source: "coingecko",
    },
  ];
}

/**
 * Fetch all prices — tries Chainlink RPC first, falls back to CoinGecko
 */
export async function getAllChainlinkPrices(
  provider: ethers.JsonRpcProvider
): Promise<PriceData[]> {
  const feeds = [
    { address: CHAINLINK_PRICE_FEEDS.ETH_USD, name: "ETH" },
    { address: CHAINLINK_PRICE_FEEDS.BTC_USD, name: "BTC" },
    { address: CHAINLINK_PRICE_FEEDS.LINK_USD, name: "LINK" },
  ];

  try {
    // Sequential fetches with small delay to avoid batch limits
    const results: PriceData[] = [];
    for (const feed of feeds) {
      const price = await fetchSingleFeed(provider, feed.address, feed.name);
      results.push(price);
      await new Promise(r => setTimeout(r, 200)); // 200ms between calls
    }
    return results;
  } catch (err) {
    console.warn("Chainlink RPC failed, falling back to CoinGecko:", err);
    return await fetchCoinGeckoPrices();
  }
}

export function getSepoliaProvider(): ethers.JsonRpcProvider {
  return new ethers.JsonRpcProvider("https://sepolia.drpc.org", { name: "sepolia", chainId: 11155111 });
}

export async function testProvider(provider: ethers.Provider): Promise<boolean> {
  try {
    const blockNumber = await provider.getBlockNumber();
    return blockNumber > 0;
  } catch {
    return false;
  }
}