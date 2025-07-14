
import { createThirdwebClient } from "thirdweb";
import {
  ethereum,
  sepolia,
  polygon,
  polygonAmoy,
} from "thirdweb/chains";

// Get the client ID from environment variables
const clientId = import.meta.env.VITE_THIRDWEB_CLIENT_ID;

// Only create the client if we have a valid client ID
export const client =
	clientId && clientId !== "your-thirdweb-client-id-here"
		? createThirdwebClient({ clientId, chains: [sepolia, polygonAmoy] })
		: null;

// Helper function to check if client is available
export const isClientAvailable = () => {
  return client !== null;
};
