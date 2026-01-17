# 🧪 zkLiquidate Community Testing Guide

Welcome to zkLiquidate's Phase 1 testnet! This guide will help you test our protocol and provide valuable feedback.

## 🎯 Testing Objectives

Help us validate:
1. ✅ Smart contract functionality and security
2. ✅ ZK proof verification system
3. ✅ AI risk scoring accuracy
4. ✅ User experience and interface
5. ✅ Cross-chain liquidation flow
6. ✅ Insurance pool mechanics
7. ✅ Performance and gas optimization

## 🚀 Quick Start

### Prerequisites

1. **Web3 Wallet**
   - Install [MetaMask](https://metamask.io/) or any compatible wallet
   - Create or import a wallet

2. **Testnet Tokens**
   - Get Polygon Amoy testnet tokens: https://faucet.polygon.technology/
   - Get Polygon zkEVM testnet tokens: https://faucet.polygon.technology/
   - Recommended: Get at least 10 testnet tokens on each network

3. **Network Configuration**

   **Polygon Amoy Testnet**:
   ```
   Network Name: Polygon Amoy Testnet
   RPC URL: https://rpc-amoy.polygon.technology
   Chain ID: 80002
   Currency: MATIC
   Explorer: https://amoy.polygonscan.com/
   ```

   **Polygon zkEVM Testnet**:
   ```
   Network Name: Polygon zkEVM Testnet
   RPC URL: https://rpc.public.zkevm-test.net
   Chain ID: 1442
   Currency: ETH
   Explorer: https://testnet-zkevm.polygonscan.com/
   ```

### Access the Application

1. Visit: **[https://zk-cross-liquidate.vercel.app](https://zk-cross-liquidate.vercel.app)**
2. Click "Connect Wallet" in the top right
3. Select your wallet and approve the connection
4. Make sure you're on Polygon Amoy or zkEVM testnet

## 🧩 Testing Scenarios

### Scenario 1: Basic Intent Submission

**Objective**: Test the liquidation intent creation flow

**Steps**:
1. Navigate to Dashboard
2. Go to "Intent Registry" tab
3. Click "Submit New Intent"
4. Fill in the form:
   - Target Address: `0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb`
   - Health Factor: `0.95` (below 1.0 = liquidatable)
   - Min Price: `2500`
   - Bond Amount: `5` POL
5. Click "Submit Intent"
6. Approve the transaction in your wallet
7. Wait for confirmation

**Expected Result**:
- Transaction succeeds
- Intent appears in the registry with "Pending" status
- Your wallet is charged the bond amount + gas

**What to Test**:
- [ ] Form validation works correctly
- [ ] Transaction completes successfully
- [ ] Intent appears in the list
- [ ] Bond amount is deducted from wallet
- [ ] Error messages are clear if something fails

---

### Scenario 2: ZK Proof Verification

**Objective**: Test the zero-knowledge proof verification system

**Steps**:
1. Find a "Pending" intent in the registry
2. Click "Verify with ZK Proof"
3. Approve the verification transaction (small fee ~0.03 POL)
4. Wait for zkEVM verification (~4-5 seconds)
5. Check intent status changes to "Verified"

**Expected Result**:
- Verification completes quickly (< 10 seconds)
- Intent status updates to "Verified"
- Verification cost is ~$0.03
- Proof hash appears in the details

**What to Test**:
- [ ] Verification speed is acceptable
- [ ] Gas costs are reasonable
- [ ] Status updates correctly
- [ ] Verification can be seen on zkEVM explorer
- [ ] Invalid intents are rejected

---

### Scenario 3: Liquidation Execution

**Objective**: Test the actual liquidation execution flow

**Steps**:
1. Find a "Verified" intent
2. Click "Execute Liquidation"
3. Confirm the execution details
4. Approve the transaction
5. Wait for execution and profit distribution

**Expected Result**:
- Execution completes successfully
- Profit is calculated and displayed
- Intent status becomes "Executed"
- Reputation score increases
- Execution appears in analytics

**What to Test**:
- [ ] Execution succeeds without errors
- [ ] Profit calculation is accurate
- [ ] Gas costs are displayed correctly
- [ ] Reputation updates properly
- [ ] Transaction can be verified on explorer

---

### Scenario 4: Liquidation Simulator

**Objective**: Test the simulation tool before real execution

**Steps**:
1. Go to "Simulator" tab
2. Enter a target address
3. Set a health factor (try various values)
4. Click "Run Simulation"
5. Review the results:
   - Estimated profit
   - Gas costs
   - Success probability
   - Recommended execution time

**Expected Result**:
- Simulation completes instantly
- Profit and cost estimates are realistic
- Success probability is calculated
- No gas costs for simulation

**What to Test**:
- [ ] Simulation is fast (< 2 seconds)
- [ ] Estimates seem reasonable
- [ ] Different inputs give different results
- [ ] Warnings appear for risky liquidations
- [ ] Can simulate multiple scenarios

---

### Scenario 5: Automated Bot Configuration

**Objective**: Test the automated liquidation bot settings

**Steps**:
1. Go to "Bot Settings" tab
2. Configure your bot:
   - Min Health Factor: `0.8`
   - Max Health Factor: `0.98`
   - Min Profit: `50` POL
   - Target Chains: Select both Polygon PoS and zkEVM
   - Auto Execute: Toggle on/off
3. Save configuration
4. Monitor bot activity

**Expected Result**:
- Configuration saves successfully
- Bot respects the configured parameters
- Notifications work (if enabled)
- Can enable/disable easily

**What to Test**:
- [ ] Settings save and persist
- [ ] Bot follows configured rules
- [ ] Can enable/disable bot
- [ ] Notifications are timely
- [ ] Performance is stable

---

### Scenario 6: Insurance Pool Staking

**Objective**: Test the insurance pool and staking mechanism

**Steps**:
1. Go to "Insurance Pool" section
2. Review current pool statistics
3. Click "Stake Tokens"
4. Enter amount (minimum 10 POL)
5. Approve staking transaction
6. Monitor rewards accumulation

**Expected Result**:
- Staking succeeds
- Pool statistics update
- APY is displayed (12.5%)
- Can view your stake
- Rewards accrue over time

**What to Test**:
- [ ] Staking transaction works
- [ ] Pool stats are accurate
- [ ] Rewards calculation is correct
- [ ] Can unstake later
- [ ] Multiple stakes are tracked

---

### Scenario 7: Analytics & Reputation

**Objective**: Test the analytics dashboard and reputation system

**Steps**:
1. Perform several liquidations
2. Check the Analytics tab
3. Review:
   - 7-day performance chart
   - Volume and profit metrics
   - Success rate
   - Gas cost trends
4. Check your reputation score
5. View earned badges

**Expected Result**:
- Charts display data correctly
- Metrics are accurate
- Reputation increases with successful liquidations
- Badges are awarded appropriately

**What to Test**:
- [ ] Charts render correctly
- [ ] Data is accurate
- [ ] Real-time updates work
- [ ] Reputation calculation is fair
- [ ] Badges unlock appropriately

---

### Scenario 8: Cross-Chain Testing

**Objective**: Test liquidations across different chains

**Steps**:
1. Switch between Polygon Amoy and zkEVM networks
2. Submit intents on both chains
3. Verify proofs on zkEVM
4. Execute on target chain
5. Verify cross-chain state consistency

**Expected Result**:
- Can operate on both networks
- State syncs correctly
- Verification works cross-chain
- No duplicate executions

**What to Test**:
- [ ] Network switching works smoothly
- [ ] Intents are chain-specific
- [ ] Cross-chain verification functions
- [ ] No state inconsistencies
- [ ] Gas costs differ by chain

---

## 🐛 Reporting Issues

### What to Report

**Critical Issues** (Report immediately):
- Lost funds or unauthorized transfers
- Smart contract exploits
- Authentication bypasses
- Data corruption

**High Priority**:
- Transaction failures
- Incorrect calculations
- Verification errors
- Performance issues

**Medium Priority**:
- UI/UX bugs
- Display errors
- Slow loading
- Confusing error messages

**Low Priority**:
- Visual glitches
- Typos
- Feature requests
- Minor inconveniences

### How to Report

1. **For Security Issues**: Use our [Bug Bounty Program](./BUG_BOUNTY.md)

2. **For General Bugs**: Create a GitHub issue with:
   ```markdown
   **Bug Description**: [Clear description]
   **Steps to Reproduce**:
   1. Step one
   2. Step two

   **Expected Behavior**: [What should happen]
   **Actual Behavior**: [What actually happens]
   **Screenshots**: [If applicable]
   **Wallet Address**: [For reproducibility]
   **Network**: [Amoy / zkEVM]
   **Transaction Hash**: [If applicable]
   ```

3. **For Feature Requests**: Use GitHub Discussions

4. **For Quick Questions**: Join our [Discord](https://discord.gg/zkliquidate)

## 📊 Testing Checklist

Use this checklist to track your testing progress:

### Core Functionality
- [ ] Submit liquidation intent
- [ ] Verify ZK proof
- [ ] Execute liquidation
- [ ] Claim rewards
- [ ] Stake in insurance pool
- [ ] Unstake from pool

### AI & Analytics
- [ ] Run liquidation simulation
- [ ] Check AI risk scores
- [ ] Review profit predictions
- [ ] Monitor analytics dashboard
- [ ] Track reputation changes

### Bot & Automation
- [ ] Configure bot settings
- [ ] Enable automated execution
- [ ] Test notification system
- [ ] Adjust thresholds
- [ ] Disable bot

### Cross-Chain
- [ ] Switch between networks
- [ ] Submit on Polygon Amoy
- [ ] Verify on zkEVM
- [ ] Check state consistency
- [ ] Monitor gas costs

### Edge Cases
- [ ] Submit with insufficient funds
- [ ] Try duplicate submissions
- [ ] Test with invalid inputs
- [ ] Attempt unauthorized access
- [ ] Stress test with multiple actions

## 🏆 Rewards for Testers

Active testers who provide valuable feedback will receive:

1. **Early Access**: Priority access to mainnet launch
2. **NFT Badges**: Exclusive testnet participant NFTs
3. **Reputation Boost**: Starting reputation bonus on mainnet
4. **Governance Rights**: Voting power in protocol decisions
5. **Testnet SWAG**: Top testers get exclusive merchandise

### How to Qualify

- Complete at least 10 liquidations
- Report at least 3 bugs or suggestions
- Participate in community discussions
- Share feedback in our Discord
- Test across multiple networks

## 📚 Additional Resources

- **Documentation**: [Deployment Guide](./DEPLOYMENT_GUIDE.md)
- **Smart Contracts**: [View on GitHub](../contracts/)
- **Bug Bounty**: [Security Program](./BUG_BOUNTY.md)
- **Whitepaper**: [Read Full Whitepaper](https://zk-cross-liquidate.vercel.app/whitepaper)
- **Discord**: [Join Community](https://discord.gg/zkliquidate)
- **Twitter**: [@zkLiquidate](https://twitter.com/zkliquidate)

## ❓ FAQ

**Q: How much testnet tokens do I need?**
A: At least 10 testnet tokens on each network for thorough testing.

**Q: Are there any costs?**
A: No real costs! Everything uses testnet tokens which have no monetary value.

**Q: Can I test on mainnet?**
A: NO! Only use testnets. Mainnet testing is prohibited and will disqualify you from rewards.

**Q: How long should testing take?**
A: Plan for 2-4 hours to thoroughly test all features.

**Q: What if I break something?**
A: That's the point! Report it and help us fix it before mainnet.

**Q: Will my testnet progress carry to mainnet?**
A: Your reputation and achievements will be recognized, but balances will reset.

## 🙏 Thank You!

Your testing and feedback are invaluable to making zkLiquidate secure and user-friendly. Together, we're building the future of cross-chain liquidations!

**Happy Testing! 🚀**

---

**Questions?** Reach out on [Discord](https://discord.gg/zkliquidate) or email testing@zkliquidate.xyz

**Last Updated**: January 2026
**Version**: 1.0
