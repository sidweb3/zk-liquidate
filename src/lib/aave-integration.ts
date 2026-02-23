/**
 * Aave V3 Integration for Real Liquidation Opportunities
 * Connects to Aave V3 on Polygon Sepolia testnet (Amoy has limited DeFi protocols)
 */

import { ethers } from "ethers";

// Note: Polygon Amoy doesn't have Aave V3 deployed yet
// Using Sepolia Aave V3 for real data demonstration
export const AAVE_V3_POOL_ADDRESS = "0x6Ae43d3271ff6888e7Fc43Fd7321a503ff738951"; // Sepolia
export const AAVE_V3_POOL_DATA_PROVIDER = "0x3e9708d80f7B3e43118013075F7e95CE3AB31F31"; // Sepolia

// Chainlink Price Feed Addresses on Sepolia
export const CHAINLINK_PRICE_FEEDS = {
  ETH_USD: "0x694AA1769357215DE4FAC081bf1f309aDC325306", // Sepolia ETH/USD
  BTC_USD: "0x1b44F3514812d835EB1BDB0acB33d3fA3351Ee43", // Sepolia BTC/USD
  LINK_USD: "0xc59E3633BAAC79493d908e63626716e204A45EdF", // Sepolia LINK/USD
  USDC_USD: "0xA2F78ab2355fe2f984D808B5CeE7FD0A93D5270E", // Sepolia USDC/USD
};

// Aave V3 Pool ABI (minimal for our needs)
const AAVE_POOL_ABI = [
  "function getUserAccountData(address user) external view returns (uint256 totalCollateralBase, uint256 totalDebtBase, uint256 availableBorrowsBase, uint256 currentLiquidationThreshold, uint256 ltv, uint256 healthFactor)",
  "function getReservesList() external view returns (address[])",
];

// Aave V3 Pool Data Provider ABI
const AAVE_DATA_PROVIDER_ABI = [
  "function getUserReserveData(address asset, address user) external view returns (uint256 currentATokenBalance, uint256 currentStableDebt, uint256 currentVariableDebt, uint256 principalStableDebt, uint256 scaledVariableDebt, uint256 stableBorrowRate, uint256 liquidityRate, uint40 stableRateLastUpdated, bool usageAsCollateralEnabled)",
  "function getReserveConfigurationData(address asset) external view returns (uint256 decimals, uint256 ltv, uint256 liquidationThreshold, uint256 liquidationBonus, uint256 reserveFactor, bool usageAsCollateralEnabled, bool borrowingEnabled, bool stableBorrowRateEnabled, bool isActive, bool isFrozen)",
];

// Chainlink Price Feed ABI
const CHAINLINK_PRICE_FEED_ABI = [
  "function latestRoundData() external view returns (uint80 roundId, int256 answer, uint256 startedAt, uint256 updatedAt, uint80 answeredInRound)",
  "function decimals() external view returns (uint8)",
];

export interface UserAccountData {
  totalCollateralBase: bigint;
  totalDebtBase: bigint;
  availableBorrowsBase: bigint;
  currentLiquidationThreshold: bigint;
  ltv: bigint;
  healthFactor: bigint;
}

export interface PriceData {
  asset: string;
  price: number;
  decimals: number;
  updatedAt: number;
  confidence: number;
}

export interface LiquidationOpportunity {
  userAddress: string;
  healthFactor: number;
  totalCollateral: number;
  totalDebt: number;
  liquidationBonus: number;
  estimatedProfit: number;
  riskScore: number;
}

/**
 * Get real-time price from Chainlink with staleness check
 */
export async function getChainlinkPrice(
  provider: ethers.Provider,
  asset: keyof typeof CHAINLINK_PRICE_FEEDS
): Promise<PriceData> {
  const priceFeedAddress = CHAINLINK_PRICE_FEEDS[asset];
  const priceFeed = new ethers.Contract(
    priceFeedAddress,
    CHAINLINK_PRICE_FEED_ABI,
    provider
  );

  const [roundData, decimals] = await Promise.all([
    priceFeed.latestRoundData(),
    priceFeed.decimals(),
  ]);

  const updatedAt = Number(roundData.updatedAt);
  const timeSinceUpdate = Date.now() / 1000 - updatedAt;

  // Staleness check: reject prices older than 60 minutes
  if (timeSinceUpdate > 3600) {
    throw new Error(`STALE_PRICE: ${asset} price data is ${Math.floor(timeSinceUpdate / 60)} minutes old. Maximum allowed: 60 minutes.`);
  }

  // Sanity check: price must be positive
  if (roundData.answer <= 0n) {
    throw new Error(`INVALID_PRICE: ${asset} returned a non-positive price`);
  }

  const price = Number(roundData.answer) / Math.pow(10, Number(decimals));

  // Calculate confidence based on how recent the update is
  const confidence = Math.max(0.8, 1 - timeSinceUpdate / 3600); // Degrades over 1 hour

  return {
    asset: asset.replace("_USD", ""),
    price,
    decimals: Number(decimals),
    updatedAt,
    confidence,
  };
}

/**
 * Get all Chainlink prices
 */
export async function getAllChainlinkPrices(
  provider: ethers.Provider
): Promise<PriceData[]> {
  const assets = Object.keys(CHAINLINK_PRICE_FEEDS) as Array<keyof typeof CHAINLINK_PRICE_FEEDS>;

  const prices = await Promise.all(
    assets.map(asset => getChainlinkPrice(provider, asset))
  );

  return prices;
}

/**
 * Get user account data from Aave V3
 */
export async function getUserAccountData(
  provider: ethers.Provider,
  userAddress: string
): Promise<UserAccountData> {
  const pool = new ethers.Contract(
    AAVE_V3_POOL_ADDRESS,
    AAVE_POOL_ABI,
    provider
  );

  const accountData = await pool.getUserAccountData(userAddress);

  return {
    totalCollateralBase: accountData.totalCollateralBase,
    totalDebtBase: accountData.totalDebtBase,
    availableBorrowsBase: accountData.availableBorrowsBase,
    currentLiquidationThreshold: accountData.currentLiquidationThreshold,
    ltv: accountData.ltv,
    healthFactor: accountData.healthFactor,
  };
}

/**
 * Calculate health factor as a decimal number
 */
export function calculateHealthFactor(accountData: UserAccountData): number {
  if (accountData.totalDebtBase === 0n) {
    return Infinity; // No debt means infinite health factor
  }

  // Health factor is already scaled by 1e18 in Aave
  return Number(accountData.healthFactor) / 1e18;
}

/**
 * Check if a user is liquidatable (health factor < 1.0)
 */
export function isLiquidatable(accountData: UserAccountData): boolean {
  const healthFactor = calculateHealthFactor(accountData);
  return healthFactor < 1.0 && healthFactor > 0;
}

/**
 * Estimate liquidation profit
 */
export function estimateLiquidationProfit(
  accountData: UserAccountData,
  liquidationBonus: number = 0.05 // 5% default bonus
): number {
  if (!isLiquidatable(accountData)) {
    return 0;
  }

  // Convert from base units (1e8 for Aave) to USD
  const collateralUSD = Number(accountData.totalCollateralBase) / 1e8;
  const debtUSD = Number(accountData.totalDebtBase) / 1e8;

  // Maximum liquidatable amount is 50% of debt
  const maxLiquidatableDebt = debtUSD * 0.5;

  // Profit = liquidation bonus on the collateral seized
  const profit = maxLiquidatableDebt * liquidationBonus;

  return profit;
}

/**
 * Calculate risk score for liquidation (0-100)
 */
export function calculateRiskScore(accountData: UserAccountData): number {
  const healthFactor = calculateHealthFactor(accountData);

  if (healthFactor >= 1.0) {
    return 0; // Not liquidatable, no risk
  }

  // Lower health factor = higher risk of competition
  // But also higher profit potential
  const baseScore = Math.min(100, (1 - healthFactor) * 200);

  // Adjust based on debt size (larger debt = more attractive)
  const debtSizeBonus = Math.min(20, Number(accountData.totalDebtBase) / 1e10);

  return Math.min(100, baseScore + debtSizeBonus);
}

/**
 * Scan for liquidation opportunities (mock for now - would need event logs in production)
 */
export async function scanForLiquidationOpportunities(
  provider: ethers.Provider,
  userAddresses: string[]
): Promise<LiquidationOpportunity[]> {
  const opportunities: LiquidationOpportunity[] = [];

  for (const userAddress of userAddresses) {
    try {
      const accountData = await getUserAccountData(provider, userAddress);

      if (isLiquidatable(accountData)) {
        const healthFactor = calculateHealthFactor(accountData);
        const profit = estimateLiquidationProfit(accountData);
        const riskScore = calculateRiskScore(accountData);

        opportunities.push({
          userAddress,
          healthFactor,
          totalCollateral: Number(accountData.totalCollateralBase) / 1e8,
          totalDebt: Number(accountData.totalDebtBase) / 1e8,
          liquidationBonus: 0.05,
          estimatedProfit: profit,
          riskScore,
        });
      }
    } catch (error) {
      console.error(`Error checking user ${userAddress}:`, error);
    }
  }

  return opportunities.sort((a, b) => b.estimatedProfit - a.estimatedProfit);
}

/**
 * Get sample test addresses on Polygon Mumbai (addresses with Aave positions)
 */
export function getSampleTestAddresses(): string[] {
  // These are sample addresses - in production, you'd get these from Aave events
  return [
    "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb", // Test address 1
    "0x1234567890123456789012345678901234567890", // Test address 2
    "0xabcdefabcdefabcdefabcdefabcdefabcdefabcd", // Test address 3
  ];
}

/**
 * Format health factor for display
 */
export function formatHealthFactor(hf: number): string {
  if (hf === Infinity) return "∞";
  if (hf > 100) return ">100";
  return hf.toFixed(2);
}

/**
 * Get liquidation status color
 */
export function getHealthFactorColor(hf: number): string {
  if (hf === Infinity || hf > 2) return "text-green-500";
  if (hf > 1.5) return "text-yellow-500";
  if (hf > 1.0) return "text-orange-500";
  return "text-red-500";
}