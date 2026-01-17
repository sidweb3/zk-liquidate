/**
 * Chainlink Price Feed Integration
 * Fetches real prices from Chainlink oracles on Ethereum Sepolia
 */

import { ethers } from "ethers";

// Verified Chainlink Price Feed addresses on Sepolia
export const CHAINLINK_PRICE_FEEDS = {
  ETH_USD: "0x694AA1769357215DE4FAC081bf1f309aDC325306",
  BTC_USD: "0x1b44F3514812d835EB1BDB0acB33d3fA3351Ee43",
  LINK_USD: "0xc59E3633BAAC79493d908e63626716e204A45EdF",
} as const;

// Minimal ABI for Chainlink Price Feeds
const PRICE_FEED_ABI = [
  "function latestRoundData() external view returns (uint80 roundId, int256 answer, uint256 startedAt, uint256 updatedAt, uint80 answeredInRound)",
  "function decimals() external view returns (uint8)",
  "function description() external view returns (string)",
];

export interface PriceData {
  asset: string;
  price: number;
  decimals: number;
  updatedAt: number;
  confidence: number;
}

/**
 * Get price from a single Chainlink feed
 */
export async function getChainlinkPrice(
  provider: ethers.Provider,
  feedAddress: string,
  assetName: string
): Promise<PriceData> {
  try {
    console.log(`Fetching ${assetName} from ${feedAddress}...`);
    const priceFeed = new ethers.Contract(feedAddress, PRICE_FEED_ABI, provider);

    const [roundData, decimals] = await Promise.all([
      priceFeed.latestRoundData(),
      priceFeed.decimals(),
    ]);

    console.log(`${assetName} raw data:`, {
      answer: roundData.answer.toString(),
      decimals: Number(decimals),
      updatedAt: Number(roundData.updatedAt),
    });

    const price = Number(roundData.answer) / Math.pow(10, Number(decimals));
    const updatedAt = Number(roundData.updatedAt);

    // Calculate confidence based on data freshness
    const timeSinceUpdate = Date.now() / 1000 - updatedAt;
    const confidence = Math.max(0.85, 1 - timeSinceUpdate / 7200); // Degrades over 2 hours

    return {
      asset: assetName,
      price,
      decimals: Number(decimals),
      updatedAt,
      confidence,
    };
  } catch (err) {
    console.error(`Failed to fetch ${assetName}:`, err);
    throw new Error(`Failed to fetch ${assetName} price: ${err}`);
  }
}

/**
 * Fetch all Chainlink prices
 */
export async function getAllChainlinkPrices(
  provider: ethers.Provider
): Promise<PriceData[]> {
  const feeds = [
    { address: CHAINLINK_PRICE_FEEDS.ETH_USD, name: "ETH" },
    { address: CHAINLINK_PRICE_FEEDS.BTC_USD, name: "BTC" },
    { address: CHAINLINK_PRICE_FEEDS.LINK_USD, name: "LINK" },
  ];

  const prices = await Promise.all(
    feeds.map(feed => getChainlinkPrice(provider, feed.address, feed.name))
  );

  return prices;
}

/**
 * Get Sepolia provider with fallback
 */
export function getSepoliaProvider(): ethers.JsonRpcProvider {
  // Use Alchemy public endpoint (most reliable)
  return new ethers.JsonRpcProvider(
    "https://eth-sepolia.g.alchemy.com/v2/demo",
    {
      name: "sepolia",
      chainId: 11155111,
    }
  );
}

/**
 * Test if provider is working
 */
export async function testProvider(provider: ethers.Provider): Promise<boolean> {
  try {
    const blockNumber = await provider.getBlockNumber();
    console.log("Provider working, block:", blockNumber);
    return blockNumber > 0;
  } catch (err) {
    console.error("Provider test failed:", err);
    return false;
  }
}
