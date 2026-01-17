# 🐛 zkLiquidate Bug Bounty Program

## Overview

Welcome to the zkLiquidate Bug Bounty Program! We're committed to building the most secure cross-chain liquidation protocol, and we need the community's help to identify vulnerabilities before they can be exploited.

**Program Status**: 🟢 Active
**Total Rewards Pool**: $50,000 USD (in POL tokens)
**Program Duration**: Ongoing during Phase 1 testnet period

## 🎯 Scope

### In Scope

The following components are eligible for bug bounty rewards:

#### Smart Contracts (Priority)
- **IntentRegistry.sol** (`0x831F6F30cc0Aa68a9541B79c2289BF748DEC4a2a` on Polygon Amoy)
- **ZKVerifier.sol** (`0x8C935B982416673cF9633DdCC4E9Dc4ec2846Ab2` on Polygon zkEVM)
- **LiquidationExecutor.sol** (`0x6cFe23FA3ed2D3df4ae2a4A2686514Fa8E634A9B` on Polygon Amoy)

#### Backend Systems
- Convex database queries and mutations
- Authentication and authorization logic
- AI risk scoring algorithms
- Insurance pool calculations

#### Frontend
- XSS and injection vulnerabilities
- Authentication bypasses
- Wallet connection exploits

### Out of Scope

- Known issues already documented
- Spam or social engineering
- DDoS attacks
- Issues in third-party dependencies
- UI/UX bugs without security implications
- Gas optimization suggestions (submit as enhancements instead)

## 💰 Reward Structure

Rewards are based on severity and impact using the CVSS scoring system:

| Severity | Description | Reward Range |
|----------|-------------|--------------|
| **Critical** | Direct theft of funds, complete protocol takeover, permanent DoS | $5,000 - $15,000 |
| **High** | Theft of unclaimed yield, unauthorized state changes, temporary DoS | $2,000 - $5,000 |
| **Medium** | Griefing attacks, data exposure, indirect fund loss | $500 - $2,000 |
| **Low** | Minor bugs, information disclosure | $100 - $500 |

### Bonus Rewards

- **First Blood**: +50% bonus for first critical vulnerability found
- **Chain Reaction**: +25% bonus for reporting multiple related vulnerabilities
- **Detailed Report**: +10% bonus for exceptional documentation and PoC

## 🔍 Vulnerability Categories

### Critical Vulnerabilities

1. **Smart Contract Exploits**
   - Reentrancy attacks
   - Integer overflow/underflow
   - Access control bypass
   - Signature replay attacks
   - Cross-function reentrancy

2. **ZK Proof Manipulation**
   - Invalid proof acceptance
   - Proof forgery
   - Verification bypass

3. **Economic Exploits**
   - Flash loan attacks
   - Oracle manipulation
   - MEV exploitation beyond design
   - Insurance pool drainage

### High Severity

1. **Authorization Issues**
   - Privilege escalation
   - Intent execution by unauthorized parties
   - Staking manipulation

2. **State Management**
   - Inconsistent cross-chain state
   - Race conditions
   - Nonce manipulation

### Medium Severity

1. **Data Integrity**
   - Incorrect liquidation calculations
   - Health factor miscalculation
   - Reputation system gaming

2. **Frontend Security**
   - XSS vulnerabilities
   - CSRF attacks
   - Wallet signature phishing

## 📝 Submission Guidelines

### Required Information

1. **Vulnerability Description**
   - Clear title and summary
   - Affected component(s)
   - Severity assessment

2. **Reproduction Steps**
   - Step-by-step instructions
   - Required preconditions
   - Expected vs actual behavior

3. **Proof of Concept**
   - Code snippets or scripts
   - Transaction hashes (for on-chain issues)
   - Screenshots or videos

4. **Impact Assessment**
   - Potential damage
   - Affected users/funds
   - Likelihood of exploitation

5. **Recommended Fix**
   - Suggested mitigation
   - Code patches (if applicable)

### Submission Process

1. **DO NOT** publicly disclose the vulnerability
2. Submit report via email: security@zkliquidate.xyz
3. Include wallet address for reward payment
4. Wait for acknowledgment (within 48 hours)
5. Coordinate disclosure timeline with team

### Submission Template

```markdown
## Vulnerability Title
[Clear, descriptive title]

## Severity
[Critical / High / Medium / Low]

## Component
[IntentRegistry / ZKVerifier / LiquidationExecutor / Frontend / Backend]

## Description
[Detailed explanation of the vulnerability]

## Impact
[What can an attacker do? How much damage?]

## Reproduction Steps
1. Step one
2. Step two
3. ...

## Proof of Concept
[Code, transactions, or screenshots]

## Recommended Fix
[Your suggested solution]

## Contact Information
- Name/Pseudonym:
- Email:
- Wallet Address (for rewards):
```

## ⚖️ Rules and Terms

### Eligibility

- Must be the first to report the vulnerability
- Must follow responsible disclosure practices
- Cannot be a team member or close associate
- Must comply with local laws

### Responsible Disclosure

1. **Report First**: Always report to us before public disclosure
2. **Give Us Time**: Allow 90 days for fix implementation
3. **No Exploitation**: Do not exploit vulnerabilities beyond PoC
4. **Minimal Impact**: Use testnet only, avoid mainnet testing
5. **Privacy**: Do not access or modify user data

### Disqualifications

Reports will be rejected if:
- Already known or reported
- Out of scope
- Theoretical without PoC
- Requires social engineering
- Violates laws or terms
- Uses mainnet for testing (testnet only!)

## 🏆 Hall of Fame

We'll publicly recognize security researchers who help make zkLiquidate more secure:

| Researcher | Vulnerabilities Found | Severity | Reward |
|------------|----------------------|----------|---------|
| *Your name here* | - | - | - |

## 📞 Contact

- **Security Email**: security@zkliquidate.xyz
- **Discord**: [zkLiquidate Community](https://discord.gg/zkliquidate)
- **Twitter**: [@zkLiquidate](https://twitter.com/zkliquidate)

## 🔐 PGP Key

For encrypted submissions, use our PGP public key:

```
-----BEGIN PGP PUBLIC KEY BLOCK-----
[PGP Key to be added]
-----END PGP PUBLIC KEY BLOCK-----
```

## ⚠️ Legal Disclaimer

This bug bounty program is discretionary. We reserve the right to:
- Modify or cancel the program at any time
- Adjust reward amounts based on impact
- Reject submissions that don't meet criteria
- Change terms and conditions

Participation constitutes acceptance of these terms.

---

## 🚀 Getting Started

1. **Explore**: Review our [documentation](./DEPLOYMENT_GUIDE.md) and smart contracts
2. **Test**: Use Polygon Amoy and zkEVM testnets
3. **Report**: Found something? Submit responsibly
4. **Get Rewarded**: Receive recognition and rewards

Thank you for helping secure the future of cross-chain liquidations!

**Last Updated**: January 2026
**Version**: 1.0
