// aaveHelper.js – Sepolia ETH + Aave v3 + Thirdweb SDK

import {
  getContract,
  prepareContractCall,
  sendTransaction,
  readContract,
  toWei,
} from "thirdweb";
import { sepolia } from "thirdweb/chains";

// 🔗 Contract addresses for Ethereum Sepolia testnet Aave v3
export const CONTRACTS = {
  AAVE_POOL: "0x6Ae43d3271ff6888e7Fc43Fd7321a503ff738951",
  WETH_GATEWAY: "0x387d311e47e80b498169e6fb51d3193167d89F7D",
  WETH: "0xC558DBdd856501FCd9aaF1E62eae57A9F0629a3c",
  USDC: "0x94a9D9AC8a22534E3FaCa9F4e7F2E2cf85d5E4C8",
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
const ETH_PRICE_USD = 2400; // Mock ETH price for conversion

const usdToEth = (usdAmount) => {
  return (parseFloat(usdAmount) / ETH_PRICE_USD).toString();
};

const safeToWei = (amount) => {
  const numAmount = parseFloat(amount);
  console.log('safeToWei input:', amount, 'parsed:', numAmount);
  
  if (!amount || isNaN(numAmount) || numAmount <= 0) {
    throw new Error(`Invalid amount: ${amount}`);
  }
  
  // Handle very small amounts by setting a minimum
  const minAmount = 0.001; // 0.001 ETH minimum
  const finalAmount = Math.max(numAmount, minAmount);
  
  // Convert to string with fixed decimals to avoid scientific notation
  const amountStr = finalAmount.toFixed(18);
  const result = toWei(amountStr);
  console.log('safeToWei result:', result);
  return result;
};

const getTokenContract = (client, address) =>
  getContract({ client, chain: sepolia, address, abi: ERC20_ABI });

const getPoolContract = (client) =>
  getContract({ client, chain: sepolia, address: CONTRACTS.AAVE_POOL, abi: AAVE_POOL_ABI });

const getWethGatewayContract = (client) =>
  getContract({ client, chain: sepolia, address: CONTRACTS.WETH_GATEWAY, abi: WETH_GATEWAY_ABI });

// ✅ Supply ETH (as collateral) - Input amount in USD  
export const supplySepoliaETH = async (account, usdAmount) => {
  const { client } = await import("../components/thirdweb/thirdwebClient.js");
  if (!client) throw new Error("Thirdweb client not configured");

  const ethAmount = usdToEth(usdAmount);
  console.log(`🔄 SUPPLY: Converting $${usdAmount} USD to ${ethAmount} ETH`);
  console.log(`🔄 SUPPLY: Account address:`, account.address);

  // Use WETH Gateway for ETH deposits
  const contract = getWethGatewayContract(client);
  console.log(`🔄 SUPPLY: WETH Gateway contract:`, contract);
  
  const tx = await prepareContractCall({
    contract,
    method: "depositETH",
    params: [CONTRACTS.AAVE_POOL, account.address, 0],
    value: safeToWei(ethAmount),
    gas: 150000n, // Set higher gas limit for Sepolia
  });

  console.log(`🔄 SUPPLY: Prepared transaction:`, tx);
  const result = await sendTransaction({ transaction: tx, account });
  console.log(`✅ SUPPLY: Transaction result:`, result);

  // 🔍 Validate if collateral registered
  const poolContract = getPoolContract(client);
  const data = await readContract({
    contract: poolContract,
    method: "getUserAccountData", 
    params: [account.address],
  });

  console.log(`📊 SUPPLY: Account data after supply:`, data);
  const totalCollateralETH = Number(data.totalCollateralETH) / 1e18;
  console.log(`📊 SUPPLY: Total collateral ETH:`, totalCollateralETH);

  if (totalCollateralETH === 0) {
    return {
      success: false,
      message: "Transaction confirmed but no collateral registered. Check transaction or retry.",
      txHash: result.transactionHash,
    };
  }

  const response = {
    success: true,
    message: `Supplied $${usdAmount} USD (${ethAmount} ETH) successfully`,
    txHash: result.transactionHash,
  };
  console.log(`✅ SUPPLY: Final response:`, response);
  return response;
};

// ✅ Borrow WETH - Input amount in USD
export const borrowETH = async (account, usdAmount) => {
  const { client } = await import("../components/thirdweb/thirdwebClient.js");
  if (!client) throw new Error("Thirdweb client not configured");

  const ethAmount = usdToEth(usdAmount);
  console.log(`🔄 BORROW: Converting $${usdAmount} USD to ${ethAmount} ETH for borrowing`);
  console.log(`🔄 BORROW: Account address:`, account.address);

  const contract = getPoolContract(client);
  console.log(`🔄 BORROW: Pool contract:`, contract);

  const tx = await prepareContractCall({
    contract,
    method: "borrow",
    params: [CONTRACTS.WETH, safeToWei(ethAmount), 2, 0, account.address],
    gas: 150000n, // Set higher gas limit for Sepolia
  });

  console.log(`🔄 BORROW: Prepared transaction:`, tx);
  const result = await sendTransaction({ transaction: tx, account });
  console.log(`✅ BORROW: Transaction result:`, result);

  const response = {
    success: true,
    message: `Borrowed $${usdAmount} USD (${ethAmount} ETH) successfully`,
    txHash: result.transactionHash,
  };
  console.log(`✅ BORROW: Final response:`, response);
  return response;
};

// ✅ Repay WETH - Input amount in USD
export const repayETH = async (account, usdAmount) => {
  const { client } = await import("../components/thirdweb/thirdwebClient.js");
  if (!client) throw new Error("Thirdweb client not configured");

  const ethAmount = usdToEth(usdAmount);
  console.log(`🔄 REPAY: Converting $${usdAmount} USD to ${ethAmount} ETH for repayment`);
  console.log(`🔄 REPAY: Account address:`, account.address);

  const contract = getPoolContract(client);
  console.log(`🔄 REPAY: Pool contract:`, contract);

  const tx = await prepareContractCall({
    contract,
    method: "repay",
    params: [CONTRACTS.WETH, safeToWei(ethAmount), 2, account.address],
    gas: 150000n, // Set higher gas limit for Sepolia
  });

  console.log(`🔄 REPAY: Prepared transaction:`, tx);
  const result = await sendTransaction({ transaction: tx, account });
  console.log(`✅ REPAY: Transaction result:`, result);

  const response = {
    success: true,
    message: `Repaid $${usdAmount} USD (${ethAmount} ETH) successfully`,
    txHash: result.transactionHash,
  };
  console.log(`✅ REPAY: Final response:`, response);
  return response;
};

// ✅ Get user account data
export const getUserAccountData = async (userAddress) => {
  const { client } = await import("../components/thirdweb/thirdwebClient.js");
  if (!client) throw new Error("Thirdweb client not configured");

  console.log(`📊 GET_ACCOUNT_DATA: Fetching data for address:`, userAddress);

  try {
    const contract = getPoolContract(client);
    console.log(`📊 GET_ACCOUNT_DATA: Pool contract:`, contract);

    const data = await readContract({
      contract,
      method: "getUserAccountData",
      params: [userAddress],
    });

    console.log(`📊 GET_ACCOUNT_DATA: Raw contract response:`, data);

    // Handle tuple/array response format
    const accountData = {
      totalCollateralETH: Number(data[0]) / 1e18,
      totalDebtETH: Number(data[1]) / 1e18,
      availableBorrowsETH: Number(data[2]) / 1e18,
      currentLiquidationThreshold: Number(data[3]),
      ltv: Number(data[4]),
      healthFactor: Number(data[5]) / 1e18,
    };

    console.log(`📊 GET_ACCOUNT_DATA: Processed account data:`, accountData);
    return accountData;
  } catch (error) {
    console.log("❌ GET_ACCOUNT_DATA: Error fetching account data:", error);
    console.log("📊 GET_ACCOUNT_DATA: No Aave positions found for user, returning zero values");
    // Return zero values if user has no positions
    const zeroData = {
      totalCollateralETH: 0,
      totalDebtETH: 0,
      availableBorrowsETH: 0,
      currentLiquidationThreshold: 0,
      ltv: 0,
      healthFactor: 0,
    };
    console.log(`📊 GET_ACCOUNT_DATA: Returning zero data:`, zeroData);
    return zeroData;
  }
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
