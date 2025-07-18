// Custom authentication endpoint for thirdweb Telegram Mini App
// This ensures the same Telegram user always gets the same wallet

import { createThirdwebClient } from "thirdweb";

const client = createThirdwebClient({
  clientId: import.meta.env.VITE_THIRDWEB_CLIENT_ID
});

export async function POST(request) {
  try {
    const { payload } = await request.json();
    const userData = JSON.parse(payload);
    
    console.log("Authentication request for user:", userData);
    
    // Validate required fields
    if (!userData.userId || !userData.username) {
      return new Response(
        JSON.stringify({ error: "Missing required user data" }),
        { 
          status: 400,
          headers: { "Content-Type": "application/json" }
        }
      );
    }
    
    // Use Telegram user ID as the unique identifier for wallet generation
    // This ensures the same user always gets the same wallet
    const userId = userData.userId.toString();
    
    console.log("Generating wallet for Telegram user ID:", userId);
    
    // Return the user ID which thirdweb will use to deterministically generate the wallet
    return new Response(
      JSON.stringify({ 
        userId: userId,
        message: "Authentication successful",
        userData: {
          telegramId: userData.userId,
          username: userData.username,
          firstName: userData.first_name
        }
      }),
      { 
        status: 200,
        headers: { "Content-Type": "application/json" }
      }
    );
    
  } catch (error) {
    console.error("Authentication error:", error);
    return new Response(
      JSON.stringify({ error: "Authentication failed" }),
      { 
        status: 500,
        headers: { "Content-Type": "application/json" }
      }
    );
  }
}