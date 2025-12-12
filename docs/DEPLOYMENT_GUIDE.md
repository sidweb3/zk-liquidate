# zkLiquidate Protocol - Complete Deployment Guide

## Overview
This guide walks you through deploying the zkLiquidate protocol to Polygon testnets. We've minimized the number of contracts to 3 core contracts for simplicity while maintaining full functionality.

**You can deploy these contracts using either:**
- **Remix IDE** (Recommended for beginners - no local setup required)
- **Hardhat/Foundry** (For advanced users with local development environment)

## Architecture Summary

### Smart Contracts (Minimized to 3)
1. **IntentRegistry.sol** (Polygon PoS Testnet) - Intent submission, staking, and registry
2. **ZKVerifier.sol** (Polygon zkEVM Testnet) - ZK proof verification and validation
3. **LiquidationExecutor.sol** (Polygon PoS Testnet) - Execution, insurance pool, and rewards

**Note:** We've combined AggLayerExecutor + InsurancePool into LiquidationExecutor to minimize deployments.

## Prerequisites

### Option A: Remix IDE (Recommended - No Installation Required)

1. **Browser Wallet**
   - Install MetaMask browser extension
   - Create or import a wallet

2. **Testnet Tokens**
   - Get Polygon Mumbai (PoS) testnet tokens: https://faucet.polygon.technology/
   - Get Polygon zkEVM testnet tokens: https://faucet.polygon.technology/

3. **Network Configuration in MetaMask**
   
   **Polygon Mumbai (PoS Testnet):**
   - Network Name: `Polygon Mumbai`
   - RPC URL: `https://rpc-mumbai.maticvigil.com/`
   - Chain ID: `80001`
   - Currency Symbol: `MATIC`
   - Block Explorer: `https://mumbai.polygonscan.com/`

   **Polygon zkEVM Testnet:**
   - Network Name: `Polygon zkEVM Testnet`
   - RPC URL: `https://rpc.public.zkevm-test.net`
   - Chain ID: `1442`
   - Currency Symbol: `ETH`
   - Block Explorer: `https://testnet-zkevm.polygonscan.com/`

### Option B: Hardhat/Foundry (Advanced Users)

1. **Development Environment Setup**