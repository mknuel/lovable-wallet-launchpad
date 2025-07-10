// aaveHelpers.js – for Sepolia ETH using Aave v3 and Thirdweb SDK only

import {
  getContract,
  prepareContractCall,
  sendTransaction,
  readContract,
  toWei,
  fromGwei
} from "thirdweb";
import { sepolia } from "thirdweb/chains";

export const CONTRACTS = {
  AAVE_POOL: "0x6Ae43d3271ff6888e7Fc43Fd7321a503ff738951", // Aave Pool v3 on Sepolia
  WETH_GATEWAY: "0x387d311e47e80b498169e6fb51d3193167d89F7D", // WETH Gateway v3 on Sepolia  
  WETH: "0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14", // WETH Token on Sepolia
  DAI: "0x3e622317f8C93f7328350cF0B56d9eD4C620C5d6" // DAI Token on Sepolia (if available)
};

const ERC20_ABI = [
  "function approve(address spender, uint256 amount) external returns (bool)",
  "function allowance(address owner, address spender) external view returns (uint256)",
  "function balanceOf(address account) external view returns (uint256)"
];

const AAVE_POOL_ABI = [
  "function supply(address asset, uint256 amount, address onBehalfOf, uint16 referralCode)",
  "function borrow(address asset, uint256 amount, uint256 interestRateMode, uint16 referralCode, address onBehalfOf)",
  "function repay(address asset, uint256 amount, uint256 interestRateMode, address onBehalfOf) returns (uint256)"
];

const WETH_GATEWAY_ABI = [
  "function depositETH(address pool, address onBehalfOf, uint16 referralCode) payable"
];

const getTokenContract = (client, address) =>
  getContract({ client, chain: sepolia, address, abi: ERC20_ABI });

const getPoolContract = (client) =>
  getContract({ client, chain: sepolia, address: CONTRACTS.AAVE_POOL, abi: AAVE_POOL_ABI });

// Helper function to safely convert to wei
const safeToWei = (amount) => {
  if (!amount) throw new Error('Amount is required');
  const amountStr = amount.toString();
  if (!amountStr || amountStr === 'undefined' || amountStr === 'null') {
    throw new Error('Invalid amount value');
  }
  return toWei(amountStr);
};

/**
 * Supply Sepolia ETH (native) via WETH Gateway
 */
export const supplySepoliaETH = async (account, amount) => {
  if (!amount || isNaN(parseFloat(amount))) {
    throw new Error('Invalid amount');
  }
  
  const { client } = await import('../components/thirdweb/thirdwebClient.js');
  if (!client) {
    throw new Error('Thirdweb client not configured');
  }

  const contract = getContract({
    client,
    chain: sepolia,
    address: CONTRACTS.WETH_GATEWAY,
    abi: WETH_GATEWAY_ABI
  });

  const tx = await prepareContractCall({
    contract,
    method: "depositETH",
    params: [CONTRACTS.AAVE_POOL, account.address, 0],
    value: safeToWei(amount)
  });

  const result = await sendTransaction({ transaction: tx, account });

  return {
    success: true,
    message: `Supplied ${amount} ETH via WETH Gateway`,
    txHash: result.transactionHash
  };
};

/**
 * Approve WETH token before repay
 */
export const approveToken = async (account, tokenAddress, amount) => {
  const { client } = await import('../components/thirdweb/thirdwebClient.js');
  if (!client) {
    throw new Error('Thirdweb client not configured');
  }
  
  const token = getTokenContract(client, tokenAddress);
  const currentAllowance = await readContract({
    contract: token,
    method: "allowance",
    params: [account.address, CONTRACTS.AAVE_POOL]
  });

  if (BigInt(currentAllowance) >= BigInt(amount)) {
    return { success: true, message: "Already approved" };
  }

  const tx = await prepareContractCall({
    contract: token,
    method: "approve",
    params: [CONTRACTS.AAVE_POOL, amount]
  });

  const result = await sendTransaction({ transaction: tx, account });
  return {
    success: true,
    message: "Token approved",
    txHash: result.transactionHash
  };
};

/**
 * Borrow WETH from Aave Pool
 */
export const borrowWETH = async (account, amount) => {
  if (!amount || isNaN(parseFloat(amount))) {
    throw new Error('Invalid amount');
  }
  
  const { client } = await import('../components/thirdweb/thirdwebClient.js');
  if (!client) {
    throw new Error('Thirdweb client not configured');
  }

  const pool = getPoolContract(client);
  const tx = await prepareContractCall({
    contract: pool,
    method: "borrow",
    params: [CONTRACTS.WETH, safeToWei(amount), 2, 0, account.address]
  });
  const result = await sendTransaction({ transaction: tx, account });
  return {
    success: true,
    message: `Borrowed ${amount} WETH`,
    txHash: result.transactionHash
  };
};

/**
 * Repay WETH to Aave Pool
 */
export const repayWETH = async (account, amount) => {
  if (!amount || isNaN(parseFloat(amount))) {
    throw new Error('Invalid amount');
  }
  
  const { client } = await import('../components/thirdweb/thirdwebClient.js');
  if (!client) {
    throw new Error('Thirdweb client not configured');
  }

  const weiAmount = safeToWei(amount);
  await approveToken(account, CONTRACTS.WETH, weiAmount);
  const pool = getPoolContract(client);
  const tx = await prepareContractCall({
    contract: pool,
    method: "repay",
    params: [CONTRACTS.WETH, weiAmount, 2, account.address]
  });
  const result = await sendTransaction({ transaction: tx, account });
  return {
    success: true,
    message: `Repaid ${amount} WETH`,
    txHash: result.transactionHash
  };
};

/**
 * Supply DAI to Aave Pool
 */
export const supplyDAI = async (account, amount) => {
  if (!amount || isNaN(parseFloat(amount))) {
    throw new Error('Invalid amount');
  }
  
  const { client } = await import('../components/thirdweb/thirdwebClient.js');
  if (!client) {
    throw new Error('Thirdweb client not configured');
  }

  const weiAmount = safeToWei(amount);
  await approveToken(account, CONTRACTS.DAI, weiAmount);
  const pool = getPoolContract(client);
  const tx = await prepareContractCall({
    contract: pool,
    method: "supply",
    params: [CONTRACTS.DAI, weiAmount, account.address, 0]
  });
  const result = await sendTransaction({ transaction: tx, account });
  return {
    success: true,
    message: `Supplied ${amount} DAI`,
    txHash: result.transactionHash
  };
};

/**
 * Get token balance
 */
export const getTokenBalance = async (account, tokenAddress) => {
  const { client } = await import('../components/thirdweb/thirdwebClient.js');
  if (!client) {
    throw new Error('Thirdweb client not configured');
  }
  
  const token = getTokenContract(client, tokenAddress);
  const balance = await readContract({
    contract: token,
    method: "balanceOf",
    params: [account.address]
  });
  return balance;
};