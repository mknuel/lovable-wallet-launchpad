// aaveHelper.js – Sepolia ETH + Aave v3 + Thirdweb SDK

import {
  getContract,
  prepareContractCall,
  sendTransaction,
  readContract,
  toWei,
} from "thirdweb";
import { sepolia } from "thirdweb/chains";

// 🔗 Contract addresses for Sepolia testnet
export const CONTRACTS = {
  AAVE_POOL: "0x6Ae43d3271ff6888e7Fc43Fd7321a503ff738951",
  WETH_GATEWAY: "0x387d311e47e80b498169e6fb51d3193167d89F7D",
  WETH: "0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14",
  DAI: "0x3e622317f8C93f7328350cF0B56d9eD4C620C5d6",
};

// 🔎 ABIs
const ERC20_ABI = [
  {
    inputs: [{ name: "spender", type: "address" }, { name: "amount", type: "uint256" }],
    name: "approve",
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ name: "owner", type: "address" }, { name: "spender", type: "address" }],
    name: "allowance",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "account", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
];

const AAVE_POOL_ABI = [
  {
    name: "supply",
    type: "function",
    inputs: [
      { name: "asset", type: "address" },
      { name: "amount", type: "uint256" },
      { name: "onBehalfOf", type: "address" },
      { name: "referralCode", type: "uint16" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    name: "borrow",
    type: "function",
    inputs: [
      { name: "asset", type: "address" },
      { name: "amount", type: "uint256" },
      { name: "interestRateMode", type: "uint256" },
      { name: "referralCode", type: "uint16" },
      { name: "onBehalfOf", type: "address" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    name: "repay",
    type: "function",
    inputs: [
      { name: "asset", type: "address" },
      { name: "amount", type: "uint256" },
      { name: "interestRateMode", type: "uint256" },
      { name: "onBehalfOf", type: "address" },
    ],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "nonpayable",
  },
  {
    name: "getUserAccountData",
    type: "function",
    inputs: [{ name: "user", type: "address" }],
    outputs: [
      { name: "totalCollateralETH", type: "uint256" },
      { name: "totalDebtETH", type: "uint256" },
      { name: "availableBorrowsETH", type: "uint256" },
      { name: "currentLiquidationThreshold", type: "uint256" },
      { name: "ltv", type: "uint256" },
      { name: "healthFactor", type: "uint256" },
    ],
    stateMutability: "view",
  },
];

const WETH_GATEWAY_ABI = [
  {
    name: "depositETH",
    type: "function",
    inputs: [
      { name: "pool", type: "address" },
      { name: "onBehalfOf", type: "address" },
      { name: "referralCode", type: "uint16" },
    ],
    outputs: [],
    stateMutability: "payable",
  },
];

// 🔧 Utilities
const safeToWei = (amount) => {
  const str = amount?.toString();
  if (!str || isNaN(str)) throw new Error("Invalid amount");
  return toWei(str);
};

const getTokenContract = (client, address) =>
  getContract({ client, chain: sepolia, address, abi: ERC20_ABI });

const getPoolContract = (client) =>
  getContract({ client, chain: sepolia, address: CONTRACTS.AAVE_POOL, abi: AAVE_POOL_ABI });

const getWethGatewayContract = (client) =>
  getContract({ client, chain: sepolia, address: CONTRACTS.WETH_GATEWAY, abi: WETH_GATEWAY_ABI });

// ✅ Supply ETH (as collateral)
export const supplySepoliaETH = async (account, amount) => {
  const { client } = await import("../components/thirdweb/thirdwebClient.js");
  if (!client) throw new Error("Thirdweb client not configured");

  const contract = getWethGatewayContract(client);
  const tx = await prepareContractCall({
    contract,
    method: "depositETH",
    params: [CONTRACTS.AAVE_POOL, account.address, 0],
    value: safeToWei(amount),
  });

  const result = await sendTransaction({ transaction: tx, account });

  // 🔍 Validate if collateral registered
  const pool = getPoolContract(client);
  const data = await readContract({
    contract: pool,
    method: "getUserAccountData",
    params: [account.address],
  });

  const totalCollateralETH = Number(data.totalCollateralETH) / 1e18;

  if (totalCollateralETH === 0) {
    return {
      success: false,
      message: "Transaction confirmed but no collateral registered. Check transaction or retry.",
      txHash: result.transactionHash,
    };
  }

  return {
    success: true,
    message: `Supplied ${amount} ETH successfully (marked as collateral)`,
    txHash: result.transactionHash,
  };
};

// ✅ Borrow ETH
export const borrowETH = async (account, amount) => {
  const { client } = await import("../components/thirdweb/thirdwebClient.js");
  if (!client) throw new Error("Thirdweb client not configured");

  const contract = getPoolContract(client);
  const tx = await prepareContractCall({
    contract,
    method: "borrow",
    params: [CONTRACTS.WETH, safeToWei(amount), 2, 0, account.address],
  });

  const result = await sendTransaction({ transaction: tx, account });

  return {
    success: true,
    message: `Borrowed ${amount} ETH successfully`,
    txHash: result.transactionHash,
  };
};

// ✅ Repay ETH
export const repayETH = async (account, amount) => {
  const { client } = await import("../components/thirdweb/thirdwebClient.js");
  if (!client) throw new Error("Thirdweb client not configured");

  const contract = getPoolContract(client);
  const tx = await prepareContractCall({
    contract,
    method: "repay",
    params: [CONTRACTS.WETH, safeToWei(amount), 2, account.address],
  });

  const result = await sendTransaction({ transaction: tx, account });

  return {
    success: true,
    message: `Repaid ${amount} ETH successfully`,
    txHash: result.transactionHash,
  };
};

// ✅ Get user account data
export const getUserAccountData = async (userAddress) => {
  const { client } = await import("../components/thirdweb/thirdwebClient.js");
  if (!client) throw new Error("Thirdweb client not configured");

  const contract = getPoolContract(client);
  const data = await readContract({
    contract,
    method: "getUserAccountData",
    params: [userAddress],
  });

  return {
    totalCollateralETH: Number(data.totalCollateralETH) / 1e18,
    totalDebtETH: Number(data.totalDebtETH) / 1e18,
    availableBorrowsETH: Number(data.availableBorrowsETH) / 1e18,
    currentLiquidationThreshold: Number(data.currentLiquidationThreshold),
    ltv: Number(data.ltv),
    healthFactor: Number(data.healthFactor) / 1e18,
  };
};

// ✅ Get token balance
export const getTokenBalance = async (userAddress, tokenAddress) => {
  const { client } = await import("../components/thirdweb/thirdwebClient.js");
  if (!client) throw new Error("Thirdweb client not configured");

  const contract = getTokenContract(client, tokenAddress);
  const balance = await readContract({
    contract,
    method: "balanceOf",
    params: [userAddress],
  });

  return Number(balance) / 1e18;
};

// ✅ Get test DAI info
export const getTestDAIInfo = () => {
  return {
    address: CONTRACTS.DAI,
    symbol: "DAI",
    name: "Dai Stablecoin",
    decimals: 18,
  };
};
