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
  {
    "inputs": [{"name": "spender", "type": "address"}, {"name": "amount", "type": "uint256"}],
    "name": "approve",
    "outputs": [{"name": "", "type": "bool"}],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"name": "owner", "type": "address"}, {"name": "spender", "type": "address"}],
    "name": "allowance",
    "outputs": [{"name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"name": "account", "type": "address"}],
    "name": "balanceOf",
    "outputs": [{"name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  }
];

const AAVE_POOL_ABI = [
  {
    "inputs": [
      {"name": "asset", "type": "address"},
      {"name": "amount", "type": "uint256"},
      {"name": "onBehalfOf", "type": "address"},
      {"name": "referralCode", "type": "uint16"}
    ],
    "name": "supply",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"name": "asset", "type": "address"},
      {"name": "amount", "type": "uint256"},
      {"name": "interestRateMode", "type": "uint256"},
      {"name": "referralCode", "type": "uint16"},
      {"name": "onBehalfOf", "type": "address"}
    ],
    "name": "borrow",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"name": "asset", "type": "address"},
      {"name": "amount", "type": "uint256"},
      {"name": "interestRateMode", "type": "uint256"},
      {"name": "onBehalfOf", "type": "address"}
    ],
    "name": "repay",
    "outputs": [{"name": "", "type": "uint256"}],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

const WETH_GATEWAY_ABI = [
  {
    "inputs": [
      {"name": "pool", "type": "address"},
      {"name": "onBehalfOf", "type": "address"},
      {"name": "referralCode", "type": "uint16"}
    ],
    "name": "depositETH",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {"name": "pool", "type": "address"},
      {"name": "amount", "type": "uint256"},
      {"name": "interestRateMode", "type": "uint256"},
      {"name": "referralCode", "type": "uint16"}
    ],
    "name": "borrowETH",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"name": "pool", "type": "address"},
      {"name": "onBehalfOf", "type": "address"},
      {"name": "referralCode", "type": "uint16"}
    ],
    "name": "repayETH",
    "outputs": [{"name": "", "type": "uint256"}],
    "stateMutability": "payable",
    "type": "function"
  }
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
 * Borrow WETH from Aave Pool (using Pool contract directly)
 * Note: You must have supplied collateral first before borrowing
 */
export const borrowETH = async (account, amount) => {
  if (!amount || isNaN(parseFloat(amount))) {
    throw new Error('Invalid amount');
  }
  
  const { client } = await import('../components/thirdweb/thirdwebClient.js');
  if (!client) {
    throw new Error('Thirdweb client not configured');
  }

  try {
    // Use Pool contract directly to borrow WETH, not Gateway
    const pool = getPoolContract(client);
    const tx = await prepareContractCall({
      contract: pool,
      method: "borrow",
      params: [CONTRACTS.WETH, safeToWei(amount), 2, 0, account.address]
    });
    const result = await sendTransaction({ transaction: tx, account });
    return {
      success: true,
      message: `Borrowed ${amount} WETH (you can unwrap to ETH)`,
      txHash: result.transactionHash
    };
  } catch (error) {
    console.error('Borrow error:', error);
    if (error.message.includes('30')) {
      throw new Error(`Borrowing is not enabled for WETH on this testnet. Try borrowing DAI instead, or check if you have sufficient collateral deposited.`);
    } else if (error.message.includes('execution reverted')) {
      throw new Error(`Cannot borrow WETH. Make sure you have sufficient collateral deposited first. Try supplying ETH or DAI as collateral before borrowing.`);
    }
    throw error;
  }
};

/**
 * Repay WETH to Aave Pool (using Pool contract directly)
 */
export const repayETH = async (account, amount) => {
  if (!amount || isNaN(parseFloat(amount))) {
    throw new Error('Invalid amount');
  }
  
  const { client } = await import('../components/thirdweb/thirdwebClient.js');
  if (!client) {
    throw new Error('Thirdweb client not configured');
  }

  try {
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
  } catch (error) {
    console.error('Repay error:', error);
    if (error.message.includes('30')) {
      throw new Error(`Borrowing/Repaying is not enabled for WETH on this testnet.`);
    }
    throw error;
  }
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