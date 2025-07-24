// aaveHelper.js – Polygon Amoy MATIC + Aave v3 + Thirdweb SDK

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
  AAVE_POOL: "0xD05e3E715d945B59290df0ae8eF85c1BdB684744",
  WMATIC_GATEWAY: "0xD0C84453b3945cd7e84BF7fc53BcDd3B2F1c976a", 
  WMATIC: "0x360ad4f9a9A8EFe9A8DCB5f461c4Cc1047E1Dcf9",
  USDC: "0x41E94Eb019C0762f9Bfcf9Fb1E58725BfB0e7582",
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

const WMATIC_GATEWAY_ABI = [
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
  const numAmount = parseFloat(amount);
  console.log('safeToWei input:', amount, 'parsed:', numAmount);
  
  if (!amount || isNaN(numAmount) || numAmount <= 0) {
    throw new Error(`Invalid amount: ${amount}`);
  }
  
  // Use the EXACT amount provided by user - no minimum enforcement
  const finalAmount = numAmount;
  
  // Convert to string with fixed decimals to avoid scientific notation
  const amountStr = finalAmount.toFixed(18);
  const result = toWei(amountStr);
  console.log('safeToWei result:', result, 'final amount:', finalAmount, 'ETH');
  return result;
};

const waitForTransaction = async (client, txHash) => {
  console.log(`⏳ Waiting for transaction confirmation: ${txHash}`);
  
  // Use Polygon Amoy RPC endpoint
  const response = await fetch(`https://80002.rpc.thirdweb.com/7038953a5d72063c56919f27ec00bbda`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      id: 1,
      jsonrpc: '2.0',
      method: 'eth_getTransactionReceipt',
      params: [txHash]
    })
  });
  
  const receipt = await response.json();
  if (receipt.result && receipt.result.status === '0x1') {
    console.log(`✅ Transaction confirmed: ${txHash}`);
    return receipt.result;
  }
  
  console.log(`⏳ Transaction pending, will show success when completed`);
  return null;
};

const checkTxSuccess = async (client, result, label = "Transaction") => {
  console.log(`🔍 ${label}: Checking transaction success...`, result);
  
  if (!result || !result.transactionHash) {
    throw new Error(`${label} failed - no transaction hash received`);
  }
  
  console.log(`✅ ${label}: Transaction sent successfully with hash: ${result.transactionHash}`);
  return true;
};

const getTokenContract = (client, address) =>
  getContract({ client, chain: polygonAmoy, address, abi: ERC20_ABI });

const getPoolContract = (client) =>
  getContract({ client, chain: polygonAmoy, address: CONTRACTS.AAVE_POOL, abi: AAVE_POOL_ABI });

const getWmaticGatewayContract = (client) =>
  getContract({ client, chain: polygonAmoy, address: CONTRACTS.WMATIC_GATEWAY, abi: WMATIC_GATEWAY_ABI });

// ✅ Supply MATIC (as collateral) - Input amount in MATIC  
export const supplySepoliaETH = async (account, maticAmount) => {
  const { client } = await import("../components/thirdweb/thirdwebClient.js");
  if (!client) throw new Error("Thirdweb client not configured");

  console.log(`🔄 SUPPLY: Supplying ${maticAmount} MATIC`);
  console.log(`🔄 SUPPLY: Account address:`, account.address);

  try {
    // Use WMATIC Gateway for MATIC deposits
    const contract = getWmaticGatewayContract(client);
    console.log(`🔄 SUPPLY: WMATIC Gateway contract:`, contract);
    
    const tx = await prepareContractCall({
      contract,
      method: "depositETH",
      params: [CONTRACTS.AAVE_POOL, account.address, 0],
      value: safeToWei(maticAmount),
      gas: 200000n, // Increased gas limit
    });

    console.log(`🔄 SUPPLY: Prepared transaction:`, tx);
    const result = await sendTransaction({ transaction: tx, account });
    console.log(`✅ SUPPLY: Transaction result:`, result);
    
    await checkTxSuccess(client, result, "Supply");

    // 🔍 Validate if collateral registered
    const poolContract = getPoolContract(client);
    const data = await readContract({
      contract: poolContract,
      method: "getUserAccountData", 
      params: [account.address],
    });

    console.log(`📊 SUPPLY: Account data after supply:`, data);
    const totalCollateralETH = Number(data.totalCollateralETH) / 1e18;
    console.log(`📊 SUPPLY: Total collateral MATIC:`, totalCollateralETH);

    if (totalCollateralETH === 0) {
      return {
        success: false,
        message: "Transaction confirmed but no collateral registered. Check transaction or retry.",
        txHash: result.transactionHash,
      };
    }

    const response = {
      success: true,
      message: `Supplied ${maticAmount} MATIC successfully`,
      txHash: result.transactionHash,
    };
    console.log(`✅ SUPPLY: Final response:`, response);
    return response;
  } catch (error) {
    console.error(`❌ SUPPLY: Error:`, error);
    let errorMessage = "Failed to supply ETH";
    
    if (error.message.includes("insufficient funds")) {
      errorMessage = "Insufficient MATIC balance in your wallet.";
    } else if (error.message.includes("gas")) {
      errorMessage = "Transaction failed due to gas issues. Please try again.";
    }
    
    throw new Error(errorMessage);
  }
};

// ✅ Borrow WMATIC - Input amount in MATIC
export const borrowETH = async (account, maticAmount) => {
  const { client } = await import("../components/thirdweb/thirdwebClient.js");
  if (!client) throw new Error("Thirdweb client not configured");

  console.log(`🔄 BORROW: Borrowing ${maticAmount} MATIC`);
  console.log(`🔄 BORROW: Account address:`, account.address);

  // First check user's account data to see if they can borrow
  const accountData = await getUserAccountData(account.address);
  console.log(`📊 BORROW: User account data:`, accountData);
  
  const borrowAmountMATIC = parseFloat(maticAmount);
  if (borrowAmountMATIC > accountData.availableBorrowsETH) {
    throw new Error(`Cannot borrow ${maticAmount} MATIC. Available to borrow: ${accountData.availableBorrowsETH.toFixed(4)} MATIC. You need more collateral.`);
  }

  if (accountData.totalCollateralETH === 0) {
    throw new Error("No collateral found. Please supply collateral first before borrowing.");
  }

  const contract = getPoolContract(client);
  console.log(`🔄 BORROW: Pool contract:`, contract);

  try {
    const tx = await prepareContractCall({
      contract,
      method: "borrow",
      params: [CONTRACTS.WMATIC, safeToWei(maticAmount), 2, 0, account.address],
      gas: 200000n, // Increased gas limit
    });

    console.log(`🔄 BORROW: Prepared transaction:`, tx);
    const result = await sendTransaction({ transaction: tx, account });
    console.log(`✅ BORROW: Transaction result:`, result);
    
    await checkTxSuccess(client, result, "Borrow");

    const response = {
      success: true,
      message: `Borrowed ${maticAmount} MATIC successfully`,
      txHash: result.transactionHash,
    };
    console.log(`✅ BORROW: Final response:`, response);
    return response;
  } catch (error) {
    console.error(`❌ BORROW: Error:`, error);
    let errorMessage = "Failed to borrow ETH";
    
    if (error.message.includes("30")) {
      errorMessage = "Insufficient collateral to borrow this amount. Please supply more collateral first.";
    } else if (error.message.includes("32")) {
      errorMessage = "This asset is not enabled for borrowing.";
    } else if (error.message.includes("4")) {
      errorMessage = "Health factor would be below 1. Reduce borrow amount.";
    }
    
    throw new Error(errorMessage);
  }
};

// ✅ Repay WMATIC - Input amount in MATIC
export const repayETH = async (account, maticAmount) => {
  const { client } = await import("../components/thirdweb/thirdwebClient.js");
  if (!client) throw new Error("Thirdweb client not configured");

  console.log(`🔄 REPAY: Repaying ${maticAmount} MATIC`);
  console.log(`🔄 REPAY: Account address:`, account.address);

  try {
    // Check user's debt first
    const accountData = await getUserAccountData(account.address);
    console.log(`📊 REPAY: User account data:`, accountData);
    
    if (accountData.totalDebtETH === 0) {
      throw new Error("No debt found to repay.");
    }

    // Check WMATIC balance
    const wmaticBalance = await getTokenBalance(account.address, CONTRACTS.WMATIC);
    console.log(`💰 REPAY: WMATIC Balance:`, wmaticBalance);
    
    const repayAmountMATIC = parseFloat(maticAmount);
    if (repayAmountMATIC > wmaticBalance) {
      throw new Error(`Insufficient WMATIC balance. Have: ${wmaticBalance.toFixed(4)} WMATIC, Need: ${maticAmount} WMATIC`);
    }

    // First, approve WMATIC token to be spent by Aave pool
    console.log(`🔄 REPAY: Approving WMATIC for Aave pool...`);
    const wmaticContract = getTokenContract(client, CONTRACTS.WMATIC);
    
    const approvalTx = await prepareContractCall({
      contract: wmaticContract,
      method: "approve",
      params: [CONTRACTS.AAVE_POOL, safeToWei(maticAmount)],
      gas: 100000n,
    });

    console.log(`🔄 REPAY: Sending approval transaction...`);
    const approvalResult = await sendTransaction({ transaction: approvalTx, account });
    console.log(`✅ REPAY: Approval transaction result:`, approvalResult);
    
    await checkTxSuccess(client, approvalResult, "WMATIC Approval");

    // Now repay the debt
    const poolContract = getPoolContract(client);
    console.log(`🔄 REPAY: Pool contract:`, poolContract);

    const repayTx = await prepareContractCall({
      contract: poolContract,
      method: "repay",
      params: [CONTRACTS.WMATIC, safeToWei(maticAmount), 2, account.address],
      gas: 200000n, // Increased gas limit
    });

    console.log(`🔄 REPAY: Prepared repay transaction:`, repayTx);
    const result = await sendTransaction({ transaction: repayTx, account });
    console.log(`✅ REPAY: Repay transaction result:`, result);
    
    await checkTxSuccess(client, result, "Repay");

    const response = {
      success: true,
      message: `Repaid ${maticAmount} MATIC successfully`,
      txHash: result.transactionHash,
    };
    console.log(`✅ REPAY: Final response:`, response);
    return response;
  } catch (error) {
    console.error(`❌ REPAY: Error:`, error);
    let errorMessage = "Failed to repay ETH";
    
    if (error.message.includes("insufficient")) {
      errorMessage = error.message; // Use the specific insufficient balance message
    } else if (error.message.includes("No debt")) {
      errorMessage = error.message; // Use the no debt message
    } else if (error.message.includes("30")) {
      errorMessage = "Cannot repay: insufficient balance or invalid amount.";
    }
    
    throw new Error(errorMessage);
  }
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
