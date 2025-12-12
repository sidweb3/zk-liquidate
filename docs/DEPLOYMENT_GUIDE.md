# zkLiquidate Protocol - Complete Deployment Guide

## Overview
This guide walks you through deploying the zkLiquidate protocol to Polygon testnets. We've minimized the number of contracts to 3 core contracts for simplicity while maintaining full functionality.

## Architecture Summary

### Smart Contracts (Minimized to 3)
1. **IntentRegistry.sol** (Polygon PoS Testnet) - Intent submission, staking, and registry
2. **ZKVerifier.sol** (Polygon zkEVM Testnet) - ZK proof verification and validation
3. **LiquidationExecutor.sol** (Polygon PoS Testnet) - Execution, insurance pool, and rewards

**Note:** We've combined AggLayerExecutor + InsurancePool into LiquidationExecutor to minimize deployments.

## Prerequisites

### 1. Development Environment Setup
