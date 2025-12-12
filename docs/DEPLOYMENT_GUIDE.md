# zkLiquidate Protocol - Complete Deployment Guide

## Overview
This guide walks you through deploying the zkLiquidate protocol to Polygon testnets. We've minimized the number of contracts to 3 core contracts for simplicity while maintaining full functionality.

**You can deploy these contracts using either:**
- **Remix IDE** (Recommended for beginners - no local setup required)
- **Hardhat/Foundry** (For advanced users with local development environment)

## Architecture Summary

### Smart Contracts (Minimized to 3)
1. **IntentRegistry.sol** (Polygon Amoy Testnet) - Intent submission, staking, and registry
   - **Deployed at**: `0x831F6F30cc0Aa68a9541B79c2289BF748DEC4a2a`
2. **ZKVerifier.sol** (Polygon zkEVM Testnet) - ZK proof verification and validation
   - **Deployed at**: `0x8C935B982416673cF9633DdCC4E9Dc4ec2846Ab2`
3. **LiquidationExecutor.sol** (Polygon Amoy Testnet) - Execution, insurance pool, and rewards
   - **Deployed at**: `0x6cFe23FA3ed2D3df4ae2a4A2686514Fa8E634A9B`

**Note:** We've combined AggLayerExecutor + InsurancePool into LiquidationExecutor to minimize deployments.

## Prerequisites

### Option A: Remix IDE (Recommended - No Installation Required)

1. **Browser Wallet**
   - Install MetaMask browser extension
   - Create or import a wallet

2. **Testnet Tokens**
   - Get Polygon Amoy (PoS) testnet tokens: https://faucet.polygon.technology/
   - Get Polygon zkEVM testnet tokens: https://faucet.polygon.technology/

3. **Network Configuration in MetaMask**
   
   **Polygon Amoy (PoS Testnet):**
   - Network Name: `Polygon Amoy Testnet`
   - RPC URL: `https://rpc-amoy.polygon.technology`
   - Chain ID: `80002`
   - Currency Symbol: `MATIC`
   - Block Explorer: `https://amoy.polygonscan.com/`

   **Polygon zkEVM Testnet:**
   - Network Name: `Polygon zkEVM Testnet`
   - RPC URL: `https://rpc.public.zkevm-test.net`
   - Chain ID: `1442`
   - Currency Symbol: `ETH`
   - Block Explorer: `https://testnet-zkevm.polygonscan.com/`

### Option B: Hardhat/Foundry (Advanced Users)

1. **Development Environment Setup**
   - Install Hardhat and Foundry
   - Configure your local development environment
   - Set up testnet accounts and wallets

2. **Deployment Scripts**
   - Create deployment scripts for each network
   - Configure environment variables

3. **Testing and Validation**
   - Run test cases to verify contract functionality
   - Validate ZK proof verification and execution
   - Test liquidation scenarios and reward distribution

---

## Smart Contract Code

Below are the three core smart contracts. Copy each one into a separate file in Remix IDE.

### 1. IntentRegistry.sol