import axios from "axios";

// Access the client ID from Vite's environment variables.
// In a Vite project, environment variables prefixed with VITE_ are exposed
// to the client-side code via the `import.meta.env` object.
const THIRDWEB_CLIENT_ID = import.meta.env.VITE_THIRDWEB_CLIENT_ID;

// Check if the client ID is available. It's crucial for the API calls.
if (!THIRDWEB_CLIENT_ID) {
	console.error(
		"VITE_THIRDWEB_CLIENT_ID is not set in your .env file. API calls to thirdweb will fail."
	);
}

/**
 * A pre-configured axios instance for making requests to the
 * thirdweb Universal Bridge API.
 *
 * It automatically includes the required 'x-client-id' header.
 */
const bridge = axios.create({
	// The base URL for all thirdweb Universal Bridge API endpoints.
	baseURL: "https://bridge.thirdweb.com/v1/", // Using the v1 API endpoint

	// Default headers to be sent with every request.
	headers: {
		"Content-Type": "application/json",
		// The client ID is required for authenticating with the thirdweb API.
		"x-client-id": THIRDWEB_CLIENT_ID,
	},
	// You can also set a default timeout (in milliseconds).
	// timeout: 10000,
});

// --- Example Usage (for demonstration) ---
// You can import 'bridge' in other files and use it like this:
/*
import { bridge } from './path/to/this/file';

async function getSupportedTokens(chainId) {
  try {
    const response = await bridge.get('/tokens', {
      params: {
        chainId: chainId,
        // limit: 100, // Optional: for pagination
      }
    });
    console.log('Supported Tokens:', response.data);
    return response.data;
  } catch (error) {
    // Axios provides detailed error information
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Error fetching tokens:', error.response.data);
      console.error('Status:', error.response.status);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received:', error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error:', error.message);
    }
  }
}
*/

// Export the configured instance as the default export
export default bridge;
