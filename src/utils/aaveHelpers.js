import { getContract, readContract, prepareContractCall, sendTransaction } from 'thirdweb';
import { polygon } from 'thirdweb/chains';

// Helper functions for unit conversion
const toWei = (value) => {
  return BigInt(Math.floor(parseFloat(value) * Math.pow(10, 18)));
};

const fromWei = (value) => {
  return (Number(value) / Math.pow(10, 18)).toString();
};

// Contract addresses for Polygon Mumbai testnet
export const CONTRACTS = {
  AAVE_POOL: '0x919d0dC6100b5cBb624c4CcEacd831a3E19b8c73',
  DAI: '0x001B3B4D0F3714Ca98Ba10F6042daEbF0B1B7b6F',
  WETH: '0xd0A1E359811322d97991E03f863a0C30C2cF029C'
};

// ERC20 ABI (minimal for approve, balanceOf, allowance)
const ERC20_ABI = [
  "function approve(address spender, uint256 amount) external returns (bool)",
  "function allowance(address owner, address spender) external view returns (uint256)",
  "function balanceOf(address account) external view returns (uint256)",
  "function decimals() external view returns (uint8)"
];

// Aave Pool ABI (minimal for supply, borrow, repay)
const AAVE_POOL_ABI = [
  "function supply(address asset, uint256 amount, address onBehalfOf, uint16 referralCode) external",
  "function borrow(address asset, uint256 amount, uint256 interestRateMode, uint16 referralCode, address onBehalfOf) external",
  "function repay(address asset, uint256 amount, uint256 interestRateMode, address onBehalfOf) external returns (uint256)"
];

/**
 * Get contract instance
 */
const getTokenContract = (client, tokenAddress) => {
  return getContract({
    client,
    chain: polygon,
    address: tokenAddress,
    abi: ERC20_ABI
  });
};

const getPoolContract = (client) => {
  return getContract({
    client,
    chain: polygon,
    address: CONTRACTS.AAVE_POOL,
    abi: AAVE_POOL_ABI
  });
};

/**
 * Approve tokens for spending by Aave Pool
 */
export const approveToken = async (account, tokenAddress, amount) => {
  try {
    const client = account.client;
    const tokenContract = getTokenContract(client, tokenAddress);
    const parsedAmount = toWei(amount);
    
    // Check current allowance
    const userAddress = account.address;
    const currentAllowance = await readContract({
      contract: tokenContract,
      method: "allowance",
      params: [userAddress, CONTRACTS.AAVE_POOL]
    });
    
    if (BigInt(currentAllowance) >= BigInt(parsedAmount)) {
      console.log('Already approved sufficient amount');
      return { success: true, message: 'Already approved' };
    }
    
    const transaction = prepareContractCall({
      contract: tokenContract,
      method: "approve",
      params: [CONTRACTS.AAVE_POOL, parsedAmount]
    });
    
    const result = await sendTransaction({
      transaction,
      account
    });
    
    console.log('Approval confirmed:', result.transactionHash);
    
    return { 
      success: true, 
      message: 'Token approved successfully',
      txHash: result.transactionHash 
    };
  } catch (error) {
    console.error('Approval failed:', error);
    return { 
      success: false, 
      message: error.message || 'Approval failed' 
    };
  }
};

/**
 * Supply DAI to Aave Pool
 */
export const supplyDAI = async (account, amount) => {
  try {
    const client = account.client;
    const poolContract = getPoolContract(client);
    const userAddress = account.address;
    const parsedAmount = toWei(amount);
    
    // First approve DAI
    const approvalResult = await approveToken(account, CONTRACTS.DAI, amount);
    if (!approvalResult.success) {
      return approvalResult;
    }
    
    // Supply to Aave
    const transaction = prepareContractCall({
      contract: poolContract,
      method: "supply",
      params: [CONTRACTS.DAI, parsedAmount, userAddress, 0]
    });
    
    const result = await sendTransaction({
      transaction,
      account
    });
    
    console.log('Supply confirmed:', result.transactionHash);
    
    return {
      success: true,
      message: `Successfully supplied ${amount} DAI`,
      txHash: result.transactionHash
    };
  } catch (error) {
    console.error('Supply failed:', error);
    return {
      success: false,
      message: error.message || 'Supply failed'
    };
  }
};

/**
 * Borrow WETH from Aave Pool
 */
export const borrowWETH = async (account, amount) => {
  try {
    const client = account.client;
    const poolContract = getPoolContract(client);
    const userAddress = account.address;
    const parsedAmount = toWei(amount);
    
    const transaction = prepareContractCall({
      contract: poolContract,
      method: "borrow",
      params: [CONTRACTS.WETH, parsedAmount, 2, 0, userAddress]
    });
    
    const result = await sendTransaction({
      transaction,
      account
    });
    
    console.log('Borrow confirmed:', result.transactionHash);
    
    return {
      success: true,
      message: `Successfully borrowed ${amount} WETH`,
      txHash: result.transactionHash
    };
  } catch (error) {
    console.error('Borrow failed:', error);
    return {
      success: false,
      message: error.message || 'Borrow failed'
    };
  }
};

/**
 * Repay WETH to Aave Pool
 */
export const repayWETH = async (account, amount) => {
  try {
    const client = account.client;
    const poolContract = getPoolContract(client);
    const userAddress = account.address;
    const parsedAmount = toWei(amount);
    
    // First approve WETH
    const approvalResult = await approveToken(account, CONTRACTS.WETH, amount);
    if (!approvalResult.success) {
      return approvalResult;
    }
    
    // Repay to Aave
    const transaction = prepareContractCall({
      contract: poolContract,
      method: "repay",
      params: [CONTRACTS.WETH, parsedAmount, 2, userAddress]
    });
    
    const result = await sendTransaction({
      transaction,
      account
    });
    
    console.log('Repay confirmed:', result.transactionHash);
    
    return {
      success: true,
      message: `Successfully repaid ${amount} WETH`,
      txHash: result.transactionHash
    };
  } catch (error) {
    console.error('Repay failed:', error);
    return {
      success: false,
      message: error.message || 'Repay failed'
    };
  }
};

/**
 * Get user's token balance
 */
export const getTokenBalance = async (account, tokenAddress) => {
  try {
    const client = account.client;
    const tokenContract = getTokenContract(client, tokenAddress);
    const userAddress = account.address;
    
    const balance = await readContract({
      contract: tokenContract,
      method: "balanceOf",
      params: [userAddress]
    });
    
    return fromWei(balance);
  } catch (error) {
    console.error('Failed to get token balance:', error);
    return '0';
  }
};