import { getContract, prepareContractCall, sendTransaction, readContract } from 'thirdweb';
import { polygonAmoy } from 'thirdweb/chains';
import { createThirdwebClient } from 'thirdweb';

// Initialize client
const client = createThirdwebClient({
  clientId: import.meta.env.VITE_THIRDWEB_CLIENT_ID || "your-client-id"
});

// Contract address on Amoy testnet
export const BLOCKLOAN_CONTRACT_ADDRESS = "0x0B20c9D8cF7B088450bB83272eA2dcfd5e29aC33";

// Contract ABI (essential functions only)
const BLOCKLOAN_ABI = [
  {
    "inputs": [{"internalType": "string", "name": "name", "type": "string"}],
    "name": "createBorrower",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "amount", "type": "uint256"}],
    "name": "deposit",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "amount", "type": "uint256"}],
    "name": "withdraw",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "uint256", "name": "duration", "type": "uint256"},
      {"internalType": "uint256", "name": "interest_rate", "type": "uint256"},
      {"internalType": "uint256", "name": "credit_amount", "type": "uint256"},
      {"internalType": "string", "name": "otherData", "type": "string"}
    ],
    "name": "createApplication",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "appId", "type": "uint256"}],
    "name": "grantLoan",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "uint256", "name": "amount", "type": "uint256"},
      {"internalType": "uint256", "name": "estimatedInterest", "type": "uint256"},
      {"internalType": "uint256", "name": "timeSinceLastPayment", "type": "uint256"}
    ],
    "name": "repayLoan",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "viewBalance",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "account", "type": "address"}],
    "name": "isBorrower",
    "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getNumApplications",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getNumLoans",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "", "type": "address"}],
    "name": "borrowers",
    "outputs": [
      {"internalType": "address", "name": "borrower_public_key", "type": "address"},
      {"internalType": "string", "name": "name", "type": "string"},
      {"internalType": "bool", "name": "EXISTS", "type": "bool"}
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

// Get contract instance
const getBlockLoanContract = () => {
  return getContract({
    client,
    chain: polygonAmoy,
    address: BLOCKLOAN_CONTRACT_ADDRESS,
    abi: BLOCKLOAN_ABI,
  });
};

// Utility function to convert USD to Wei (assuming 1 ETH = $2000)
const usdToWei = (usdAmount) => {
  const ethAmount = parseFloat(usdAmount) / 2000; // Simple conversion
  return BigInt(Math.floor(ethAmount * 1e18));
};

// Check if user is registered borrower
export const isBorrower = async (userAddress) => {
  try {
    const contract = getBlockLoanContract();
    const result = await readContract({
      contract,
      method: "isBorrower",
      params: [userAddress]
    });
    return result;
  } catch (error) {
    console.error('Error checking borrower status:', error);
    return false;
  }
};

// Get borrower details
export const getBorrowerDetails = async (userAddress) => {
  try {
    const contract = getBlockLoanContract();
    const result = await readContract({
      contract,
      method: "borrowers",
      params: [userAddress]
    });
    return {
      address: result[0],
      name: result[1],
      exists: result[2]
    };
  } catch (error) {
    console.error('Error getting borrower details:', error);
    return null;
  }
};

// Create borrower registration
export const createBorrower = async (account, name) => {
  try {
    const contract = getBlockLoanContract();
    const transaction = prepareContractCall({
      contract,
      method: "createBorrower",
      params: [name]
    });

    const result = await sendTransaction({
      transaction,
      account
    });

    return {
      success: true,
      message: "Borrower registered successfully!",
      txHash: result.transactionHash
    };
  } catch (error) {
    console.error('Error creating borrower:', error);
    return {
      success: false,
      message: error.message || "Failed to register borrower"
    };
  }
};

// Deposit MATIC to contract
export const depositMatic = async (account, usdAmount) => {
  try {
    const contract = getBlockLoanContract();
    const amountWei = usdToWei(usdAmount);
    
    const transaction = prepareContractCall({
      contract,
      method: "deposit",
      params: [amountWei],
      value: amountWei
    });

    const result = await sendTransaction({
      transaction,
      account
    });

    return {
      success: true,
      message: `Successfully deposited ${usdAmount} USD worth of MATIC`,
      txHash: result.transactionHash
    };
  } catch (error) {
    console.error('Error depositing MATIC:', error);
    return {
      success: false,
      message: error.message || "Failed to deposit MATIC"
    };
  }
};

// Create loan application
export const createLoanApplication = async (account, duration, interestRate, creditAmount, otherData = "") => {
  try {
    const contract = getBlockLoanContract();
    const amountWei = usdToWei(creditAmount.toString());
    
    const transaction = prepareContractCall({
      contract,
      method: "createApplication",
      params: [
        BigInt(duration), // duration in days/months
        BigInt(interestRate * 100), // interest rate as percentage * 100
        amountWei, // credit amount in wei
        otherData
      ]
    });

    const result = await sendTransaction({
      transaction,
      account
    });

    return {
      success: true,
      message: "Loan application created successfully!",
      txHash: result.transactionHash
    };
  } catch (error) {
    console.error('Error creating loan application:', error);
    return {
      success: false,
      message: error.message || "Failed to create loan application"
    };
  }
};

// Grant loan (for lenders)
export const grantLoan = async (account, applicationId) => {
  try {
    const contract = getBlockLoanContract();
    
    const transaction = prepareContractCall({
      contract,
      method: "grantLoan",
      params: [BigInt(applicationId)]
    });

    const result = await sendTransaction({
      transaction,
      account
    });

    return {
      success: true,
      message: "Loan granted successfully!",
      txHash: result.transactionHash
    };
  } catch (error) {
    console.error('Error granting loan:', error);
    return {
      success: false,
      message: error.message || "Failed to grant loan"
    };
  }
};

// Repay loan
export const repayLoan = async (account, amount, estimatedInterest, timeSinceLastPayment) => {
  try {
    const contract = getBlockLoanContract();
    const amountWei = usdToWei(amount.toString());
    const interestWei = usdToWei(estimatedInterest.toString());
    
    const transaction = prepareContractCall({
      contract,
      method: "repayLoan",
      params: [
        amountWei,
        interestWei,
        BigInt(timeSinceLastPayment)
      ]
    });

    const result = await sendTransaction({
      transaction,
      account
    });

    return {
      success: true,
      message: "Loan repayment successful!",
      txHash: result.transactionHash
    };
  } catch (error) {
    console.error('Error repaying loan:', error);
    return {
      success: false,
      message: error.message || "Failed to repay loan"
    };
  }
};

// Get user balance
export const getUserBalance = async (userAddress) => {
  try {
    const contract = getBlockLoanContract();
    const balance = await readContract({
      contract,
      method: "viewBalance",
      params: []
    });
    
    // Convert wei to ETH
    return parseFloat(balance.toString()) / 1e18;
  } catch (error) {
    console.error('Error getting user balance:', error);
    return 0;
  }
};

// Get number of applications
export const getNumApplications = async () => {
  try {
    const contract = getBlockLoanContract();
    const result = await readContract({
      contract,
      method: "getNumApplications",
      params: []
    });
    return Number(result);
  } catch (error) {
    console.error('Error getting number of applications:', error);
    return 0;
  }
};

// Get number of loans
export const getNumLoans = async () => {
  try {
    const contract = getBlockLoanContract();
    const result = await readContract({
      contract,
      method: "getNumLoans",
      params: []
    });
    return Number(result);
  } catch (error) {
    console.error('Error getting number of loans:', error);
    return 0;
  }
};