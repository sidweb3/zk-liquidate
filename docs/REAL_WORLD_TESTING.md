# 🌍 Real-World Testing Guide - zkLiquidate

**Welcome to the real zkLiquidate testnet experience!**

This guide shows you how to test zkLiquidate with **actual Aave V3 liquidation data** and **live Chainlink price feeds** on Polygon Mumbai testnet.

---

## 🎯 What's Real Now?

zkLiquidate now integrates with real DeFi protocols on testnet:

### ✅ Live Integrations

1. **Chainlink Price Oracles** 🔗
   - Real-time price feeds for ETH, BTC, MATIC, USDC
   - Updates every 30 seconds
   - Confidence scores based on data freshness

2. **Aave V3 Protocol** 💰
   - Connect to real Aave V3 contracts on Polygon Mumbai
   - Scan actual user positions
   - Check real health factors
   - Calculate actual liquidation opportunities

3. **Smart Contracts** 📜
   - Deployed and verified on Polygon Amoy & zkEVM
   - Intent Registry, ZK Verifier, Liquidation Executor
   - Real on-chain transactions

---

## 🚀 Quick Start (5 Minutes)

### Step 1: Get Testnet Tokens

You'll need testnet MATIC to interact with the protocol:

1. **Polygon Mumbai Faucet** (for Aave V3 testing):
   - Visit: https://faucet.polygon.technology/
   - Select "Mumbai" network
   - Request tokens (0.5 MATIC per request)

2. **Polygon Amoy Faucet** (for our contracts):
   - Visit: https://faucet.polygon.technology/
   - Select "Amoy" network
   - Request tokens

3. **Configure MetaMask**:

   **Polygon Mumbai** (for Aave V3):
   ```
   Network Name: Polygon Mumbai
   RPC URL: https://rpc-mumbai.maticvigil.com
   Chain ID: 80001
   Currency: MATIC
   Explorer: https://mumbai.polygonscan.com/
   ```

   **Polygon Amoy** (for our contracts):
   ```
   Network Name: Polygon Amoy
   RPC URL: https://rpc-amoy.polygon.technology
   Chain ID: 80002
   Currency: MATIC
   Explorer: https://amoy.polygonscan.com/
   ```

### Step 2: Visit the Dashboard

1. Go to: https://zk-cross-liquidate.vercel.app/dashboard
2. Click "Connect Wallet"
3. Switch to Polygon Amoy or Mumbai network

---

## 🔍 Testing the Live Liquidation Scanner

The **Live Scanner** tab connects to real Aave V3 contracts to find liquidation opportunities.

### How It Works

1. Navigate to **Dashboard → 🔍 Live Scanner**
2. Enter any Ethereum address
3. Click "Scan"

The scanner will:
- Query Aave V3 contracts on Polygon Mumbai
- Fetch the user's real health factor
- Calculate actual collateral and debt
- Estimate liquidation profit if health factor < 1.0

### Sample Addresses to Test

Try scanning these addresses (replace with real addresses that have Aave positions):

```
0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb
0x1234567890123456789012345678901234567890
```

### What You'll See

**If Health Factor > 1.0** (Healthy Position):
- Green indicator
- Position is safe from liquidation
- Collateral and debt displayed

**If Health Factor < 1.0** (Liquidatable):
- Red indicator with "LIQUIDATABLE" badge
- Estimated profit from liquidation
- Risk score (0-100)
- Liquidation bonus percentage

### Understanding Health Factor

```
Health Factor = (Collateral × Liquidation Threshold) / Debt

- HF > 1.0 = Safe position
- HF = 1.0 = At liquidation threshold
- HF < 1.0 = Can be liquidated
```

---

## 💰 Testing Live Price Feeds

The **Live Prices** tab displays real-time data from Chainlink oracles.

### How It Works

1. Navigate to **Dashboard → 💰 Live Prices**
2. Prices auto-update every 30 seconds
3. All data comes from Chainlink on Polygon Mumbai

### What You'll See

Each asset displays:
- **Current Price**: Real-time USD price
- **Confidence**: Data freshness score (80-100%)
- **Price Change**: Mock 24h change (for demo)

### Assets Tracked

- **ETH/USD** - Ethereum price
- **BTC/USD** - Bitcoin price
- **MATIC/USD** - Polygon price
- **USDC/USD** - Stablecoin price

All prices come from actual Chainlink Price Feed contracts:
```solidity
ETH/USD:  0x0715A7794a1dc8e42615F059dD6e406A6594651A
BTC/USD:  0x007A22900a3B98143368Bd5906f8E17e9867581b
MATIC/USD: 0xd0D5e3DB44DE05E9F294BB0a3bEEaF030DE24Ada
USDC/USD: 0x572dDec9087154dC5dfBB1546Bb62713147e0Ab0
```

---

## 🎯 Finding Real Liquidation Opportunities

### Method 1: Use Aave V3 App

1. Visit Aave V3 on Mumbai: https://app.aave.com/
2. Switch to "Mumbai" testnet
3. Browse user positions
4. Copy addresses with health factors near 1.0
5. Scan them in zkLiquidate

### Method 2: Create Your Own Position

1. Get Mumbai testnet tokens
2. Deposit collateral in Aave V3
3. Borrow against it
4. Monitor health factor in zkLiquidate

### Method 3: Monitor On-Chain Events

Use blockchain explorers to find:
- Recent Aave V3 borrows
- Positions with high LTV
- Users approaching liquidation threshold

---

## 📊 Understanding the Data

### Health Factor Calculation

zkLiquidate fetches data from Aave V3's `getUserAccountData()` function:

```typescript
interface UserAccountData {
  totalCollateralBase: bigint;  // Collateral in USD (scaled by 1e8)
  totalDebtBase: bigint;         // Debt in USD (scaled by 1e8)
  availableBorrowsBase: bigint;  // Available to borrow
  currentLiquidationThreshold: bigint;  // Liquidation threshold %
  ltv: bigint;                   // Loan-to-value ratio
  healthFactor: bigint;          // Health factor (scaled by 1e18)
}
```

### Liquidation Profit Formula

```
Max Liquidatable = 50% of user's debt
Liquidation Bonus = 5% (default on Aave)
Profit = (Max Liquidatable × Liquidation Bonus) - Gas Costs
```

### Risk Score

```
Risk Score = f(health factor, debt size, market conditions)

Low HF + High Debt = High Risk (but high reward)
High LF + Low Debt = Low Risk (safe but lower profit)
```

---

## 🧪 Complete Testing Workflow

### 1. Check Live Prices ✅

- Navigate to "Live Prices" tab
- Verify prices are updating
- Check confidence scores
- Confirm data is recent (< 1 hour old)

### 2. Scan for Liquidations ✅

- Go to "Live Scanner" tab
- Enter test addresses
- Review health factors
- Identify liquidatable positions

### 3. Submit Intent (via UI) ✅

- Find liquidatable position
- Click "Submit Liquidation Intent"
- Enter details in Intent Registry
- Submit transaction on Amoy

### 4. Verify with ZK Proof ✅

- Go to "ZK Verifier" tab
- Select your pending intent
- Generate and submit proof
- Wait for verification (~4s)

### 5. Execute Liquidation ✅

- Once verified, execute intent
- Transaction processed on Amoy
- Profit distributed
- Reputation updated

---

## 🐛 Common Issues & Solutions

### Issue: "Failed to fetch prices"

**Cause**: Mumbai RPC connection issue

**Solution**:
- Check internet connection
- Try alternative RPC: `https://polygon-mumbai.g.alchemy.com/v2/demo`
- Wait 30 seconds and retry

### Issue: "Address has no Aave position"

**Cause**: Address doesn't have active Aave V3 position on Mumbai

**Solution**:
- Use addresses from Aave V3 app
- Create your own test position
- Try sample addresses provided

### Issue: "Network error when scanning"

**Cause**: Wrong network selected in wallet

**Solution**:
- Switch to Polygon Mumbai (80001) for scanning
- Use Polygon Amoy (80002) for intent submission
- Ensure wallet is connected

### Issue: "Transaction failed"

**Cause**: Insufficient testnet tokens

**Solution**:
- Get more testnet MATIC from faucet
- Wait for faucet cooldown (24 hours)
- Request tokens on Discord #faucet channel

---

## 📈 What to Test & Report

### Critical Tests ✅

1. **Live Price Oracle**
   - [ ] Prices display correctly
   - [ ] Updates work every 30 seconds
   - [ ] Confidence scores make sense
   - [ ] No stale data warnings

2. **Liquidation Scanner**
   - [ ] Can scan any valid address
   - [ ] Health factor calculates correctly
   - [ ] Liquidatable positions flagged
   - [ ] Profit estimates seem reasonable

3. **Error Handling**
   - [ ] Invalid addresses rejected
   - [ ] Network errors handled gracefully
   - [ ] Loading states show correctly
   - [ ] Error messages are clear

4. **Performance**
   - [ ] Scanner responds in < 5 seconds
   - [ ] Price updates don't lag
   - [ ] UI remains responsive
   - [ ] No memory leaks

### Report Your Findings

**Format**:
```markdown
**Feature**: [Live Scanner / Live Prices / etc]
**Issue**: [Brief description]
**Expected**: [What should happen]
**Actual**: [What actually happened]
**Steps**:
1. Step one
2. Step two
**Screenshot**: [If applicable]
```

**Submit to**:
- GitHub Issues: [Project Repository]
- Discord: #testing channel
- Include your wallet address for NFT rewards

---

## 🏆 Testing Rewards

Help us test and earn rewards!

### Reward Tiers

| Activity | Reward |
|----------|--------|
| Test 5+ features | 🥇 Exclusive NFT Badge |
| Report critical bug | 🏆 Mainnet Airdrop + Special Role |
| Top 10 testers | ⭐ Early Access + Recognition |
| Active participation | 🎖️ Community Role + Thanks |

### How to Qualify

1. **Test thoroughly**: Use Live Scanner and Live Prices extensively
2. **Report bugs**: Submit detailed bug reports with reproduction steps
3. **Provide feedback**: Share what works well and what doesn't
4. **Engage with community**: Help other testers, share findings
5. **Document**: Screenshots, videos, detailed descriptions

---

## 🔧 Technical Details

### Architecture

```
┌─────────────────────────────────────────┐
│           zkLiquidate Frontend          │
│         (React + TypeScript)            │
└───────────────┬─────────────────────────┘
                │
    ┌───────────┴───────────┐
    │                       │
┌───▼────────────┐  ┌──────▼──────────┐
│  Chainlink     │  │  Aave V3        │
│  Price Feeds   │  │  Protocol       │
│  (Mumbai)      │  │  (Mumbai)       │
└────────────────┘  └─────────────────┘
    │                       │
    └───────────┬───────────┘
                │
    ┌───────────▼───────────┐
    │  zkLiquidate Contracts│
    │  (Amoy + zkEVM)       │
    └───────────────────────┘
```

### Contract Addresses

**Aave V3 (Polygon Mumbai)**:
- Pool: `0x6C9fB0D5bD9429eb9Cd96B85B81d872281771E6B`
- Data Provider: `0xC69728f11E9E6127733751c8410432913123acf1`

**Chainlink (Polygon Mumbai)**:
- See "Live Prices" section for all price feed addresses

**zkLiquidate (Polygon Amoy)**:
- Intent Registry: `0x831F6F30cc0Aa68a9541B79c2289BF748DEC4a2a`
- Liquidation Executor: `0x6cFe23FA3ed2D3df4ae2a4A2686514Fa8E634A9B`

**zkLiquidate (Polygon zkEVM)**:
- ZK Verifier: `0x8C935B982416673cF9633DdCC4E9Dc4ec2846Ab2`

---

## 📚 Additional Resources

- **Aave V3 Docs**: https://docs.aave.com/developers/
- **Chainlink Price Feeds**: https://docs.chain.link/data-feeds
- **Polygon Mumbai**: https://wiki.polygon.technology/docs/develop/network-details/network/
- **zkLiquidate Whitepaper**: https://zk-cross-liquidate.vercel.app/whitepaper

---

## 💬 Get Help

- **Discord**: #support channel
- **GitHub**: Open an issue
- **Email**: testing@zkliquidate.xyz
- **Twitter**: @zkLiquidate

---

## 🎉 Start Testing!

You're all set! Head to the dashboard and start exploring real liquidation opportunities:

**Dashboard**: https://zk-cross-liquidate.vercel.app/dashboard

Remember:
- ✅ This is testnet - no real money involved
- ✅ Test thoroughly and report issues
- ✅ Earn NFT rewards and recognition
- ✅ Help us build the best liquidation protocol

**Happy Testing! 🚀**

---

**Last Updated**: January 16, 2026
**Version**: 2.0 - Real-World Integrations
