# Contract Verification Guide for Wave 5 V2

## Deployed Addresses

```
IntentRegistryV2: 0x320A2dC1b4a56D13438578e3aC386ed90Ca21D27
LiquidationExecutorV2: 0x6cFe23FA3ed2D3df4ae2a4A2686514Fa8E634A9B
Network: Polygon Amoy Testnet (Chain ID: 80002)
```

---

## Method 1: Remix Plugin (Easiest)

### Step 1: Get PolygonScan API Key

1. Go to https://polygonscan.com/register
2. Create free account
3. Go to https://polygonscan.com/myapikey
4. Create new API key
5. Copy the key

### Step 2: Verify IntentRegistryV2

1. In Remix, click "Plugin Manager" (plug icon)
2. Activate "CONTRACT VERIFICATION - ETHERSCAN"
3. In the plugin panel:
   - **Contract**: Select "IntentRegistryV2"
   - **Contract Address**: `0x320A2dC1b4a56D13438578e3aC386ed90Ca21D27`
   - **Network**: Polygon Amoy Testnet
   - **API Key**: Paste your PolygonScan API key
4. Click "Verify Contract"
5. Wait for confirmation ✅

### Step 3: Verify LiquidationExecutorV2

1. Same plugin
2. Settings:
   - **Contract**: Select "LiquidationExecutorV2"
   - **Contract Address**: `0x6cFe23FA3ed2D3df4ae2a4A2686514Fa8E634A9B`
   - **Network**: Polygon Amoy Testnet
   - **API Key**: Same key
3. Click "Verify Contract"
4. Wait for confirmation ✅

---

## Method 2: Manual Verification (If Plugin Fails)

### Verify IntentRegistryV2

1. Go to: https://amoy.polygonscan.com/address/0x320A2dC1b4a56D13438578e3aC386ed90Ca21D27#code
2. Click "Verify and Publish"
3. Fill in:
   - **Compiler Type**: Solidity (Single file)
   - **Compiler Version**: v0.8.20+commit.a1b79de6
   - **Open Source License Type**: MIT License (MIT)
   - **Optimization**: Yes
   - **Runs**: 200
4. Paste IntentRegistryV2 source code (from V2_CONTRACTS_CODE.md)
5. No constructor arguments needed
6. Click "Verify and Publish"

### Verify LiquidationExecutorV2

1. Go to: https://amoy.polygonscan.com/address/0x6cFe23FA3ed2D3df4ae2a4A2686514Fa8E634A9B#code
2. Click "Verify and Publish"
3. Fill in:
   - **Compiler Type**: Solidity (Single file)
   - **Compiler Version**: v0.8.20+commit.a1b79de6
   - **Open Source License Type**: MIT License (MIT)
   - **Optimization**: Yes
   - **Runs**: 200
4. Paste LiquidationExecutorV2 source code (see below)
5. **Constructor Arguments**: Click "Encoded view" and paste:
   ```
   0000000000000000000000000320a2dc1b4a56d13438578e3ac386ed90ca21d270000000000000000000000006ae43d3271ff6888e7fc43fd7321a503ff7389510000000000000000000000c100cd5b25b9b0f10f3d06e42f3ded22a6dd5db6
   ```
6. Click "Verify and Publish"

---

## Constructor Arguments (ABI-Encoded)

For LiquidationExecutorV2:

**Raw Arguments:**
```
_intentRegistry: 0x320A2dC1b4a56D13438578e3aC386ed90Ca21D27
_aavePool: 0x6Ae43d3271ff6888e7Fc43Fd7321a503ff738951
_aaveOracle: 0xc100cd5b25b9b0f10f3d06e42f3ded22a6dd5db6
```

**ABI-Encoded (for verification):**
```
0000000000000000000000000320a2dc1b4a56d13438578e3ac386ed90ca21d270000000000000000000000006ae43d3271ff6888e7fc43fd7321a503ff7389510000000000000000000000c100cd5b25b9b0f10f3d06e42f3ded22a6dd5db6
```

---

## After Verification

Once verified, you'll see:
- ✅ Green checkmark on PolygonScan
- "Contract Source Code Verified" badge
- Readable contract code on explorer
- Ability to interact via "Read Contract" and "Write Contract" tabs

**Verify at:**
- IntentRegistryV2: https://amoy.polygonscan.com/address/0x320A2dC1b4a56D13438578e3aC386ed90Ca21D27
- LiquidationExecutorV2: https://amoy.polygonscan.com/address/0x6cFe23FA3ed2D3df4ae2a4A2686514Fa8E634A9B

---

## Troubleshooting

### "Compiler version mismatch"
- Make sure you select: **v0.8.20+commit.a1b79de6**
- Optimization must be: **Enabled, 200 runs**

### "Constructor arguments invalid"
- Use the ABI-encoded version above
- Make sure there are no spaces or line breaks

### "Bytecode does not match"
- Check compiler settings match exactly
- Verify optimization is enabled with 200 runs
- Ensure you're using the exact source code that was deployed

---

## Quick Links

- PolygonScan API Keys: https://polygonscan.com/myapikey
- Amoy Testnet Explorer: https://amoy.polygonscan.com
- Remix Verification Plugin: Search "etherscan" in Plugin Manager

---

**Status after verification:**
- ✅ IntentRegistryV2: Verified
- ✅ LiquidationExecutorV2: Verified
- Ready for Wave 5 submission!
