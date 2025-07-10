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
  },
  {
    "inputs": [{"name": "user", "type": "address"}],
    "name": "getUserAccountData",
    "outputs": [
      {"name": "totalCollateralETH", "type": "uint256"},
      {"name": "totalDebtETH", "type": "uint256"},
      {"name": "availableBorrowsETH", "type": "uint256"},
      {"name": "currentLiquidationThreshold", "type": "uint256"},
      {"name": "ltv", "type": "uint256"},
      {"name": "healthFactor", "type": "uint256"}
    ],
    "stateMutability": "view",
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
 * Get user's account data from Aave
 */
export const getUserAccountData = async (account) => {
  const { client } = await import('../components/thirdweb/thirdwebClient.js');
  if (!client) {
    throw new Error('Thirdweb client not configured');
  }

  const pool = getPoolContract(client);
  const data = await readContract({
    contract: pool,
    method: "getUserAccountData",
    params: [account.address]
  });

  return {
    totalCollateralETH: data[0],
    totalDebtETH: data[1],
    availableBorrowsETH: data[2],
    currentLiquidationThreshold: data[3],
    ltv: data[4],
    healthFactor: data[5]
  };
};

/**
 * Borrow WETH from Aave Pool (which can be unwrapped to ETH)
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
    // Check user's account data first
    const accountData = await getUserAccountData(account);
    const totalCollateralETH = Number(accountData.totalCollateralETH) / 1e18;
    const totalDebtETH = Number(accountData.totalDebtETH) / 1e18;
    const availableBorrowETH = Number(accountData.availableBorrowsETH) / 1e18;
    const healthFactor = Number(accountData.healthFactor) / 1e18;
    const requestedAmount = parseFloat(amount);
    
    console.log('=== AAVE ACCOUNT DEBUG ===');
    console.log('Raw account data:', accountData);
    console.log('Parsed data:', {
      totalCollateral: totalCollateralETH,
      totalDebt: totalDebtETH,
      availableBorrows: availableBorrowETH,
      healthFactor: healthFactor,
      ltv: Number(accountData.ltv) / 100, // LTV is in basis points
      liquidationThreshold: Number(accountData.currentLiquidationThreshold) / 100,
      requestedAmount
    });

    // If no collateral, provide specific guidance
    if (totalCollateralETH === 0) {
      throw new Error(`No collateral detected in your Aave account. Your ETH deposit might not have been processed correctly. Please check the transaction status or try depositing again.`);
    }

    // Calculate what they should be able to borrow (typically 80% of collateral for ETH)
    const expectedBorrowCapacity = totalCollateralETH * 0.8; // 80% LTV typical for ETH
    console.log('Expected borrow capacity (80% of collateral):', expectedBorrowCapacity);

    if (availableBorrowETH < requestedAmount) {
      throw new Error(`Insufficient borrowing capacity. 
      
Your account:
- Collateral deposited: ${totalCollateralETH.toFixed(6)} ETH
- Available to borrow: ${availableBorrowETH.toFixed(6)} ETH  
- You requested: ${requestedAmount} ETH

${totalCollateralETH > 0 ? 'Try borrowing a smaller amount or deposit more collateral.' : 'Make sure your ETH deposit transaction was successful.'}`);
    }

    // Borrow WETH directly from Pool contract
    const pool = getPoolContract(client);
    const tx = await prepareContractCall({
      contract: pool,
      method: "borrow",
      params: [CONTRACTS.WETH, safeToWei(amount), 2, 0, account.address]
    });
    const result = await sendTransaction({ transaction: tx, account });
    return {
      success: true,
      message: `Borrowed ${amount} WETH (can be unwrapped to ETH)`,
      txHash: result.transactionHash
    };
  } catch (error) {
    console.error('Borrow error:', error);
    if (error.message.includes('Insufficient borrowing capacity')) {
      throw error; // Re-throw our custom error
    } else if (error.message.includes('30')) {
      throw new Error(`Borrowing is not enabled for WETH on this testnet.`);
    } else if (error.message.includes('execution reverted')) {
      throw new Error(`Cannot borrow WETH. The transaction was reverted - this usually means insufficient collateral or borrowing is not enabled for this asset.`);
    }
    throw error;
  }
};

/**
 * Repay WETH to Aave Pool (approve WETH first)
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
    // First approve WETH spending
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
      throw new Error(`Repaying WETH is not enabled on this testnet.`);
    } else if (error.message.includes('execution reverted')) {
      throw new Error(`Repay failed. Make sure you have enough WETH tokens and an outstanding loan to repay.`);
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

  try {
    // Check user's DAI balance first
    const daiBalance = await getTokenBalance(account, CONTRACTS.DAI);
    const weiAmount = safeToWei(amount);
    
    if (BigInt(daiBalance) < BigInt(weiAmount)) {
      throw new Error(`Insufficient DAI balance. You need ${amount} DAI but only have ${Number(daiBalance) / 1e18} DAI. Get test DAI from a faucet first.`);
    }

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
      message: `Supplied ${amount} DAI to Aave`,
      txHash: result.transactionHash
    };
  } catch (error) {
    console.error('Supply DAI error:', error);
    if (error.message.includes('Insufficient DAI balance')) {
      throw error; // Re-throw our custom error
    } else if (error.message.includes('execution reverted')) {
      throw new Error(`Transaction failed. Make sure you have enough DAI tokens and gas fees. Try getting test DAI from a Sepolia faucet first.`);
    }
    throw error;
  }
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

/**
 * Get test DAI from Sepolia faucet (if available)
 * Note: This is a placeholder - user needs to get DAI from external faucet
 */
export const getTestDAIInfo = () => {
  return {
    message: "To get test DAI for Sepolia testnet:",
    instructions: [
      "1. Visit the Aave testnet app: https://app.aave.com (enable testnet mode)",
      "2. Or use a Sepolia DAI faucet if available",
      "3. Make sure you have Sepolia ETH for gas fees first",
      "DAI Contract: " + CONTRACTS.DAI
    ]
  };
};