import { ethers } from 'ethers';

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
 * Approve tokens for spending by Aave Pool
 */
export const approveToken = async (signer, tokenAddress, amount) => {
  try {
    const tokenContract = new ethers.Contract(tokenAddress, ERC20_ABI, signer);
    const parsedAmount = ethers.utils.parseUnits(amount, 18);
    
    // Check current allowance
    const userAddress = await signer.getAddress();
    const currentAllowance = await tokenContract.allowance(userAddress, CONTRACTS.AAVE_POOL);
    
    if (currentAllowance.gte(parsedAmount)) {
      console.log('Already approved sufficient amount');
      return { success: true, message: 'Already approved' };
    }
    
    const tx = await tokenContract.approve(CONTRACTS.AAVE_POOL, parsedAmount);
    console.log('Approval transaction sent:', tx.hash);
    
    const receipt = await tx.wait();
    console.log('Approval confirmed:', receipt.transactionHash);
    
    return { 
      success: true, 
      message: 'Token approved successfully',
      txHash: receipt.transactionHash 
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
export const supplyDAI = async (signer, amount) => {
  try {
    const poolContract = new ethers.Contract(CONTRACTS.AAVE_POOL, AAVE_POOL_ABI, signer);
    const userAddress = await signer.getAddress();
    const parsedAmount = ethers.utils.parseUnits(amount, 18);
    
    // First approve DAI
    const approvalResult = await approveToken(signer, CONTRACTS.DAI, amount);
    if (!approvalResult.success) {
      return approvalResult;
    }
    
    // Supply to Aave
    const tx = await poolContract.supply(
      CONTRACTS.DAI,
      parsedAmount,
      userAddress,
      0 // referral code
    );
    
    console.log('Supply transaction sent:', tx.hash);
    const receipt = await tx.wait();
    console.log('Supply confirmed:', receipt.transactionHash);
    
    return {
      success: true,
      message: `Successfully supplied ${amount} DAI`,
      txHash: receipt.transactionHash
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
export const borrowWETH = async (signer, amount) => {
  try {
    const poolContract = new ethers.Contract(CONTRACTS.AAVE_POOL, AAVE_POOL_ABI, signer);
    const userAddress = await signer.getAddress();
    const parsedAmount = ethers.utils.parseUnits(amount, 18);
    
    const tx = await poolContract.borrow(
      CONTRACTS.WETH,
      parsedAmount,
      2, // variable interest rate mode
      0, // referral code
      userAddress
    );
    
    console.log('Borrow transaction sent:', tx.hash);
    const receipt = await tx.wait();
    console.log('Borrow confirmed:', receipt.transactionHash);
    
    return {
      success: true,
      message: `Successfully borrowed ${amount} WETH`,
      txHash: receipt.transactionHash
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
export const repayWETH = async (signer, amount) => {
  try {
    const poolContract = new ethers.Contract(CONTRACTS.AAVE_POOL, AAVE_POOL_ABI, signer);
    const userAddress = await signer.getAddress();
    const parsedAmount = ethers.utils.parseUnits(amount, 18);
    
    // First approve WETH
    const approvalResult = await approveToken(signer, CONTRACTS.WETH, amount);
    if (!approvalResult.success) {
      return approvalResult;
    }
    
    // Repay to Aave
    const tx = await poolContract.repay(
      CONTRACTS.WETH,
      parsedAmount,
      2, // variable interest rate mode
      userAddress
    );
    
    console.log('Repay transaction sent:', tx.hash);
    const receipt = await tx.wait();
    console.log('Repay confirmed:', receipt.transactionHash);
    
    return {
      success: true,
      message: `Successfully repaid ${amount} WETH`,
      txHash: receipt.transactionHash
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
export const getTokenBalance = async (signer, tokenAddress) => {
  try {
    const tokenContract = new ethers.Contract(tokenAddress, ERC20_ABI, signer);
    const userAddress = await signer.getAddress();
    const balance = await tokenContract.balanceOf(userAddress);
    return ethers.utils.formatUnits(balance, 18);
  } catch (error) {
    console.error('Failed to get token balance:', error);
    return '0';
  }
};