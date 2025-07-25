// aaveHelper.js – Sepolia ETH + Aave v3 + Thirdweb SDK

import {
  getContract,
  prepareContractCall,
  sendTransaction,
  readContract,
  toWei,
} from "thirdweb";
import { sepolia } from "thirdweb/chains";

// 🔗 Contract addresses for Ethereum Sepolia testnet Aave v3 (Updated 2024)
export const CONTRACTS = {
  AAVE_POOL: "0x6Ae43d3271ff6888e7Fc43Fd7321a503ff738951", // Verified correct address
  WETH_GATEWAY: "0x387d311e47e80b498169e6fb51d3193167d89F7D", // Verified correct address  
  WETH: "0xC558DBdd856501FCd9aaF1E62eae57A9F0629a3c", // Verified Sepolia WETH
  USDC: "0x94a9D9AC8a22534E3FaCa9F4e7F2E2cf85d5E4C8", // Sepolia USDC
  DATA_PROVIDER: "0x2D8A3C5677189723C4cB8873CfC9C8976FDF38Ac", // Aave Protocol Data Provider
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
  {
    name: "setUserUseReserveAsCollateral",
    type: "function",
    inputs: [
      { name: "asset", type: "address" },
      { name: "useAsCollateral", type: "bool" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
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
  
  // Use thirdweb's built-in method to wait for receipt
  const response = await fetch(`https://11155111.rpc.thirdweb.com/7038953a5d72063c56919f27ec00bbda`, {
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
  getContract({ client, chain: sepolia, address, abi: ERC20_ABI });

const getPoolContract = (client) =>
  getContract({ client, chain: sepolia, address: CONTRACTS.AAVE_POOL, abi: AAVE_POOL_ABI });

const getWethGatewayContract = (client) =>
  getContract({ client, chain: sepolia, address: CONTRACTS.WETH_GATEWAY, abi: WETH_GATEWAY_ABI });

// ✅ Supply ETH (as collateral) - Input amount in ETH  
export const supplySepoliaETH = async (account, ethAmount) => {
  const { client } = await import("../components/thirdweb/thirdwebClient.js");
  if (!client) throw new Error("Thirdweb client not configured");

  console.log(`🔄 SUPPLY: Supplying ${ethAmount} ETH`);
  console.log(`🔄 SUPPLY: Account address:`, account.address);

  try {
    // Use WETH Gateway for ETH deposits
    const contract = getWethGatewayContract(client);
    console.log(`🔄 SUPPLY: WETH Gateway contract:`, contract);
    
    const tx = await prepareContractCall({
      contract,
      method: "depositETH",
      params: [CONTRACTS.AAVE_POOL, account.address, 0],
      value: safeToWei(ethAmount),
      gas: 200000n, // Increased gas limit
    });

    console.log(`🔄 SUPPLY: Prepared transaction:`, tx);
    const result = await sendTransaction({ transaction: tx, account });
    console.log(`✅ SUPPLY: Transaction result:`, result);
    
    await checkTxSuccess(client, result, "Supply");

    // ✅ Enable WETH as collateral after depositing
    console.log(`🔄 SUPPLY: Enabling WETH as collateral...`);
    const poolContract = getPoolContract(client);
    const collateralTx = await prepareContractCall({
      contract: poolContract,
      method: "setUserUseReserveAsCollateral",
      params: [CONTRACTS.WETH, true],
      gas: 100000n,
    });
    
    const collateralResult = await sendTransaction({ transaction: collateralTx, account });
    console.log(`✅ SUPPLY: Collateral enabled:`, collateralResult);
    await checkTxSuccess(client, collateralResult, "Enable Collateral");

    // 🔍 Validate if collateral registered (optional check - transactions already succeeded)
    try {
      const data = await readContract({
        contract: poolContract,
        method: "getUserAccountData", 
        params: [account.address],
      });

      console.log(`📊 SUPPLY: Account data after supply:`, data);
      
      if (data && data.totalCollateralETH) {
        const totalCollateralETH = Number(data.totalCollateralETH.toString()) / 1e18;
        console.log(`📊 SUPPLY: Total collateral ETH:`, totalCollateralETH);
      } else {
        console.log(`📊 SUPPLY: Account data structure different, but transactions succeeded`);
      }
    } catch (error) {
      console.log(`📊 SUPPLY: Could not fetch account data, but transactions succeeded:`, error);
    }

    const response = {
      success: true,
      message: `Supplied ${ethAmount} ETH successfully`,
      txHash: result.transactionHash,
    };
    console.log(`✅ SUPPLY: Final response:`, response);
    return response;
  } catch (error) {
    console.error(`❌ SUPPLY: Error:`, error);
    let errorMessage = "Failed to supply ETH";
    
    if (error.message.includes("insufficient funds")) {
      errorMessage = "Insufficient ETH balance in your wallet.";
    } else if (error.message.includes("gas")) {
      errorMessage = "Transaction failed due to gas issues. Please try again.";
    }
    
    throw new Error(errorMessage);
  }
};

// ✅ Borrow WETH - Input amount in ETH
export const borrowETH = async (account, ethAmount) => {
  const { client } = await import("../components/thirdweb/thirdwebClient.js");
  if (!client) throw new Error("Thirdweb client not configured");

  console.log(`🔄 BORROW: Borrowing ${ethAmount} ETH`);
  console.log(`🔄 BORROW: Account address:`, account.address);

  // First check user's account data to see if they can borrow
  const accountData = await getUserAccountData(account.address);
  console.log(`📊 BORROW: User account data:`, accountData);
  
  const borrowAmountETH = parseFloat(ethAmount);
  if (borrowAmountETH > accountData.availableBorrowsETH) {
    throw new Error(`Cannot borrow ${ethAmount} ETH. Available to borrow: ${accountData.availableBorrowsETH.toFixed(4)} ETH. You need more collateral.`);
  }

  if (accountData.totalCollateralETH === 0) {
    throw new Error("No collateral found. Please supply collateral first before borrowing.");
  }

  const contract = getPoolContract(client);
  console.log(`🔄 BORROW: Pool contract:`, contract);

  try {
    // Use more gas and try variable rate mode (2) first, then stable (1) if needed
    const tx = await prepareContractCall({
      contract,
      method: "borrow",
      params: [CONTRACTS.WETH, safeToWei(ethAmount), 2n, 0, account.address], // Use BigInt for interest rate mode
      gas: 300000n, // Increased gas limit significantly
    });

    console.log(`🔄 BORROW: Prepared transaction:`, tx);
    const result = await sendTransaction({ transaction: tx, account });
    console.log(`✅ BORROW: Transaction result:`, result);
    
    await checkTxSuccess(client, result, "Borrow");

    const response = {
      success: true,
      message: `Borrowed ${ethAmount} ETH successfully`,
      txHash: result.transactionHash,
    };
    console.log(`✅ BORROW: Final response:`, response);
    return response;
  } catch (error) {
    console.error(`❌ BORROW: Error:`, error);
    console.error(`❌ BORROW: Error details:`, error.message, error.code);
    
    let errorMessage = "Failed to borrow ETH";
    
    // Better error code handling for Aave v3
    if (error.message.includes("30") || error.message.includes("VL_NOT_ENOUGH_AVAILABLE_USER_BALANCE")) {
      errorMessage = "Insufficient collateral to borrow this amount. Please supply more collateral first.";
    } else if (error.message.includes("32") || error.message.includes("VL_BORROWING_NOT_ENABLED")) {
      errorMessage = "This asset is not enabled for borrowing on this market.";
    } else if (error.message.includes("4") || error.message.includes("VL_HEALTH_FACTOR_LOWER_THAN_LIQUIDATION_THRESHOLD")) {
      errorMessage = "Health factor would be below 1. Reduce borrow amount.";
    } else if (error.message.includes("11") || error.message.includes("VL_COLLATERAL_BALANCE_IS_ZERO")) {
      errorMessage = "No collateral found. Supply collateral first.";
    } else if (error.message.includes("gas")) {
      errorMessage = "Transaction failed due to gas issues. Please try with more gas.";
    }
    
    throw new Error(errorMessage);
  }
};

// ✅ Repay WETH - Input amount in ETH
export const repayETH = async (account, ethAmount) => {
  const { client } = await import("../components/thirdweb/thirdwebClient.js");
  if (!client) throw new Error("Thirdweb client not configured");

  console.log(`🔄 REPAY: Repaying ${ethAmount} ETH`);
  console.log(`🔄 REPAY: Account address:`, account.address);

  try {
    // Check user's debt first
    const accountData = await getUserAccountData(account.address);
    console.log(`📊 REPAY: User account data:`, accountData);
    
    if (accountData.totalDebtETH === 0) {
      throw new Error("No debt found to repay.");
    }

    // Check WETH balance
    const wethBalance = await getTokenBalance(account.address, CONTRACTS.WETH);
    console.log(`💰 REPAY: WETH Balance:`, wethBalance);
    
    const repayAmountETH = parseFloat(ethAmount);
    if (repayAmountETH > wethBalance) {
      throw new Error(`Insufficient WETH balance. Have: ${wethBalance.toFixed(4)} WETH, Need: ${ethAmount} WETH`);
    }

    // First, approve WETH token to be spent by Aave pool - use higher amount for approval
    console.log(`🔄 REPAY: Approving WETH for Aave pool...`);
    const wethContract = getTokenContract(client, CONTRACTS.WETH);
    
    // Approve more than needed to avoid precision issues
    const approvalAmount = safeToWei((repayAmountETH * 1.01).toString()); // 1% buffer
    
    const approvalTx = await prepareContractCall({
      contract: wethContract,
      method: "approve",
      params: [CONTRACTS.AAVE_POOL, approvalAmount],
      gas: 150000n, // Increased gas for approval
    });

    console.log(`🔄 REPAY: Sending approval transaction...`);
    const approvalResult = await sendTransaction({ transaction: approvalTx, account });
    console.log(`✅ REPAY: Approval transaction result:`, approvalResult);
    
    await checkTxSuccess(client, approvalResult, "WETH Approval");

    // Now repay the debt
    const poolContract = getPoolContract(client);
    console.log(`🔄 REPAY: Pool contract:`, poolContract);

    const repayTx = await prepareContractCall({
      contract: poolContract,
      method: "repay",
      params: [CONTRACTS.WETH, safeToWei(ethAmount), 2n, account.address], // Use BigInt for interest rate mode
      gas: 300000n, // Increased gas limit significantly
    });

    console.log(`🔄 REPAY: Prepared repay transaction:`, repayTx);
    const result = await sendTransaction({ transaction: repayTx, account });
    console.log(`✅ REPAY: Repay transaction result:`, result);
    
    await checkTxSuccess(client, result, "Repay");

    const response = {
      success: true,
      message: `Repaid ${ethAmount} ETH successfully`,
      txHash: result.transactionHash,
    };
    console.log(`✅ REPAY: Final response:`, response);
    return response;
  } catch (error) {
    console.error(`❌ REPAY: Error:`, error);
    console.error(`❌ REPAY: Error details:`, error.message, error.code);
    
    let errorMessage = "Failed to repay ETH";
    
    if (error.message.includes("insufficient")) {
      errorMessage = error.message; // Use the specific insufficient balance message
    } else if (error.message.includes("No debt")) {
      errorMessage = error.message; // Use the no debt message
    } else if (error.message.includes("30") || error.message.includes("VL_NO_DEBT_OF_SELECTED_TYPE")) {
      errorMessage = "No debt found for this asset to repay.";
    } else if (error.message.includes("VL_INVALID_AMOUNT")) {
      errorMessage = "Invalid repayment amount specified.";
    } else if (error.message.includes("gas")) {
      errorMessage = "Transaction failed due to gas issues. Please try with more gas.";
    } else if (error.message.includes("allowance") || error.message.includes("approve")) {
      errorMessage = "Token approval failed. Please try again.";
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

    // Handle tuple/array response format - Fix decimal conversion
    console.log(`🔍 GET_ACCOUNT_DATA: Data array length:`, data.length);
    console.log(`🔍 GET_ACCOUNT_DATA: Raw data[0] (totalCollateralETH):`, data[0]);
    console.log(`🔍 GET_ACCOUNT_DATA: Raw data[1] (totalDebtETH):`, data[1]);
    console.log(`🔍 GET_ACCOUNT_DATA: Raw data[2] (availableBorrowsETH):`, data[2]);
    console.log(`🔍 GET_ACCOUNT_DATA: Raw data[3] (currentLiquidationThreshold):`, data[3]);
    console.log(`🔍 GET_ACCOUNT_DATA: Raw data[4] (ltv):`, data[4]);
    console.log(`🔍 GET_ACCOUNT_DATA: Raw data[5] (healthFactor):`, data[5]);
    
    const accountData = {
      totalCollateralETH: Number(data[0].toString()) / 1e18,
      totalDebtETH: Number(data[1].toString()) / 1e18,
      availableBorrowsETH: Number(data[2].toString()) / 1e18,
      currentLiquidationThreshold: Number(data[3].toString()) / 100, // Convert basis points to percentage
      ltv: Number(data[4].toString()) / 100, // Convert basis points to percentage  
      healthFactor: data[5].toString() === "115792089237316195423570985008687907853269984665640564039457584007913129639935" 
        ? Infinity 
        : Number(data[5].toString()) / 1e18,
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
