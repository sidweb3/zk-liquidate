# Test Liquidation Flow - Wave 5 V2

**Complete guide to testing the real Aave V3 liquidation integration**

---

## Overview

Your V2 contracts are now deployed and ready to test with **real Aave V3 liquidations** on Polygon Amoy testnet.

**Deployed Contracts:**
- IntentRegistryV2: `0x320A2dC1b4a56D13438578e3aC386ed90Ca21D27`
- LiquidationExecutorV2: `0x6cFe23FA3ed2D3df4ae2a4A2686514Fa8E634A9B`
- ZKVerifier: `0x8C935B982416673cF9633DdCC4E9Dc4ec2846Ab2`

---

## Prerequisites

### 1. Get Testnet MATIC

Visit: https://faucet.polygon.technology
- Select "Polygon Amoy"
- Request 5-10 MATIC for gas fees

### 2. Get Aave Testnet Tokens

Visit Aave Faucet: https://staging.aave.com/faucet/
- Connect your wallet to Polygon Amoy
- Request:
  - USDC (for borrowing)
  - WETH (for collateral)
  - DAI (optional)

---

## Test Scenario: Create a Liquidatable Position

### Step 1: Create Aave Position (Testnet)

1. **Go to Aave Testnet**: https://staging.aave.com
2. **Connect wallet** to Polygon Amoy
3. **Supply Collateral**:
   - Click "Supply"
   - Select WETH
   - Supply: 0.1 WETH (or whatever you received from faucet)
   - Confirm transaction

4. **Borrow Against Collateral**:
   - Click "Borrow"
   - Select USDC
   - Borrow maximum amount (this will give you low health factor)
   - Confirm transaction

5. **Check Your Health Factor**:
   - Should show on dashboard
   - Ideal for testing: **Health Factor between 0.9 - 1.1**
   - If HF < 1.0, you're liquidatable! ✅

---

## Test Scenario 2: Submit Liquidation Intent

### Step 2: Submit Intent to IntentRegistryV2

**Using Remix:**

1. Go to your deployed IntentRegistryV2: `0x320A2dC1b4a56D13438578e3aC386ed90Ca21D27`
2. Call `submitIntent()` with:

```solidity
intentHash: 0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef
targetUser: <Your Aave position address from Step 1>
targetProtocol: 0x6Ae43d3271ff6888e7Fc43Fd7321a503ff738951  // Aave Pool
targetHealthFactor: 950000000000000000  // 0.95 (scaled by 1e18)
minPrice: 1000000000  // Min price in wei
deadline: <current block + 100>  // Get current block from Amoy explorer
value: 10000000000000000000  // 10 MATIC stake
```

3. Click "transact" and confirm in MetaMask

**Expected Result:**
- ✅ Transaction confirms
- ✅ Intent created with 10 MATIC stake
- ✅ Event `IntentSubmitted` emitted

---

## Test Scenario 3: Execute Real Liquidation

### Step 3: Execute Liquidation on Aave

**Prerequisites for Executor:**
- Have USDC in wallet (to repay debt)
- Approve LiquidationExecutorV2 to spend your USDC

**Using Remix:**

1. **Approve USDC** first:
   - Go to USDC contract: `0x41E94Eb019C0762f9Bfcf9Fb1E58725BfB0e7582`
   - Call `approve()`
   - spender: `0x6cFe23FA3ed2D3df4ae2a4A2686514Fa8E634A9B` (LiquidationExecutorV2)
   - amount: `1000000000` (1000 USDC, 6 decimals)

2. **Execute Liquidation**:
   - Go to LiquidationExecutorV2: `0x6cFe23FA3ed2D3df4ae2a4A2686514Fa8E634A9B`
   - Call `executeLiquidation()` with:

```solidity
intentHash: 0x1234...  // Same hash from Step 2
targetUser: <Aave position address>
collateralAsset: 0xA6FA4fB5f76172d178d61B04b0ecd319C5d1C0aa  // WETH
debtAsset: 0x41E94Eb019C0762f9Bfcf9Fb1E58725BfB0e7582  // USDC
debtToCover: 100000000  // 100 USDC (6 decimals)
```

3. Click "transact" and confirm in MetaMask

**Expected Result:**
- ✅ Your USDC is used to repay target's debt
- ✅ You receive WETH collateral (with 5% bonus)
- ✅ 0.5% fee goes to insurance pool
- ✅ Intent marked as executed
- ✅ Event `LiquidationExecuted` emitted

---

## Verify on Block Explorer

After each step, verify on **Amoy PolygonScan**:

### Check Intent Submission:
https://amoy.polygonscan.com/address/0x320A2dC1b4a56D13438578e3aC386ed90Ca21D27

Look for:
- Transaction with 10 MATIC value
- Event `IntentSubmitted`
- Your address as sender

### Check Liquidation Execution:
https://amoy.polygonscan.com/address/0x6cFe23FA3ed2D3df4ae2a4A2686514Fa8E634A9B

Look for:
- USDC transfer FROM you
- WETH transfer TO you
- Event `LiquidationExecuted`
- Insurance pool balance increased

---

## Troubleshooting

### Error: "User not liquidatable"

**Cause**: Health factor >= 1.0

**Solution**:
- Wait for price fluctuation to lower HF
- Or borrow more to lower your HF
- Check current HF on Aave dashboard

### Error: "Transfer failed"

**Cause**: Didn't approve USDC

**Solution**:
- Go to USDC contract
- Call `approve(LiquidationExecutorV2, amount)`
- Then retry liquidation

### Error: "Invalid prices"

**Cause**: Aave Oracle issue

**Solution**:
- Verify Aave Oracle address: `0xc100cd5b25b9b0f10f3d06e42f3ded22a6dd5db6`
- Check if Aave testnet is operational
- Try again in a few minutes

### Error: "Exceeds close factor"

**Cause**: Trying to liquidate more than 50% of debt

**Solution**:
- Reduce `debtToCover` to max 50% of total debt
- Check total debt on Aave dashboard
- Calculate: max = totalDebt * 0.5

---

## Expected Profit Calculation

**Example Liquidation:**
- Debt repaid: 100 USDC
- Collateral seized: ~0.05 WETH (depends on prices)
- Liquidation bonus: 5%
- Insurance fee: 0.5%

**If WETH = $2000 and USDC = $1:**
- Collateral value: 0.05 * $2000 = $100
- Debt value: 100 * $1 = $100
- Liquidation bonus: $5
- Insurance fee: $5 * 0.005 = $0.025
- **Your profit: $4.975** (paid in WETH)

---

## Query Contract State

### Check Intent Status

Call `getIntent(intentHash)` on IntentRegistryV2:

Returns:
```solidity
{
  liquidator: <your address>,
  targetUser: <liquidatable user>,
  targetProtocol: <Aave Pool>,
  targetHealthFactor: 950000000000000000,
  stakeAmount: 10000000000000000000,
  isExecuted: false/true,
  ...
}
```

### Check Execution Details

Call `getExecution(intentHash)` on LiquidationExecutorV2:

Returns:
```solidity
{
  executor: <your address>,
  profit: <profit in wei>,
  timestamp: <execution time>
}
```

### Check Your Rewards

Call `getExecutorStats(yourAddress)` on LiquidationExecutorV2:

Returns:
```solidity
{
  totalRewards: <total profit earned>,
  totalLiquidations: <number of liquidations>
}
```

### Check Insurance Pool

Call `getInsurancePool()` on LiquidationExecutorV2:

Returns total insurance pool balance in wei.

---

## Simulate Before Executing

**Save gas by simulating first!**

Call `simulateLiquidation()` on LiquidationExecutorV2:

```solidity
targetUser: <user address>
debtToCover: 100000000  // 100 USDC
```

Returns:
```solidity
{
  isLiquidatable: true/false,
  healthFactor: <actual HF>,
  estimatedProfit: <estimated profit>
}
```

If `isLiquidatable = false`, don't execute (will fail).

---

## Quick Test Commands

### Get testnet MATIC:
```bash
https://faucet.polygon.technology
```

### Get Aave testnet tokens:
```bash
https://staging.aave.com/faucet/
```

### Create Aave position:
```bash
https://staging.aave.com
→ Supply WETH
→ Borrow USDC (max amount)
```

### Check your position:
```bash
https://staging.aave.com
→ View Dashboard
→ Check Health Factor
```

### Submit intent (via Remix):
```bash
IntentRegistryV2.submitIntent(...)
+ 10 MATIC
```

### Execute liquidation (via Remix):
```bash
1. USDC.approve(LiquidationExecutorV2, amount)
2. LiquidationExecutorV2.executeLiquidation(...)
```

---

## Success Criteria

✅ **Intent Submitted:**
- Transaction confirmed
- 10 MATIC staked
- Intent hash recorded

✅ **Liquidation Executed:**
- USDC transferred from you
- WETH received (with bonus)
- Event emitted
- Insurance pool increased

✅ **State Updated:**
- Intent marked as executed
- Your rewards increased
- Executor stats updated

---

## Video Walkthrough (Optional)

Record screen capture showing:
1. Creating Aave position
2. Submitting intent via Remix
3. Executing liquidation
4. Checking transactions on PolygonScan
5. Verifying profit received

This demonstrates real DeFi integration for Wave 5! 🎉

---

## Next Steps

After successful test:

1. ✅ Screenshot transaction hashes
2. ✅ Document in Wave 5 submission
3. ✅ Share PolygonScan links with judges
4. ✅ Add to project README

**Your V2 contracts are now production-ready for testnet!** 🚀

---

## Support Links

- Polygon Amoy Faucet: https://faucet.polygon.technology
- Aave Testnet: https://staging.aave.com
- Aave Faucet: https://staging.aave.com/faucet/
- Amoy Explorer: https://amoy.polygonscan.com
- IntentRegistryV2: https://amoy.polygonscan.com/address/0x320A2dC1b4a56D13438578e3aC386ed90Ca21D27
- LiquidationExecutorV2: https://amoy.polygonscan.com/address/0x6cFe23FA3ed2D3df4ae2a4A2686514Fa8E634A9B
