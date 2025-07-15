// aaveHelper.js – Sepolia ETH + Aave v3 + Thirdweb SDK

import {
  getContract,
  prepareContractCall,
  sendTransaction,
  readContract,
  toWei,
} from "thirdweb";
import { polygonAmoy } from "thirdweb/chains";

// 🔗 Contract addresses for Polygon Amoy testnet Aave v3
export const CONTRACTS = {
  AAVE_POOL: "0x6Ae43d3271ff6888e7Fc43Fd7321a503ff738951",
  WETH_GATEWAY: "0x1e4b7A6b903680eAb0c5dAbcb8fD429cD2a9598c", // Need to find correct Amoy address
  WMATIC: "0x360ad4f9a9A8EFe9A8DCB5f461c4Cc1047E1Dcf9",
  USDC: "0x41e94eb019c0762f9bfcf9fb1e58725bfb0e7582",
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
  getContract({ client, chain: polygonAmoy, address, abi: ERC20_ABI });

const getPoolContract = (client) =>
  getContract({ client, chain: polygonAmoy, address: CONTRACTS.AAVE_POOL, abi: AAVE_POOL_ABI });

const getWethGatewayContract = (client) =>
  getContract({ client, chain: polygonAmoy, address: CONTRACTS.WETH_GATEWAY, abi: WETH_GATEWAY_ABI });

// ✅ Supply MATIC (as collateral) - Input amount in USD  
export const supplySepoliaETH = async (account, usdAmount) => {
  const { client } = await import("../components/thirdweb/thirdwebClient.js");
  if (!client) throw new Error("Thirdweb client not configured");

  const maticAmount = usdToMatic(usdAmount);
  console.log(`Converting $${usdAmount} USD to ${maticAmount} MATIC`);

  // Use the pool contract directly for WMATIC supply
  const contract = getPoolContract(client);
  
  // First we need to get WMATIC by swapping or depositing
  // For now, let's use a direct supply approach with WMATIC
  const tx = await prepareContractCall({
    contract,
    method: "supply",
    params: [CONTRACTS.WMATIC, safeToWei(maticAmount), account.address, 0],
  });

  const result = await sendTransaction({ transaction: tx, account });

  // 🔍 Validate if collateral registered
  const data = await readContract({
    contract,
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
