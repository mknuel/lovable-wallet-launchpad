// aaveHelper.js – Sepolia ETH + Aave v3 + Thirdweb SDK

import {
  getContract,
  prepareContractCall,
  sendTransaction,
  readContract,
  toWei,
} from "thirdweb";
import { polygon } from "thirdweb/chains";

// 🔗 Contract addresses for Polygon mainnet Aave v3
export const CONTRACTS = {
  AAVE_POOL: "0x794a61358D6845594F94dc1DB02A252b5b4814aD",
  WETH_GATEWAY: "0x1e4b7A6b903680eAb0c5dAbcb8fD429cD2a9598c", 
  WMATIC: "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
  USDC: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
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
const MATIC_PRICE_USD = 1.2; // Mock MATIC price for conversion

const usdToMatic = (usdAmount) => {
  return (parseFloat(usdAmount) / MATIC_PRICE_USD).toString();
};

const safeToWei = (amount) => {
  const numAmount = parseFloat(amount);
  console.log('safeToWei input:', amount, 'parsed:', numAmount);
  
  if (!amount || isNaN(numAmount) || numAmount <= 0) {
    throw new Error(`Invalid amount: ${amount}`);
  }
  
  const result = toWei(numAmount.toString());
  console.log('safeToWei result:', result);
  return result;
};

const getTokenContract = (client, address) =>
  getContract({ client, chain: polygon, address, abi: ERC20_ABI });

const getPoolContract = (client) =>
  getContract({ client, chain: polygon, address: CONTRACTS.AAVE_POOL, abi: AAVE_POOL_ABI });

const getWethGatewayContract = (client) =>
  getContract({ client, chain: polygon, address: CONTRACTS.WETH_GATEWAY, abi: WETH_GATEWAY_ABI });

// ✅ Supply MATIC (as collateral) - Input amount in USD
export const supplySepoliaETH = async (account, usdAmount) => {
  const { client } = await import("../components/thirdweb/thirdwebClient.js");
  if (!client) throw new Error("Thirdweb client not configured");

  const maticAmount = usdToMatic(usdAmount);
  console.log(`Converting $${usdAmount} USD to ${maticAmount} MATIC`);

  const contract = getWethGatewayContract(client);
  const tx = await prepareContractCall({
    contract,
    method: "depositETH",
    params: [CONTRACTS.AAVE_POOL, account.address, 0],
    value: safeToWei(maticAmount),
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
    message: `Supplied $${usdAmount} USD (${maticAmount} MATIC) successfully`,
    txHash: result.transactionHash,
  };
};

// ✅ Borrow WMATIC - Input amount in USD
export const borrowETH = async (account, usdAmount) => {
  const { client } = await import("../components/thirdweb/thirdwebClient.js");
  if (!client) throw new Error("Thirdweb client not configured");

  const maticAmount = usdToMatic(usdAmount);
  console.log(`Converting $${usdAmount} USD to ${maticAmount} MATIC for borrowing`);

  const contract = getPoolContract(client);
  const tx = await prepareContractCall({
    contract,
    method: "borrow",
    params: [CONTRACTS.WMATIC, safeToWei(maticAmount), 2, 0, account.address],
  });

  const result = await sendTransaction({ transaction: tx, account });

  return {
    success: true,
    message: `Borrowed $${usdAmount} USD (${maticAmount} MATIC) successfully`,
    txHash: result.transactionHash,
  };
};

// ✅ Repay WMATIC - Input amount in USD
export const repayETH = async (account, usdAmount) => {
  const { client } = await import("../components/thirdweb/thirdwebClient.js");
  if (!client) throw new Error("Thirdweb client not configured");

  const maticAmount = usdToMatic(usdAmount);
  console.log(`Converting $${usdAmount} USD to ${maticAmount} MATIC for repayment`);

  const contract = getPoolContract(client);
  const tx = await prepareContractCall({
    contract,
    method: "repay",
    params: [CONTRACTS.WMATIC, safeToWei(maticAmount), 2, account.address],
  });

  const result = await sendTransaction({ transaction: tx, account });

  return {
    success: true,
    message: `Repaid $${usdAmount} USD (${maticAmount} MATIC) successfully`,
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

// ✅ Get test USDC info
export const getTestDAIInfo = () => {
  return {
    address: CONTRACTS.USDC,
    symbol: "USDC",
    name: "USD Coin",
    decimals: 6,
  };
};
