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
  AAVE_POOL: "0x87870Bca3F3fd6335C3F4cE8392D69350b4fA4E2", // Aave Pool
  WETH_GATEWAY: "0x6A109e4c2f5D75F16d6e01f29e3A272Bb3A42e6b", // WETH Gateway
  WETH: "0xdd13E55209Fd76AfE204dBda4007C227904f0a81", // WETH Token on Sepolia
  DAI: "0x3e622317f8C93f7328350cF0B56d9eD4C620C5d6" // DAI Token on Sepolia
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

/**
 * Supply Sepolia ETH (native) via WETH Gateway
 */
export const supplySepoliaETH = async (client, account, amount) => {
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
    value: toWei(amount)
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
export const approveToken = async (client, account, tokenAddress, amount) => {
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
export const borrowWETH = async (client, account, amount) => {
  const pool = getPoolContract(client);
  const tx = await prepareContractCall({
    contract: pool,
    method: "borrow",
    params: [CONTRACTS.WETH, toWei(amount), 2, 0, account.address]
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
export const repayWETH = async (client, account, amount) => {
  await approveToken(client, account, CONTRACTS.WETH, toWei(amount));
  const pool = getPoolContract(client);
  const tx = await prepareContractCall({
    contract: pool,
    method: "repay",
    params: [CONTRACTS.WETH, toWei(amount), 2, account.address]
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
export const supplyDAI = async (client, account, amount) => {
  await approveToken(client, account, CONTRACTS.DAI, toWei(amount));
  const pool = getPoolContract(client);
  const tx = await prepareContractCall({
    contract: pool,
    method: "supply",
    params: [CONTRACTS.DAI, toWei(amount), account.address, 0]
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
export const getTokenBalance = async (client, account, tokenAddress) => {
  const token = getTokenContract(client, tokenAddress);
  const balance = await readContract({
    contract: token,
    method: "balanceOf",
    params: [account.address]
  });
  return balance;
};
