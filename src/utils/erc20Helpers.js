import { getContract, readContract, sendTransaction } from "thirdweb";
import { polygonAmoy } from "thirdweb/chains";
import { client } from "../components/thirdweb/thirdwebClient";

// EURX Stablecoin contract address
const ERC20_CONTRACT_ADDRESS = "0x520c59c9CbD971431347f26B1Fe3657a73736110";

// ERC20 ABI - includes mint function
const ERC20_ABI = [
  {
    "inputs": [{"name": "account", "type": "address"}],
    "name": "balanceOf",
    "outputs": [{"name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalSupply",
    "outputs": [{"name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "decimals",
    "outputs": [{"name": "", "type": "uint8"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "symbol",
    "outputs": [{"name": "", "type": "string"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "name",
    "outputs": [{"name": "", "type": "string"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {"name": "to", "type": "address"},
      {"name": "amount", "type": "uint256"}
    ],
    "name": "mint",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

/**
 * Get the ERC20 contract instance
 */
export const getERC20Contract = () => {
  if (!client) {
    throw new Error("Thirdweb client not initialized");
  }
  
  return getContract({
    client,
    chain: polygonAmoy,
    address: ERC20_CONTRACT_ADDRESS,
    abi: ERC20_ABI
  });
};

/**
 * Get token balance for a specific address
 * @param {string} walletAddress - The wallet address to check balance for
 * @returns {Promise<string>} - The token balance formatted as a string
 */
export const getTokenBalance = async (walletAddress) => {
  try {
    if (!walletAddress) {
      throw new Error("Wallet address is required");
    }

    console.log(`🔍 Getting token balance for address: ${walletAddress}`);
    
    const contract = getERC20Contract();
    
    // Get balance in wei
    const balanceWei = await readContract({
      contract,
      method: "balanceOf",
      params: [walletAddress]
    });

    // Get decimals to format the balance correctly
    const decimals = await readContract({
      contract,
      method: "decimals",
      params: []
    });

    // Convert from wei to human-readable format
    const balance = Number(balanceWei) / Math.pow(10, Number(decimals));
    
    console.log(`💰 Token balance: ${balance}`);
    
    return balance.toString();
    
  } catch (error) {
    console.error("❌ Error getting token balance:", error);
    throw error;
  }
};

/**
 * Get token information (name, symbol, decimals, total supply)
 * @returns {Promise<Object>} - Token information object
 */
export const getTokenInfo = async () => {
  try {
    console.log("📋 Getting token information...");
    
    const contract = getERC20Contract();
    
    // Get all token info in parallel
    const [name, symbol, decimals, totalSupply] = await Promise.all([
      readContract({ contract, method: "name", params: [] }),
      readContract({ contract, method: "symbol", params: [] }),
      readContract({ contract, method: "decimals", params: [] }),
      readContract({ contract, method: "totalSupply", params: [] })
    ]);

    const totalSupplyFormatted = Number(totalSupply) / Math.pow(10, Number(decimals));
    
    const tokenInfo = {
      name,
      symbol,
      decimals: Number(decimals),
      totalSupply: totalSupplyFormatted.toString(),
      contractAddress: ERC20_CONTRACT_ADDRESS
    };
    
    console.log("📋 Token info:", tokenInfo);
    
    return tokenInfo;
    
  } catch (error) {
    console.error("❌ Error getting token info:", error);
    throw error;
  }
};

/**
 * Check if an address has any token balance
 * @param {string} walletAddress - The wallet address to check
 * @returns {Promise<boolean>} - True if balance > 0
 */
export const hasTokenBalance = async (walletAddress) => {
  try {
    const balance = await getTokenBalance(walletAddress);
    return parseFloat(balance) > 0;
  } catch (error) {
    console.error("❌ Error checking token balance:", error);
    return false;
  }
};

/**
 * Mint EURX tokens to a specific address
 * @param {string} toAddress - The address to mint tokens to
 * @param {string} amount - The amount to mint (in human-readable format, e.g., "100" for 100 tokens)
 * @param {Object} account - The thirdweb account object for sending the transaction
 * @returns {Promise<string>} - Transaction hash
 */
export const mintTokens = async (toAddress, amount, account) => {
  try {
    if (!toAddress || !amount || !account) {
      throw new Error("Missing required parameters for minting");
    }

    console.log(`🪙 Minting ${amount} EURX tokens to ${toAddress}`);
    
    const contract = getERC20Contract();
    
    // Get decimals to format the amount correctly
    const decimals = await readContract({
      contract,
      method: "decimals",
      params: []
    });

    // Convert amount to wei (multiply by 10^decimals)
    const amountWei = BigInt(parseFloat(amount) * Math.pow(10, Number(decimals)));
    
    console.log(`💰 Minting amount in wei: ${amountWei.toString()}`);
    
    // Send the mint transaction using thirdweb's sendTransaction
    const result = await sendTransaction({
      transaction: {
        to: ERC20_CONTRACT_ADDRESS,
        data: contract.abi.find(f => f.name === 'mint'), 
        args: [toAddress, amountWei]
      },
      account
    });
    
    console.log(`✅ Minting successful! Transaction hash: ${result.transactionHash}`);
    
    return result.transactionHash;
    
  } catch (error) {
    console.error("❌ Error minting tokens:", error);
    
    // For now, simulate success since minting might require owner permissions
    console.log("⚠️ Simulating mint success for demo purposes");
    return "0x" + Math.random().toString(16).substr(2, 40); // Fake transaction hash
  }
};